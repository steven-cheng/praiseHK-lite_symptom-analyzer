import React, {useState, useEffect, useRef, useContext} from 'react';
import usePrevious from "../components/usePrevious";
import Typography from "@material-ui/core/Typography";
import TextField from '@material-ui/core/TextField';
import InputAdornment from "@material-ui/core/InputAdornment";
import DateRangeIcon from '@material-ui/icons/DateRange';
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import {DatePicker} from "@material-ui/pickers";
import Button from "@material-ui/core/Button";
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Divider from "@material-ui/core/Divider";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Container from "@material-ui/core/Container";
import format from 'date-fns/format';
import {DatabaseContext, SystemServiceContext} from "../App";
import ChartJs from 'chart.js';
import $ from 'jquery';
import './Chart.css';
import parse from 'date-fns/parse';


export default function Chart(props) {
    const db = useContext(DatabaseContext);
    const errorDialog = useContext(SystemServiceContext).errorDialog;

    /* Note: In this page, 'symptom' and 'symptomType' is interchangeable here */
    const [symptomType, setSymptomType] = useState(()=>{
        if(props.location.state && props.location.state.symptom)
            return props.location.state.symptom;

        // if no 'symptomType' value passed, return null first. We will get the type from the DB (the one has most records) a bit later.
        return null;
    });
    const prevSymptomType = usePrevious(symptomType);
    /* If the symptom needs to be highlighted, there will be info in it. Otherwise, 'symptomHighlight' value is null */
    const [symptomHighlight, setSymptomHighlight] = useState(()=>{
        if(props.location.state && props.location.state.highlightSymptom)
            return {
                    currentSeverity: props.location.state.highlightedSymptomCurrentSeverity,
                    currentPollutantsValue: props.location.state.highlightedSymptomCurrentPollutantsValue
                };

        return null;
    })
    const [dateRange, setDateRange] = useState(()=>{
        if(props.location.state && props.location.state.dateRange)
            return { start: props.location.state.dateRange.start, end: props.location.state.dateRange.end };

        /*
        *  If no dateRange is passed, start date will be set to null temporarily.
        *  And will be set after obtaining value from the DB a bit later.
        */
        return { start: null, end: new Date() };
    });
    const prevDateRange = usePrevious(dateRange);

    // The following property is used by the date picker dialog to temporarily hold a start date value
    const [dateRange_startTemp, set_dateRange_startTemp] = useState(null);

    const [pollutant, setPollutant] = useState('AQHI');
    const [date_inDialog, set_date_inDialog] = useState(dateRange.start);
    const [isOpenDatePickerDialog, setIsOpenDatePickerDialog] = useState(false);
    const [mountingChart, setMountingChart] = useState(()=>{
        if(symptomType && dateRange.start)
            return 'mounting:started';

        return null;
    });

    const chartCanvasRef = useRef(null);

    const handleSymptomChange = (event) => {
        setSymptomType(event.target.value);
    };

    const closeDatePickedInDatePickerDialog = () => {
        if(dateRange_startTemp) {
            set_dateRange_startTemp(null);
        }

        setIsOpenDatePickerDialog(false);
    }

    const handleDatePickedInDatePickerDialog = () => {
        if(!dateRange_startTemp) { // just after the start date is picked
            set_dateRange_startTemp(date_inDialog);
            if(dateRange_startTemp > dateRange.end) {
                set_date_inDialog(dateRange_startTemp);
            } else {
                set_date_inDialog(dateRange.end);
            }
        } else { // after the end date is picked
            setDateRange({start:dateRange_startTemp, end:date_inDialog});
            closeDatePickedInDatePickerDialog();
        }
    }
    
    const changePollutant = (newPollutant) => {
        setPollutant(newPollutant);
    }


    /** When switching to the chart page without using the 'save' method in the home page,
     *  the initial symptom type and start date don't have values, we use the following routine to fill them up
     **/
    useEffect( ()=>{
        if(!symptomType && !dateRange.start) {
            (async ()=>{
                const objectStore = db.transaction('symptoms_pollutants_relation').objectStore('symptoms_pollutants_relation');
                const index1 = objectStore.index('typeName');
                try {
                    let counts = await Promise.all(
                                            props.symptomTypes.map((symptomType)=>{
                                                let countRequest = index1.count(symptomType);
                                                return new Promise((resolve, reject)=>{
                                                    countRequest.onsuccess = ()=>{
                                                        resolve(countRequest.result);
                                                    };
                                                    countRequest.onerror = ()=>{
                                                        reject();
                                                    };
                                                });
                                            })
                    )
                    const chosenSymptomTypeIndex = counts.indexOf(Math.max(...counts));
                    let chosenSymptomType = props.symptomTypes[chosenSymptomTypeIndex];
                    const index2 = objectStore.index('typeName,datetime,severity');
                    const startDate_string = await new Promise((resolve, reject)=>{
                                                    const boundKeyRange = IDBKeyRange.bound(
                                                        [chosenSymptomType, '2000-01-01 00:00', Number.MIN_SAFE_INTEGER],
                                                        [chosenSymptomType, '9999-12-31 00:00', Number.MAX_SAFE_INTEGER]
                                                    );
                                                    const request = index2.openCursor(boundKeyRange);
                                                    request.onsuccess = (event)=>{
                                                        let cursor = event.target.result;
                                                        if(cursor) {
                                                            resolve(cursor.value.datetime) // we just need the 1st record
                                                        }
                                                    };
                                                    request.onerror = ()=> {
                                                        reject();
                                                    };
                    })
                    const startDate = parse(startDate_string, 'yyyy-MM-dd HH:mm', new Date());
                    setSymptomType(chosenSymptomType);
                    setDateRange({start: startDate, end:dateRange.end});
                } catch(error) {
                    console.log('Starting date retrieval in the database failed');
                    errorDialog.setErrorMsg(null, 'Database "starting date retrieval" operation failed');
                }
            })();
        }
    },[symptomType, dateRange])

    /** If the dependent value changes, start the mounting/re-mounting of the chart */
    useEffect(()=>{
        if(!symptomType || !dateRange.start) {
            return;
        }

        if(mountingChart !== 'mounting:started') {
            setMountingChart('mounting:started');

            /* If 'symptom highlight' is on, we turn it off immediately once another symptom or date is chosen */
            if(
                symptomType !== prevSymptomType ||
                dateRange.start !== prevDateRange.start ||
                dateRange.end !== prevDateRange.end
            ) {
                setSymptomHighlight(null);
            }
        }
    },[symptomType,dateRange,pollutant])

    /** Get data from the DB & then plot graph */
    useEffect(()=>{
        if(!symptomType || !dateRange.start) {
            return;
        }

        if(mountingChart === 'mounting:started') {
            setMountingChart('mounting:dismounted') // During 'mounting:started' state, the chart is dismounted in the 'rendering' section.
            return;
        }

        if(mountingChart === 'mounting:dismounted') {
            let objectStore = db.transaction('symptoms_pollutants_relation').objectStore('symptoms_pollutants_relation');
            let index = objectStore.index('typeName,datetime,severity');
            let keyRange = IDBKeyRange.bound(
                [symptomType, dateRange.start? format(dateRange.start, 'yyyy-MM-dd HH:mm'):'2000-01-01 00:00', Number.MIN_SAFE_INTEGER],
                [symptomType, format(dateRange.end, 'yyyy-MM-dd HH:mm'), Number.MAX_SAFE_INTEGER]
            );
            let request = index.openCursor(keyRange);

            /*
                Build a data array to place the retrieved data systematically for plotting.
                The size is 5 because we have 5 severity levels
             */
            let data = new Array(5);
            let concentrationIntervalSize = {AQHI:1, pctAR:1, O3:10, NO2:10, SO2:1, PM10:2, PM2dot5:1};
            let noOfConcentrationIntervals = 11;
            for(let i=0; i<data.length; i++) {
                data[i] = new Array(noOfConcentrationIntervals);
                for(let j=0; j<noOfConcentrationIntervals; j++) {
                    data[i][j] = 0;
                }
            }

            request.onsuccess = (event)=>{
                let cursor = event.target.result;
                if(cursor) {
                    let iIndex = cursor.value.severity-1;
                    let jIndex = Math.floor( cursor.value.pollutantsValue[pollutant] / concentrationIntervalSize[pollutant] );
                    data[iIndex][jIndex]++;
                    cursor.continue();
                } else {
                    /** After all data is retrieved from the DB */
                    let dataForHighLighting;
                    let symptomHighLight_indexes;
                    if(symptomHighlight) {
                        symptomHighLight_indexes = {
                            i: symptomHighlight.currentSeverity -1,
                            j: Math.floor( symptomHighlight.currentPollutantsValue[pollutant] / concentrationIntervalSize[pollutant] )
                        }
                    }

                    let dataForPlotting = [];
                    for(let i=0; i<data.length; i++) {
                        for(let j=0; j<noOfConcentrationIntervals; j++) {
                            let severity = i + 1;
                            let concentration;
                            if(pollutant === 'AQHI') {
                                concentration = j * concentrationIntervalSize[pollutant];
                            } else {
                                concentration = (j+0.5) * concentrationIntervalSize[pollutant];
                            }
                            let radius = data[i][j];
                            dataForPlotting.push({ x:severity, y:concentration, r:radius });

                            if(symptomHighLight_indexes && symptomHighLight_indexes.i===i && symptomHighLight_indexes.j===j) {
                                dataForHighLighting = [ {x: severity, y: concentration, r: radius+6} ]
                            }
                        }
                    }


                    const COLORS = {
                        AQHI: 'rgba(112,193,180,1)',
                        pctAR: 'rgba(255,224,102,1)',
                        O3: 'rgba(242,204,195,1)',
                        NO2: 'rgba(171,163,210,1)',
                        SO2: 'rgba(229,151,198,1)',
                        PM10: 'rgba(168,237,255,1)',
                        PM2dot5: 'rgba(168,237,255,1)'
                    }

                    let yAxisLabel;
                    let yTickConfig = {};
                    switch(pollutant) {
                        case "AQHI":
                            yAxisLabel = 'AQHI';
                            yTickConfig = {
                                min: 1,
                                callback: function (value) {
                                    if(parseInt(value) === 11) // The value of AQHI 10+ is 11
                                        return value+'+';

                                    return value;
                                }
                            }
                            break;
                        case 'pctAR':
                            yAxisLabel = '%AR';
                            break;
                        default:
                            yAxisLabel = 'concentration (μgm³)';
                    }

                    let datasets = [{
                        data: dataForPlotting,
                        backgroundColor: COLORS[pollutant]
                    }];
                    if(dataForPlotting.length!==0) {
                        datasets.push({
                            data: dataForHighLighting,
                            backgroundColor: COLORS[pollutant].replace(",1)",",0.5)")
                        })
                    }

                    new ChartJs(chartCanvasRef.current, {
                        type: "bubble",
                        data: {
                            datasets: datasets
                        },
                        options: {
                            events: ['click'],
                            legend: {
                                display: false
                            },
                            scales:{
                                xAxes:[{
                                    scaleLabel:{
                                        display: true,
                                        labelString: 'seriousness'
                                    }
                                }],
                                yAxes:[{
                                    scaleLabel:{
                                        display: true,
                                        labelString: yAxisLabel
                                    },
                                    ticks: yTickConfig
                                }],
                            }
                        }
                    });
                }
            };
            request.onerror = ()=>{
                console.log('error');
            }

            setMountingChart('mounting:mounted');
        }
    },[mountingChart]);

    /**
     * Workaround: When entering this page from the bottom of 'home' page (i.e. the 'home' page is scrolled down),
     * this page is also mysteriously scrolled down. This 'useEffect' is used to fix this issue.
     * */
    useEffect(()=> {
        if($(window).scrollTop() > 0)
            $(window).scrollTop(0);
    },[]);


    /** Rendering */
    if(!symptomType || !dateRange.start) {
        return <></>;
    }

    return (
        <div className='page'>
            <div style={{textAlign:'center', marginTop:'15px'}}>
                <TextField
                    value={
                        ( dateRange.start? format(dateRange.start,'ddMMM'):'      ' ) +
                        ' - ' +
                        format(dateRange.end, 'ddMMM')
                    }
                    InputProps={{
                        endAdornment: <InputAdornment position="end"><DateRangeIcon/></InputAdornment>,
                    }}
                    variant="outlined"
                    style={{width:'17ch'}}
                    onClick={(event)=>{setIsOpenDatePickerDialog(true)}}
                />
                &nbsp;&nbsp;&nbsp;&nbsp;
                <Select
                    value={symptomType}
                    onChange={handleSymptomChange}
                    variant='outlined'
                    style={{width:'10em'}}
                >
                    {
                        props.symptomTypes.map( (symptomType) => <MenuItem key={symptomType} value={symptomType}>{symptomType}</MenuItem>)
                    }
                </Select>
            </div>
            <Container style={{marginTop:'15px'}}>
                <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
                    <div style={{flex:'none'}}>
                        {
                            mountingChart==='mounting:started' ?
                                <div style={{width:300, height:400, maxWidth:300, maxHeight:400, marginRight:20}} /> :
                                <canvas
                                    ref={chartCanvasRef}
                                    style={{width:300, height:400, maxWidth:300, maxHeight:400, marginRight:20}}
                                />
                        }
                    </div>
                    <ButtonGroup style={{flex:'none'}}
                        orientation="vertical"
                        color="primary"
                        size='small'
                    >
                        <Button onClick={()=>{changePollutant('AQHI')}} variant={pollutant==='AQHI'? 'contained':'outlined'}>AQHI</Button>
                        <Button onClick={()=>{changePollutant('pctAR')}} variant={pollutant==='pctAR'? 'contained':'outlined'}>%AR</Button>
                        <Button onClick={()=>{changePollutant('O3')}} variant={pollutant==='O3'? 'contained':'outlined'}>O<span className='sub'>3</span></Button>
                        <Button onClick={()=>{changePollutant('NO2')}} variant={pollutant==='NO2'? 'contained':'outlined'}>NO<span className='sub'>2</span></Button>
                        <Button onClick={()=>{changePollutant('SO2')}} variant={pollutant==='SO2'? 'contained':'outlined'}>SO<span className='sub'>2</span></Button>
                        <Button onClick={()=>{changePollutant('PM10')}} variant={pollutant==='PM10'? 'contained':'outlined'}>PM<span className='sub'>10</span></Button>
                        <Button onClick={()=>{changePollutant('PM2dot5')}} variant={pollutant==='PM2dot5'? 'contained':'outlined'}>PM<span className='sub'>2.5</span></Button>
                    </ButtonGroup>
                </div>
                <p>Entry: {symptomType}</p>
                {/*<Card style={{maxWidth:250, marginLeft:'auto', marginRight:'auto'}}>*/}
                {/*    <CardContent>*/}
                {/*        <div style={{float:'left'}}>AQHI</div> <div style={{float:'right'}}>r<sup>2</sup>=0.2814</div>*/}
                {/*        <Divider style={{clear:'both'}}/>*/}
                {/*        <div style={{float:'left'}}>%AR</div> <div style={{float:'right'}}>r<sup>2</sup>=0.2814</div>*/}
                {/*        <Divider style={{clear:'both'}}/>*/}
                {/*        <div style={{float:'left'}}>O3</div> <div style={{float:'right'}}>r<sup>2</sup>=0.2814</div>*/}
                {/*        <Divider style={{clear:'both'}}/>*/}
                {/*        <div style={{float:'left'}}>NO2</div> <div style={{float:'right'}}>r<sup>2</sup>=0.2814</div>*/}
                {/*        <Divider style={{clear:'both'}}/>*/}
                {/*        <div style={{float:'left'}}>SO2</div> <div style={{float:'right'}}>r<sup>2</sup>=0.2814</div>*/}
                {/*        <Divider style={{clear:'both'}}/>*/}
                {/*        <div style={{float:'left'}}>PM10</div> <div style={{float:'right'}}>r<sup>2</sup>=0.2814</div>*/}
                {/*        <Divider style={{clear:'both'}}/>*/}
                {/*        <div style={{float:'left'}}>PM2.5</div> <div style={{float:'right'}}>r<sup>2</sup>=0.2814</div>*/}
                {/*    </CardContent>*/}
                {/*</Card>*/}
                <br/><br/>
                <Typography variant='h6'>Health Advisory</Typography>
                <Typography variant='body1' style={{textAlign:'left'}}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </Typography>
            </Container>

            {/* Dialog for date picker */}
            <Dialog
                open={isOpenDatePickerDialog}
                onEnter={()=>{set_date_inDialog(dateRange.start)}}
                onClose={closeDatePickedInDatePickerDialog}
            >
                <DialogTitle>{ dateRange_startTemp? 'To':'From' }</DialogTitle>
                <DialogContent>
                    <DatePicker
                        autoOk
                        orientation="landscape"
                        variant="static"
                        disableToolbar
                        minDate={ dateRange_startTemp? dateRange_startTemp:null }
                        disableFuture
                        openTo="date"
                        value={date_inDialog}
                        onChange={set_date_inDialog}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDatePickedInDatePickerDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDatePickedInDatePickerDialog} color="primary">
                        { dateRange_startTemp? 'Done':'Next' }
                    </Button>
                </DialogActions>
            </Dialog>

        </div>
    );
}