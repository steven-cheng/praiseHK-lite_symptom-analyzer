import React, {useState, useEffect, useRef} from 'react';
import Typography from "@material-ui/core/Typography";
import TodayIcon from '@material-ui/icons/Today';
import format from 'date-fns/format';
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Slider from '@material-ui/core/Slider';
import moreIcon from '../img/more.svg';
import plusIcon from '../img/plus.svg';
import Button from '@material-ui/core/Button';
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import Input from "@material-ui/core/Input";
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';


export default function Home() {
    const [isOpenAddNewSymptom_dialog, set_isOpenAddNewSymptom_dialog] = useState(false);

    function open_addNewSymptom_dialog() {
        set_isOpenAddNewSymptom_dialog(true);
    }

    function close_addNewSymptom_dialog() {
        set_isOpenAddNewSymptom_dialog(false);
    }

    return (
        <>
            <p style={{ marginTop:'20px' }}>
                <TodayIcon color="primary" style={{verticalAlign:'text-bottom'}} /> &nbsp; {format(new Date(), 'dd MMMM yyyy')}
            </p>
            <div>
                <Card style={{ marginTop:'10px', marginBottom:'10px' }} raised={true}>
                    <CardContent>
                        <div style={{ display:'inline-block', float:'left' }}>Wheezing</div>
                        <div style={{ display:'inline-block', float:'right' }}>
                            <img src={moreIcon} width={24} height={24} style={{ cursor:'pointer' }}/>
                        </div>
                        <Slider
                            defaultValue={1}
                            valueLabelDisplay="auto"
                            step={0.1}
                            min={1}
                            max={10}
                            style={{ marginTop:'5px', clear:'both' }}
                        />
                    </CardContent>
                </Card>
                <Card style={{ marginTop:'10px', marginBottom:'10px' }} raised={true}>
                    <CardContent>
                        <div style={{ display:'inline-block', float:'left' }}>Phlegm</div>
                        <div style={{ display:'inline-block', float:'right' }}>
                            <img src={moreIcon} width={24} height={24} style={{ cursor:'pointer' }}/>
                        </div>
                        <Slider
                            defaultValue={1}
                            valueLabelDisplay="auto"
                            step={0.2}
                            min={1}
                            max={20}
                            style={{ marginTop:'5px', clear:'both' }}
                        />
                    </CardContent>
                </Card>
                <div onClick={open_addNewSymptom_dialog} style={{marginTop:'40px', cursor:'pointer'}}>
                    <img src={plusIcon} width={24} height={24} style={{verticalAlign:'text-bottom'}} /> &nbsp;&nbsp;
                    <Typography variant='h6' style={{display:'inline-block'}}>Add New Symptom</Typography>
                </div>
            </div>
            <Dialog open={isOpenAddNewSymptom_dialog} onClose={close_addNewSymptom_dialog} >
                <DialogTitle style={{textAlign:'center'}}>Add Symptom</DialogTitle>
                <DialogContent>
                    <Autocomplete
                        freeSolo
                        options={symptoms.map((option) => option.name)}
                        renderInput={(params) => (
                            <TextField {...params} label="Symptom Name" margin="normal" variant="outlined" />
                        )}
                    />
                    <br/><br/>
                    Range: <Input type='number' style={{width:'4em'}}/> to <Input type='number' style={{width:'4em'}}/>
                    <br/><br/>
                    No. of Intervals: <Input type='number' style={{width:'4em'}}/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={close_addNewSymptom_dialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={close_addNewSymptom_dialog} color="primary">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

const symptoms = [
    {name: 'Wheezing'},
    {name: 'Phlegm'},
    {name: 'Shortness of breath'},
    {name: 'Chest tightness'},
    {name: 'Itchy eyes'},
    {name: 'Redness of eyes'}
];