import React, {useState, useEffect, useRef} from 'react';
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


export default function Chart() {
    const [symptom, setSymptom] = useState('Wheezing');
    const [isOpenDatePickerDialog, setIsOpenDatePickerDialog] = useState(false);
    const [date, changeDate] = useState(new Date());

    const handleSymptomChange = (event) => {
        setSymptom(event.target.value);
    };

    return (
        <>
            <div style={{textAlign:'center', marginTop:'15px'}}>
                <TextField
                    value='15Apr - 22Apr'
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
            <div style={{textAlign:'center', marginTop:'15px'}}>
                <div style={{display:'inline-block', position:'relative'}}>
                    <img src={graphSample} />
                    <div style={{position:'absolute', top:30, left:307}}>
                        <ButtonGroup
                            orientation="vertical"
                            color="primary"
                            size='small'
                        >
                            <Button>AQHI</Button>
                            <Button>NO2</Button>
                            <Button variant='contained'>SO2</Button>
                            <Button>O3</Button>
                            <Button>PM2.5</Button>
                            <Button>PM10</Button>
                        </ButtonGroup>
                    </div>
                </div>
                <p>Entry: Wheezing</p>
                <Card style={{maxWidth:300, marginLeft:'auto', marginRight:'auto'}}>
                    <CardContent>
                        AQHI &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; r<sup>2</sup>=0.2814
                        <Divider/>
                        NO2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; r<sup>2</sup>=0.2814
                        <Divider/>
                        SO2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; r<sup>2</sup>=0.2814
                        <Divider/>
                        O3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; r<sup>2</sup>=0.2814
                        <Divider/>
                        PM2.5 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; r<sup>2</sup>=0.2814
                        <Divider/>
                        PM10 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; r<sup>2</sup>=0.2814
                    </CardContent>
                </Card>
                <br/><br/>
                <Typography variant='h6'>Health Advisory</Typography>
                <Typography variant='body1' style={{textAlign:'left'}}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </Typography>
            </div>
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
                        value={date}
                        onChange={changeDate}
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
        </>
    );
}