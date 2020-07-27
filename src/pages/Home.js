import React, {useState, useEffect, useRef, useContext} from 'react';
import {Redirect} from "react-router-dom";
import {DatabaseContext, SystemServiceContext} from '../App';
import Typography from "@material-ui/core/Typography";
import TodayIcon from '@material-ui/icons/Today';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
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
    const [toURL, setToURL] = useState({path:null, state:null});
    const [isOpenAddNewSymptomType_dialog, set_isOpenAddNewSymptomType_dialog] = useState(false);
    const [newSymptomInputError_flag, set_newSymptomInputError_flag] = useState({hoisted:false, error:null});
    const [isOpenSaveNewSymptoms_dialog, set_isOpenSaveNewSymptoms_dialog] = useState(false);
    const prevSymptomTypes = usePrevious(props.symptomTypes);
    const [newSymptoms, setNewSymptoms] = useState([]);
    const prevNewSymptoms = usePrevious(newSymptoms);
    const [addNewSymptomType_inputValue, set_addNewSymptomType_inputValue] = useState('');
    const [confirmedSaveNewSymptoms, setConfirmedSaveNewSymptoms] = useState(false);
    const [currentDateTime, setCurrentDateTime] = useState(getCurrentDateTime());
    const prevSaveNewSymptoms = usePrevious(props.saveNewSymptoms);
    const [deleteSymptomType, setDeleteSymptomType] = useState(null);
    let db = useContext(DatabaseContext);
    let loader = useContext(SystemServiceContext).loader;
    let errorDialog = useContext(SystemServiceContext).errorDialog;


    function getCurrentDateTime() {
        return format(new Date(), 'dd MMMM yyyy  HH:mm');
    }

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
            props.setSymptomTypes([...props.symptomTypes, trimmedNewSymptomTypeName]);
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

    /** When mounted or updated, create a new symptom item for each type */
    useEffect(()=>{
        let newSymptoms = [];
        for(let i=0; i<props.symptomTypes.length; i++) {
            let symptomType = props.symptomTypes[i];

            /* default symptom value */
            let newSymptom = {
                tempID: 'temp_'+symptomType,
                typeName: symptomType,
                isNull: false,
                severity: 1
            };

            /* Use the previous value if that type still existed at re-render */
            if(prevNewSymptoms) {
                prevNewSymptoms.every( (prevNewSymptom) => {
                    if(prevNewSymptom.typeName === symptomType) {
                        newSymptom = prevNewSymptom;
                        return false;
                    } else {
                        return true;
                    }
                });
            }

            newSymptoms.push(newSymptom);
        }

        setNewSymptoms(newSymptoms);
    }, [props.symptomTypes])


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

    /** test only */
    // useEffect(()=>{
    //     let inputData = [
    //         ['2020071515',114.174793, 22.323001, { "IO":"Outdoor" }, 0.087]
    //     ];
    //     let params = {
    //         todo: "expo_cal",
    //         //myid: 'praisehk-symanaly',
    //         apikey: 'SgeP3H6gFKdq',
    //         input_data: JSON.stringify(inputData)
    //     }
    //     $.ajax({
    //         dataType: 'text',
    //         url: ' https://praise-web.ust.hk/uwsgi/praise-ir-cal/',
    //         data: params,
    //         success: (data)=>{console.log('data :', data)},
    //         error: (jqXHR, errorStatus)=>{console.log('failed :', errorStatus)}
    //     })
    // },[])

    /** Insert new symptoms into DB */
    useEffect( ()=>{
        if(confirmedSaveNewSymptoms) {
            if(newSymptoms.length >0) {
                loader.loaderSwitch('on');

                let savedSymptomsName = [];
                let savedSymptomsNameNumberCount = [];
                let savedSymptomsSeverity = [];
                let savedSymptomsPollutantsValue;
                let chosenSymptom;
                let chosenSymptomSeverity;
                let startDate;
                let taskFailed_flag = false;

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
                    taskFailed_flag = true;
                })
                .then( (data) => {
                        return new Promise((resolve,reject) => {
                            if(data.status === 0) {
                                let transaction = db.transaction(['symptoms_pollutants_relation'], 'readwrite');
                                transaction.onerror = (event) => {reject('Error : Unable to insert new symptoms into the DB')};
                                transaction.oncomplete = (event) => {resolve('All new symptoms are inserted into DB')};
                                let objectStore = transaction.objectStore('symptoms_pollutants_relation');
                                savedSymptomsPollutantsValue = {
                                                                AQHI: data.AQHIBN[0],
                                                                pctAR: data.AQHIER[0],
                                                                NO2: data.NO2[0],
                                                                SO2: data.SO2[0],
                                                                O3: data.O3[0],
                                                                PM2dot5: data['PM2.5'][0],
                                                                PM10: data.PM10[0]
                                                            };
                                newSymptoms.forEach((newSymptom)=>{
                                    if(!newSymptom.isNull) {
                                        let newSymptom_forDB = {
                                            datetime: dateTime_string,
                                            coordinates: lngLat,
                                            typeName: newSymptom.typeName,
                                            severity: newSymptom.severity,
                                            pollutantsValue: savedSymptomsPollutantsValue
                                        };
                                        let request = objectStore.add(newSymptom_forDB);
                                        request.onsuccess = (event) => {
                                            newSymptom.id = event.target.result;
                                            newSymptom.datetime = dateTime_string;

                                            savedSymptomsName.push(newSymptom.typeName);
                                            savedSymptomsSeverity.push(newSymptom.severity);
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
                    taskFailed_flag = true;
                })
                .then((value) => { // After the new symptoms insertion is successfully done
                    /*
                    *  Among the saved symptoms, count which one is saved most (in the history).
                    *  This one will be used to plot the chart in Chart.js (the user will be redirected to that page
                    *  immediately after save)
                    */
                    const objectStore = db.transaction('symptoms_pollutants_relation').objectStore('symptoms_pollutants_relation');
                    const index = objectStore.index('typeName');
                    let countPromises = savedSymptomsName.map((typeName)=>{
                                            let countRequest = index.count(typeName);
                                            return new Promise((resolve, reject)=>{
                                                countRequest.onsuccess = ()=>{
                                                    resolve(countRequest.result);
                                                };
                                                countRequest.onerror = ()=>{
                                                    reject();
                                                };
                                            });
                                        });
                    return Promise.all(countPromises);
                }, (failedReason) => {
                    errorDialog.setErrorMsg(null, failedReason);
                    console.log(failedReason);
                    taskFailed_flag = true;
                })
                .then((counts) => { // retrieve the start recording date of the chosen symptom
                    return new Promise((resolve,reject) => {
                        const chosenSymptomIndex = counts.indexOf(Math.max(...counts));
                        chosenSymptom = savedSymptomsName[chosenSymptomIndex];
                        chosenSymptomSeverity = savedSymptomsSeverity[chosenSymptomIndex];
                        const objectStore = db.transaction('symptoms_pollutants_relation').objectStore('symptoms_pollutants_relation');
                        const index = objectStore.index('typeName,datetime,severity');
                        const boundKeyRange = IDBKeyRange.bound(
                            [chosenSymptom, '2000-01-01 00:00', Number.MIN_SAFE_INTEGER],
                            [chosenSymptom, '9999-12-31 00:00', Number.MAX_SAFE_INTEGER]
                        );
                        const request = index.openCursor(boundKeyRange);
                        request.onsuccess = (event)=>{
                            let cursor = event.target.result;
                            if(cursor) {
                                resolve(cursor.value.datetime) // we just need the 1st record
                            }
                        };
                        request.onerror = ()=> {
                            reject();
                        };
                    });
                }, ()=>{
                    console.log('Counting of the no. of the types in the database failed');
                    errorDialog.setErrorMsg(null, 'Database counting operation failed');
                    taskFailed_flag = true;
                })
                .then((startDate_string)=>{
                    startDate = parse(startDate_string, 'yyyy-MM-dd HH:mm', new Date());
                }, ()=>{
                    console.log('Starting date retrieval in the database failed');
                    errorDialog.setErrorMsg(null, 'Database "starting date retrieval" operation failed');
                    taskFailed_flag = true;
                })
                .finally(()=>{
                    loader.loaderSwitch('off');
                    setConfirmedSaveNewSymptoms(false);
                    props.setSaveNewSymptoms(false);
                    // redirect to the chart page with data
                    if(!taskFailed_flag) {
                        setToURL({
                            path: '/chart',
                            state: {
                                symptom:chosenSymptom,
                                highlightSymptom: true,
                                highlightedSymptomCurrentSeverity: chosenSymptomSeverity,
                                highlightedSymptomCurrentPollutantsValue: savedSymptomsPollutantsValue,
                                dateRange: {start: startDate, end: new Date()}
                            }
                        });
                    }
                });
            } else {
                props.setSaveNewSymptoms(false);
            }
        }
    },[confirmedSaveNewSymptoms]);

    /** Set Current Date & Time and refresh it after some short time */
    useEffect(()=>{
        const id = setInterval(()=>{setCurrentDateTime(getCurrentDateTime())}, 30000);
        return(()=>{clearInterval(id)});
    },[]);

    /** Scroll down to the bottom of the page after new symptom added (to enhance the user experience only) */
    useEffect(()=>{
        if(
            prevNewSymptoms &&
            prevNewSymptoms.length !== 0 &&
            prevNewSymptoms.length < newSymptoms.length
        ) {
            window.scrollBy(0,document.body.scrollHeight);
        }
    }, [newSymptoms]);


    /** Delete a type of symptom */
    useEffect(()=>{
        if(deleteSymptomType) {
            const transaction1 = db.transaction(['symptoms_pollutants_relation'],'readwrite');
            const objectStore1 = transaction1.objectStore('symptoms_pollutants_relation');
            const index1 = objectStore1.index('typeName');
            const request1 = index1.openKeyCursor(IDBKeyRange.only(deleteSymptomType));
            request1.onsuccess = () => {
                let cursor = request1.result;
                if(cursor) {
                    objectStore1.delete(cursor.primaryKey);
                    cursor.continue();
                }
            }
            transaction1.oncomplete = () => {
                const transaction2 = db.transaction(['symptom_types'],'readwrite');
                const objectStore2 = transaction2.objectStore('symptom_types');
                const index2 = objectStore2.index('symptom_type_name');
                const request2 = index2.openKeyCursor(IDBKeyRange.only(deleteSymptomType));
                request2.onsuccess = () => {
                    let cursor = request2.result;
                    if(cursor) {
                        objectStore2.delete(cursor.primaryKey);
                        cursor.continue();
                    } else { // When all are done for the database part
                        props.setSymptomTypes(
                            props.symptomTypes.filter((symptomType)=>{
                                return (symptomType !== deleteSymptomType);
                            })
                        )
                    }
                }
                request2.onerror = () => {
                    console.log('Error occurred when deleting symptom type records in "symptom_types"');
                }
            }
            transaction1.onerror = () => {
                console.log('Error occurred when deleting symptom records in "symptoms_pollutants_relation"');
            }

            setDeleteSymptomType(null);
        }
    },[deleteSymptomType])

    /** Prepare for rendering */
    const symptomCards = newSymptoms.map((symptom)=>{
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
                    deleteSymptomType={setDeleteSymptomType}
                />
            );
    });

    /** Rendering */
    if(toURL.path) {
        return(
            <Redirect to={{
                    pathname: toURL.path,
                    state: toURL.state? toURL.state:null
                }}
            />
        )
    }

    return (
        <div className='page'>
            <p style={{ marginTop:'20px' }}>
                <TodayIcon color="primary" style={{verticalAlign:'text-bottom'}} /> &nbsp; {currentDateTime}
            </p>
            <div>
                <br/>
                {symptomCards}
                <br/>
                <div id='addNewSymptom_div' onClick={open_addNewSymptomType_dialog} style={{marginBottom:100, cursor:'pointer'}}>
                    <img src={plusIcon} width={24} height={24} style={{verticalAlign:'text-bottom'}} /> &nbsp;&nbsp;
                    <Typography variant='h6' style={{display:'inline-block'}}>Add New Symptom</Typography>
                </div>
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