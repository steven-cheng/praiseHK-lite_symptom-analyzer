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
    const [pollutant, setPollutant] = useState('NO2');
    const [date_dialog, set_date_dialog] = useState(new Date());
    const [isOpenDatePickerDialog, setIsOpenDatePickerDialog] = useState(false);

    const db = useContext(DatabaseContext);

    const chartCanvasRef = useRef(null);

    const handleSymptomChange = (event) => {
        setSymptom(event.target.value);
    };

    /** Get data from the DB & then plot graph */
    useEffect(()=>{
        let objectStore = db.transaction('symptoms_pollutants_relation').objectStore('symptoms_pollutants_relation');
        let index = objectStore.index('typeName,datetime,severity');
        let keyRange = IDBKeyRange.bound([symptom,'2020-01-01 00:00', Number.MIN_SAFE_INTEGER], [symptom,'9999-12-31 00:00', Number.MAX_SAFE_INTEGER]);
        let request = index.openCursor(keyRange);

        /*
            Build a data array to place the retrieved data systematically for plotting.
            The size is 5 because we have 5 severity levels
         */
        let data = new Array(5);
        let concentrationIntervalSize = {NO2:10};
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
                console.log('cursor.value : ', cursor.value);
                let iIndex = cursor.value.severity-1;
                let jIndex = Math.floor( cursor.value.pollutantsValue[pollutant] / concentrationIntervalSize[pollutant] );
                data[iIndex][jIndex]++;
                cursor.continue();
            } else {
                console.log('completed')
                console.log('data :',data);
                let dataForPlotting = [];
                for(let i=0; i<data.length; i++) {
                    for(let j=0; j<noOfConcentrationIntervals; j++) {
                        let severity = i + 1;
                        let concentration = (j+0.5) * concentrationIntervalSize[pollutant];
                        let radius = data[i][j];
                        dataForPlotting.push({ x:severity, y:concentration, r:radius });
                    }
                }

                new ChartJs(chartCanvasRef.current,{
                    type: "bubble",
                    data: {
                            datasets: [{
                                label: "Correlation",
                                data: dataForPlotting,
                                backgroundColor: "#0091CE"
                            }]
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
                        (dateRange.start?dateRange.start:'      ') +
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
                    {/*<img style={{flex:'none'}} src={graphSample} />*/}
                    <canvas ref={chartCanvasRef} width={300} height={300} style={{flex:'none', maxWidth:'300px', maxHeight:'300px'}} />
                    <ButtonGroup style={{flex:'none'}}
                        orientation="vertical"
                        color="primary"
                        size='small'
                    >
                        <Button>AQHI</Button>
                        <Button>%AR</Button>
                        <Button>O3</Button>
                        <Button variant='contained'>NO2</Button>
                        <Button>SO2</Button>
                        <Button>PM10</Button>
                        <Button>PM2.5</Button>
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
            <Dialog open={isOpenDatePickerDialog} onClose={()=>{setIsOpenDatePickerDialog(false)}}>
                <DialogTitle>From</DialogTitle>
                <DialogContent>
                    <DatePicker
                        autoOk
                        orientation="landscape"
                        variant="static"
                        disableToolbar
                        disableFuture
                        openTo="date"
                        value={date_dialog}
                        onChange={set_date_dialog}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={()=>{setIsOpenDatePickerDialog(false)}} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={()=>{setIsOpenDatePickerDialog(false)}} color="primary">
                        Next
                    </Button>
                </DialogActions>
            </Dialog>

        </div>
    );
}