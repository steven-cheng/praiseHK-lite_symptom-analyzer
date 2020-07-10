import React, {useState, useEffect, useRef, useContext} from 'react';
import {DatabaseContext, SystemServiceContext} from '../App';
import Typography from "@material-ui/core/Typography";
import TodayIcon from '@material-ui/icons/Today';
import format from 'date-fns/format';
import plusIcon from '../img/plus.svg';
import Button from '@material-ui/core/Button';
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from '@material-ui/core/DialogActions';
import SymptomCard from "../components/SymptomCard";
import params_keys from "../utils/apiKeys";
import $ from 'jquery';
import usePrevious from "../components/usePrevious";


export default function Home(props) {
    const [isOpenAddNewSymptom_dialog, set_isOpenAddNewSymptom_dialog] = useState(false);
    const [isOpenSaveNewSymptoms_dialog, set_isOpenSaveNewSymptoms_dialog] = useState(false);
    const [symptomTypes, setSymptomTypes] = useState(null);
    const [oldSymptoms, setOldSymptoms] = useState([]);
    const [newSymptoms, setNewSymptoms] = useState([]);
    const [addNewSymptomInputValue, setAddNewSymptomInputValue] = useState('');
    const [confirmedSaveNewSymptoms, setConfirmedSaveNewSymptoms] = useState(false);
    const prevSaveNewSymptoms = usePrevious(props.saveNewSymptoms);
    let db = useContext(DatabaseContext);
    let loader = useContext(SystemServiceContext).loader;
    let errorDialog = useContext(SystemServiceContext).errorDialog;


    function open_addNewSymptom_dialog() {
        set_isOpenAddNewSymptom_dialog(true);
    }

    function close_addNewSymptom_dialog() {
        set_isOpenAddNewSymptom_dialog(false);
        setAddNewSymptomInputValue('');
    }

    function close_saveNewSymptoms_dialog() {
        set_isOpenSaveNewSymptoms_dialog(false);
        if(props.saveNewSymptoms) {
            props.setSaveNewSymptoms(false);
        }
    }

    function userConfirmedSaveNewSymptoms() {
        close_saveNewSymptoms_dialog();
        setConfirmedSaveNewSymptoms(true);
    }

    function addNewSymptomType(typeName) {
        let objectStore = db.transaction(['symptom_types'], 'readwrite').objectStore('symptom_types');
        let request = objectStore.add({name: typeName});
        request.onsuccess = function (event) {
            setSymptomTypes([...symptomTypes, typeName]);
            addNewSymptom();
        }
    }

    function addNewSymptom() {
        const trimmedNewSymptomName = addNewSymptomInputValue.trim();
        let objectStore = db.transaction(['symptom_types']).objectStore('symptom_types');
        objectStore.openCursor().onsuccess = function(event) {
            let cursor = event.target.result;
            if(cursor) {
                if (trimmedNewSymptomName === cursor.value.name) {
                    setNewSymptoms( [
                            ...newSymptoms,
                            {
                                tempID: 'temp'+newSymptoms.length,
                                typeName: trimmedNewSymptomName,
                                isNull: false,
                                severity: 1
                            }
                        ]
                    );
                } else {
                    cursor.continue();
                }
            } else {
                addNewSymptomType(trimmedNewSymptomName);
            }
        };
        close_addNewSymptom_dialog();
    }

    function handle_isNull_changed(tempID, isNull) {
        setNewSymptoms(
            newSymptoms.map((symptom)=>{
                if(symptom.tempID === tempID) {
                    symptom.isNull = isNull;
                }
                return symptom;
            })
        );
    }

    function handle_severity_changed(tempID, severity) {
        setNewSymptoms(
            newSymptoms.map((symptom)=>{
                if(symptom.tempID === tempID) {
                    symptom.severity = severity;
                }
                return symptom;
            })
        );
    }

    /** Get symptom types and then Get saved symptoms (current date only) from DB when mounted */
    useEffect(()=>{
        /* Get symptom types */
        let symptom_types = [];
        db.transaction(['symptom_types']).objectStore('symptom_types').openCursor().onsuccess = (event)=> {
            let cursor = event.target.result;
            if(cursor) {
                symptom_types.push(cursor.value.name);
                cursor.continue();
            } else {
                setSymptomTypes(symptom_types);

                /* Get saved symptoms (current date only) */
                let objectStore = db.transaction('symptoms_pollutants_relation').objectStore('symptoms_pollutants_relation');
                let index = objectStore.index('datetime');
                let today = format(new Date(), 'yyyy-MM-dd');
                let boundKeyRange = IDBKeyRange.bound(today+' 00:00', today+' 23:59');
                let request = index.openCursor(boundKeyRange);
                let oldSymptoms = [];
                let newSymptoms = [];
                request.onsuccess = (event) => {
                    let cursor = event.target.result;
                    if(cursor) {
                        oldSymptoms.push({
                            id: cursor.value.id,
                            datetime: cursor.value.datetime,
                            typeName: cursor.value.typeName,
                            severity: cursor.value.severity
                        });
                        cursor.continue();
                    } else { // after retrieving all the records
                        if(oldSymptoms.length>0)
                            setOldSymptoms(oldSymptoms);
                        symptom_types.forEach((symptom_type) => {
                            let noMatch_flag = true;
                            oldSymptoms.every((oldSymptom) => {
                                if(oldSymptom.typeName === symptom_type) {
                                    noMatch_flag = false;
                                    return false;
                                } else {
                                    return true;
                                }
                            });
                            if(noMatch_flag) {
                                newSymptoms.push({
                                    tempID: 'temp'+newSymptoms.length,
                                    typeName: symptom_type,
                                    isNull: true,
                                    severity: 1
                                })
                            }
                        });
                        if(newSymptoms.length>0)
                            setNewSymptoms(newSymptoms);
                    }
                };
                request.onerror = (event) => {
                    console.log('Error on loading data from the database');
                };

            }
        };
    },[]);


    /** Show a confirmation dialog when 'save button is clicked */
    useEffect(()=>{
        if(!props.saveNewSymptoms)
            return;
        if(props.saveNewSymptoms && newSymptoms.length===0) {
            props.setSaveNewSymptoms(false);
            return;
        }
        if(props.saveNewSymptoms && !prevSaveNewSymptoms && newSymptoms.length>0) {
            set_isOpenSaveNewSymptoms_dialog(true);
        }
    },[props.saveNewSymptoms])

    /** Insert new symptoms into DB */
    useEffect( ()=>{
        if(confirmedSaveNewSymptoms) {
            if(newSymptoms.length >0) {
                loader.loaderSwitch('on');

                let lngLat = {lng:null, lat:null};
                let dateTime = new Date()
                let dateTime_string = format(dateTime, 'yyyy-MM-dd HH:mm');
                let dateTime_isoString  = dateTime.toISOString();

                getCurrentPosition({maximumAge:10000, timeout:20000, enableHighAccuracy:true})
                .then((position)=>{
                    lngLat.lng = position.coords.longitude;
                    lngLat.lat = position.coords.latitude;

                    let params = {
                        todo: "get_data",
                        lng: lngLat.lng.toString(),
                        lat: lngLat.lat.toString(),
                        t0:  dateTime_isoString,
                        t1:  dateTime_isoString,
                        //pids: "PM10,PM2.5,NO2,O3,SO2,AQHIBN,AQHIER,AQHIPM10,AQHIPM25,AQHINO2,AQHIO3,AQHISO2",
                        pids: "PM10,PM2.5,NO2,O3,SO2,AQHIBN,AQHIER",
                        ...params_keys
                    };

                    return $.when($.ajax({
                                dataType: 'json',
                                url: 'https://praise-web.ust.hk/uwsgi/praise-service/',
                                data: params
                            }));
                }, (error)=>{
                    errorDialog.setErrorMsg(null, 'Unable to get the position');
                    console.log('cannot get position');
                })
                .then( (data) => {
                        return new Promise((resolve,reject) => {
                            if(data.status === 0) {
                                let transaction = db.transaction(['symptoms_pollutants_relation'], 'readwrite');
                                transaction.onerror = (event) => {reject('Error : Unable to insert new symptoms into the DB')};
                                transaction.oncomplete = (event) => {resolve('All new symptoms are inserted into DB')};
                                let objectStore = transaction.objectStore('symptoms_pollutants_relation');
                                newSymptoms.forEach((newSymptom)=>{
                                    if(!newSymptom.isNull) {
                                        let newSymptom_forDB = {
                                            datetime: dateTime_string,
                                            coordinates: lngLat,
                                            typeName: newSymptom.typeName,
                                            severity: newSymptom.severity,
                                            pollutantsValue: {
                                                AQHI: data.AQHIBN[0],
                                                pctAR: data.AQHIER[0],
                                                NO2: data.NO2[0],
                                                SO2: data.SO2[0],
                                                O3: data.O3[0],
                                                'PM2.5': data['PM2.5'][0],
                                                PM10: data.PM10[0]
                                            }
                                        };
                                        let request = objectStore.add(newSymptom_forDB);
                                        request.onsuccess = (event) => {
                                            newSymptom.id = event.target.result;
                                            newSymptom.datetime = dateTime_string;
                                        }
                                    }
                                });
                            } else {
                                reject('Error in the pollutant info: Downloaded data not valid');
                            }
                        })
                }, (jqXHR, errorTextStatus) => {
                    errorDialog.setErrorMsg(null, 'Error in downloading pollutant info: '+ errorTextStatus);
                    console.log('Error in downloading pollutant info: ', errorTextStatus);
                })
                .then((value) => {
                    /* After the new symptoms insertion is successfully done, refresh the old & new symptom list */
                    let newSymptoms_toBeAddedTo_oldSymptoms = [];
                    newSymptoms.forEach((newSymptom) => {
                        if(newSymptom.id) { // having an 'id' value means it's added to the DB successfully
                            newSymptoms_toBeAddedTo_oldSymptoms.push({
                                id: newSymptom.id,
                                datetime: newSymptom.datetime,
                                typeName: newSymptom.typeName,
                                severity: newSymptom.severity
                            });
                        }
                    });
                    setNewSymptoms([]);
                    setOldSymptoms([...oldSymptoms, ...newSymptoms_toBeAddedTo_oldSymptoms]);
                }, (failedReason) => {
                    errorDialog.setErrorMsg(null, failedReason);
                    console.log(failedReason);
                })
                .finally(()=>{
                    loader.loaderSwitch('off');
                    setConfirmedSaveNewSymptoms(false);
                    props.setSaveNewSymptoms(false);
                });
            } else {
                props.setSaveNewSymptoms(false);
            }
        }
    },[confirmedSaveNewSymptoms]);

    /** Prepare for rendering */
    const symptoms = [...newSymptoms.slice().reverse(), ...oldSymptoms.slice().reverse()]; // slice is used here to clone an array
    const symptomCards = symptoms.map((symptom)=>{
        if(symptom.id) {
            /* Return a card for old symptoms */
            return (
                <SymptomCard
                    key={symptom.id}
                    id={symptom.id}
                    datetime={symptom.datetime}
                    name={symptom.typeName}
                    severity={symptom.severity}
                />
            );
        } else {
            /* Return a card for new symptoms */
            return (
                <SymptomCard
                    key={symptom.tempID}
                    tempID={symptom.tempID}
                    name={symptom.typeName}
                    isNull={symptom.isNull}
                    onisNullChange={handle_isNull_changed}
                    severity={ symptom.severity? symptom.severity:null }
                    onSeverityChange={handle_severity_changed}
                />
            );
        }
    });

    return (
        <div className='page'>
            <p style={{ marginTop:'20px' }}>
                <TodayIcon color="primary" style={{verticalAlign:'text-bottom'}} /> &nbsp; {format(new Date(), 'dd MMMM yyyy')}
            </p>
            <div>
                <div onClick={open_addNewSymptom_dialog} style={{marginTop:'40px', cursor:'pointer'}}>
                    <img src={plusIcon} width={24} height={24} style={{verticalAlign:'text-bottom'}} /> &nbsp;&nbsp;
                    <Typography variant='h6' style={{display:'inline-block'}}>Add New Symptom</Typography>
                </div>
                <br/>
                {symptomCards}
            </div>

            {/* Add SymptomCard Dialog */}
            <Dialog
                open={isOpenAddNewSymptom_dialog}
                onClose={close_addNewSymptom_dialog}
            >
                <DialogTitle style={{textAlign:'center'}}>Add Symptom</DialogTitle>
                <DialogContent>
                    <Autocomplete
                        freeSolo
                        options={symptomTypes}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="SymptomCard Name"
                                margin="normal"
                                variant="outlined"
                            />
                        )}
                        value={addNewSymptomInputValue}
                        onInputChange={ (ev, value)=>{setAddNewSymptomInputValue(value)} }
                        style={{minWidth:'20ch'}}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={close_addNewSymptom_dialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={addNewSymptom} color="primary">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Save New Symptoms Dialog */}
            <Dialog
                open={isOpenSaveNewSymptoms_dialog}
                onClose={close_saveNewSymptoms_dialog}
            >
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure? Once saved, you are now allowed to edit or remove it.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={userConfirmedSaveNewSymptoms} color="primary">
                        Confirm
                    </Button>
                    <Button onClick={close_saveNewSymptoms_dialog} color="primary" autoFocus>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}


function getCurrentPosition(geolocationOptions) {
    return new Promise( (resolve, reject) => {
        window.navigator.geolocation.getCurrentPosition(resolve, reject, geolocationOptions);
    });
}