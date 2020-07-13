import React, {useState, useEffect, useRef, useContext} from 'react';
import {DatabaseContext, SystemServiceContext} from '../App';
import Typography from "@material-ui/core/Typography";
import TodayIcon from '@material-ui/icons/Today';
import format from 'date-fns/format';
import plusIcon from '../img/plus.svg';
import Button from '@material-ui/core/Button';
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
    const [isOpenAddNewSymptomType_dialog, set_isOpenAddNewSymptomType_dialog] = useState(false);
    const [newSymptomInputError_flag, set_newSymptomInputError_flag] = useState({hoisted:false, error:null});
    const [isOpenSaveNewSymptoms_dialog, set_isOpenSaveNewSymptoms_dialog] = useState(false);
    //const [symptomTypes, setSymptomTypes] = useState(null);
    const [newSymptoms, setNewSymptoms] = useState([]);
    const [addNewSymptomType_inputValue, set_addNewSymptomType_inputValue] = useState('');
    const [confirmedSaveNewSymptoms, setConfirmedSaveNewSymptoms] = useState(false);
    const prevSaveNewSymptoms = usePrevious(props.saveNewSymptoms);
    let db = useContext(DatabaseContext);
    let loader = useContext(SystemServiceContext).loader;
    let errorDialog = useContext(SystemServiceContext).errorDialog;


    function open_addNewSymptomType_dialog() {
        set_isOpenAddNewSymptomType_dialog(true);
    }

    function close_addNewSymptomType_dialog() {
        if(newSymptomInputError_flag.hoisted)
            set_newSymptomInputError_flag({hoisted:false, error: null});
        set_isOpenAddNewSymptomType_dialog(false);
        set_addNewSymptomType_inputValue('');
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

    function addNewSymptomType() {
        const trimmedNewSymptomTypeName = addNewSymptomType_inputValue.trim();
        if(trimmedNewSymptomTypeName === '') {
            set_newSymptomInputError_flag({hoisted: true, error: 'Name cannot be empty'});
            return;
        }
        let objectStore = db.transaction(['symptom_types'], 'readwrite').objectStore('symptom_types');
        let request = objectStore.add({name: trimmedNewSymptomTypeName});
        request.onsuccess = function (event) {
            //setSymptomTypes([...symptomTypes, trimmedNewSymptomTypeName]);
            setNewSymptoms( [
                    ...newSymptoms,
                    {
                        tempID: 'temp'+newSymptoms.length,
                        typeName: trimmedNewSymptomTypeName,
                        isNull: false,
                        severity: 1
                    }
                ]
            );
            close_addNewSymptomType_dialog();
        };
        request.onerror = function (event) {
            if(event.target.error.name === 'ConstraintError') {
                console.log('Error : The symptom name is already existed');
                set_newSymptomInputError_flag({hoisted:true, error:'The symptom name is already existed'});
            } else {
                console.log('Database Error : Unable to add symptom type.');
            }
        };
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

    /** Get symptom types from DB when mounted, and then create a new symptom for each type */
    useEffect(()=>{
        /* Get symptom types */
        let symptom_types = [];
        db.transaction(['symptom_types']).objectStore('symptom_types').openCursor().onsuccess = (event)=> {
            let cursor = event.target.result;
            if(cursor) {
                symptom_types.push(cursor.value.name);
                cursor.continue();
            } else {
                //setSymptomTypes(symptom_types);

                let newSymptoms = [];
                symptom_types.forEach( (symptom_type) => {
                    newSymptoms.push({
                        tempID: 'temp'+newSymptoms.length,
                        typeName: symptom_type,
                        isNull: true,
                        severity: 1
                    })
                });
                setNewSymptoms(newSymptoms);
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
                    /* After the new symptoms insertion is successfully done, empty the new symptom list */
                    setNewSymptoms([]);
                }, (failedReason) => {
                    errorDialog.setErrorMsg(null, failedReason);
                    console.log(failedReason);
                })
                .finally(()=>{
                    loader.loaderSwitch('off');
                    setConfirmedSaveNewSymptoms(false);
                    props.setSaveNewSymptoms(false);
                    // todo redirect to the chart page with data
                });
            } else {
                props.setSaveNewSymptoms(false);
            }
        }
    },[confirmedSaveNewSymptoms]);

    /** Prepare for rendering */
    const symptomCards = newSymptoms.slice().reverse().map((symptom)=>{  // slice is used here to clone an array
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
    });

    return (
        <div className='page'>
            <p style={{ marginTop:'20px' }}>
                <TodayIcon color="primary" style={{verticalAlign:'text-bottom'}} /> &nbsp; {format(new Date(), 'dd MMMM yyyy')}
            </p>
            <div>
                <div onClick={open_addNewSymptomType_dialog} style={{marginTop:'40px', cursor:'pointer'}}>
                    <img src={plusIcon} width={24} height={24} style={{verticalAlign:'text-bottom'}} /> &nbsp;&nbsp;
                    <Typography variant='h6' style={{display:'inline-block'}}>Add New Symptom</Typography>
                </div>
                <br/>
                {symptomCards}
            </div>

            {/* Add New Symptom Type Dialog */}
            <Dialog
                open={isOpenAddNewSymptomType_dialog}
                onClose={close_addNewSymptomType_dialog}
            >
                <DialogTitle style={{textAlign:'center'}}>Add Symptom</DialogTitle>
                <DialogContent>
                    <TextField
                        label="New Symptom Name"
                        margin="normal"
                        variant="outlined"
                        value={addNewSymptomType_inputValue}
                        onChange={ (event)=>{set_addNewSymptomType_inputValue(event.target.value)} }
                        error = {newSymptomInputError_flag.hoisted}
                        helperText={newSymptomInputError_flag.hoisted? newSymptomInputError_flag.error:''}
                        style={{minWidth:'24ch'}}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={close_addNewSymptomType_dialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={addNewSymptomType} color="primary">
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
                    <DialogContentText>
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