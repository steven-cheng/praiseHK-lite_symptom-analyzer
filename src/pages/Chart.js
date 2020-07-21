import React, {useState, useEffect, useRef, useContext} from 'react';
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
import graphSample from '../img/graphSample.png';
import Divider from "@material-ui/core/Divider";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Container from "@material-ui/core/Container";
import format from 'date-fns/format';
import {DatabaseContext} from "../App";
import ChartJs from 'chart.js';
import $ from 'jquery';
import './Chart.css';


export default function Chart(props) {
    const [symptom, setSymptom] = useState(()=>{
        if(props.location.state && props.location.state.symptom)
            return props.location.state.symptom;
        return 'Wheezing';
    });
    const [dateRange, setDateRange] = useState(()=>{
        if(props.location.state && props.location.state.dateRange)
            return { start: props.location.state.dateRange.start, end: props.location.state.dateRange.end };

        return { start: null, end: new Date() };
    });
    // The following property is used by the date picker dialog to temporarily hold a start date value
    const [dateRange_startTemp, set_dateRange_startTemp] = useState(null);
    const [pollutant, setPollutant] = useState('AQHI');
    const [date_inDialog, set_date_inDialog] = useState(dateRange.start);
    const [isOpenDatePickerDialog, setIsOpenDatePickerDialog] = useState(false);

    const db = useContext(DatabaseContext);

    const chartCanvasRef = useRef(null);

    const handleSymptomChange = (event) => {
        setSymptom(event.target.value);
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
    };

    /**
     * Workaround: When entering this page from the bottom of 'home' page (i.e. the 'home' page is scrolled down),
     * this page is also mysteriously scrolled down. This 'useEffect' is used to fix this issue.
     * */
    useEffect(()=> {
        if($(window).scrollTop() > 0)
            $(window).scrollTop(0);
    },[])

    /** Get data from the DB & then plot graph */
    useEffect(()=>{
        let objectStore = db.transaction('symptoms_pollutants_relation').objectStore('symptoms_pollutants_relation');
        let index = objectStore.index('typeName,datetime,severity');
        let keyRange = IDBKeyRange.bound(
            [symptom, dateRange.start? format(dateRange.start, 'yyyy-MM-dd HH:mm'):'2000-01-01 00:00', Number.MIN_SAFE_INTEGER],
            [symptom, format(dateRange.end, 'yyyy-MM-dd HH:mm'), Number.MAX_SAFE_INTEGER]
        );
        let request = index.openCursor(keyRange);

        /*
            Build a data array to place the retrieved data systematically for plotting.
            The size is 5 because we have 5 severity levels
         */
        let data = new Array(5);
        let concentrationIntervalSize = {AQHI:1, pctAR:1, O3:10, NO2:10, SO2:1, PM10:2, PM2dot5:1};
        let noOfConcentrationIntervals = 8;
        for(let i=0; i<data.length; i++) {
            data[i] = new Array(noOfConcentrationIntervals);
            for(let j=0; j<noOfConcentrationIntervals; j++) {
                data[i][j] = 0;
            }
        }

        request.onsuccess = (event)=>{
            let cursor = event.target.result;
            if(cursor) {
                // todo delete the console.log later
                //console.log('cursor.value : ', cursor.value);
                let iIndex = cursor.value.severity-1;
                let jIndex = Math.floor( cursor.value.pollutantsValue[pollutant] / concentrationIntervalSize[pollutant] );
                data[iIndex][jIndex]++;
                cursor.continue();
            } else {
                // todo delete the console.log later
                //console.log('completed')
                //console.log('data :',data);
                let dataForPlotting = [];
                for(let i=0; i<data.length; i++) {
                    for(let j=0; j<noOfConcentrationIntervals; j++) {
                        let severity = i + 1;
                        let concentration = (j+0.5) * concentrationIntervalSize[pollutant];
                        let radius = data[i][j];
                        dataForPlotting.push({ x:severity, y:concentration, r:radius });
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

                new ChartJs(chartCanvasRef.current,{
                    type: "bubble",
                    data: {
                            datasets: [{
                                label: "Correlation",
                                data: dataForPlotting,
                                backgroundColor: COLORS[pollutant]
                            }]
                    },
                    options: {
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
                                    labelString: 'concentration (μgm³)'
                                }
                            }],
                        }
                    }
                });
            }
        };
        request.onerror = ()=>{
            console.log('error');
        }
    },[symptom,dateRange,pollutant]);

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
                    value={symptom}
                    onChange={handleSymptomChange}
                    variant='outlined'
                    style={{width:'10em'}}
                >
                    <MenuItem value={'Wheezing'}>Wheezing</MenuItem>
                    <MenuItem value={'Phlegm'}>Phlegm</MenuItem>
                    <MenuItem value={'Shortness of breath'}>Shortness of breath</MenuItem>
                    <MenuItem value={'Chest tightness'}>Chest tightness</MenuItem>
                    <MenuItem value={'Itchy eyes'}>Itchy eyes</MenuItem>
                    <MenuItem value={'Redness of eyes'}>Redness of eyes</MenuItem>
                </Select>
            </div>
            <Container style={{marginTop:'15px'}}>
                <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
                    <canvas ref={chartCanvasRef} width={300} height={300} style={{flex:'none', maxWidth:'300px', maxHeight:'300px'}} />
                    <ButtonGroup style={{flex:'none'}}
                        orientation="vertical"
                        color="primary"
                        size='small'
                    >
                        <Button onClick={()=>{setPollutant('AQHI')}} variant={pollutant==='AQHI'? 'contained':'outlined'}>AQHI</Button>
                        <Button onClick={()=>{setPollutant('pctAR')}} variant={pollutant==='pctAR'? 'contained':'outlined'}>%AR</Button>
                        <Button onClick={()=>{setPollutant('O3')}} variant={pollutant==='O3'? 'contained':'outlined'}>O<span className='sub'>3</span></Button>
                        <Button onClick={()=>{setPollutant('NO2')}} variant={pollutant==='NO2'? 'contained':'outlined'}>NO<span className='sub'>2</span></Button>
                        <Button onClick={()=>{setPollutant('SO2')}} variant={pollutant==='SO2'? 'contained':'outlined'}>SO<span className='sub'>2</span></Button>
                        <Button onClick={()=>{setPollutant('PM10')}} variant={pollutant==='PM10'? 'contained':'outlined'}>PM<span className='sub'>10</span></Button>
                        <Button onClick={()=>{setPollutant('PM2dot5')}} variant={pollutant==='PM2dot5'? 'contained':'outlined'}>PM<span className='sub'>2.5</span></Button>
                    </ButtonGroup>
                </div>
                <p>Entry: {symptom}</p>
                <Card style={{maxWidth:250, marginLeft:'auto', marginRight:'auto'}}>
                    <CardContent>
                        <div style={{float:'left'}}>AQHI</div> <div style={{float:'right'}}>r<sup>2</sup>=0.2814</div>
                        <Divider style={{clear:'both'}}/>
                        <div style={{float:'left'}}>%AR</div> <div style={{float:'right'}}>r<sup>2</sup>=0.2814</div>
                        <Divider style={{clear:'both'}}/>
                        <div style={{float:'left'}}>O3</div> <div style={{float:'right'}}>r<sup>2</sup>=0.2814</div>
                        <Divider style={{clear:'both'}}/>
                        <div style={{float:'left'}}>NO2</div> <div style={{float:'right'}}>r<sup>2</sup>=0.2814</div>
                        <Divider style={{clear:'both'}}/>
                        <div style={{float:'left'}}>SO2</div> <div style={{float:'right'}}>r<sup>2</sup>=0.2814</div>
                        <Divider style={{clear:'both'}}/>
                        <div style={{float:'left'}}>PM10</div> <div style={{float:'right'}}>r<sup>2</sup>=0.2814</div>
                        <Divider style={{clear:'both'}}/>
                        <div style={{float:'left'}}>PM2.5</div> <div style={{float:'right'}}>r<sup>2</sup>=0.2814</div>
                    </CardContent>
                </Card>
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