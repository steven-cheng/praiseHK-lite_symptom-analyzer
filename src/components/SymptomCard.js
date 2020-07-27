import React, {useState, useEffect, useRef} from 'react';
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import moreIcon from "../img/more.svg";
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Grid from "@material-ui/core/Grid";
import Slider from "@material-ui/core/Slider";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from '@material-ui/core/Button';


export default function SymptomCard(props) {
    const [sliderValue, setSliderValue] = useState(1);
    const [isOpenDeleteSymptomType_dialog, set_isOpenDeleteSymptomType_dialog] = useState(false);


    function handle_isNoInput_changed(event) {
        props.onisNullChange(props.tempID, event.target.checked);
    }

    function handle_severity_changed(event, value) {
        props.onSeverityChange(props.tempID, value);
    }

    function closeDeleteSymptomType_dialog() {
        set_isOpenDeleteSymptomType_dialog(false);
    }

    function confirmDeleteSymptomType() {
        props.deleteSymptomType(props.name);
        closeDeleteSymptomType_dialog();
    }


    /** Rendering */
    return (
        <>
            <Card
                style={{
                    marginTop:'10px',
                    marginBottom:'10px',
                }}
                raised={true}
            >
                <CardContent>
                    <div style={{ display:'inline-block', float:'left' }}>
                        {props.name}
                        &nbsp;&nbsp; ┇ &nbsp;&nbsp;
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={props.isNull}
                                    onChange={handle_isNoInput_changed}
                                    name="checkedB"
                                    color="primary"
                                />
                            }
                            label="No input"
                        />
                    </div>
                    <div style={{ display:'inline-block', float:'right' }}>
                        {/*<img src={moreIcon} width={24} height={24} style={{ cursor:'pointer' }}/>*/}
                        <DeleteForeverIcon
                            onClick={ ()=>{set_isOpenDeleteSymptomType_dialog(true)} }
                            style={{ fontSize:30, cursor:'pointer' }}
                        />
                    </div>
                    <div style={{ display: props.isNull?'none':'block' }}>
                        <Grid container spacing={2} alignItems='center' style={{ marginTop:'5px', clear:'both' }}>
                            <Grid item xs>
                                <Slider
                                    value={props.severity}
                                    onChange={handle_severity_changed}
                                    step={1}
                                    min={1}
                                    max={5}
                                />
                            </Grid>
                            <Grid item style={{minWidth:'2ch'}}>
                                {props.severity}
                            </Grid>
                        </Grid>
                    </div>
                </CardContent>
            </Card>
            <br/>

            {/* Delete 'symptom type' dialog */}
            <Dialog
                open={isOpenDeleteSymptomType_dialog}
                onClose={closeDeleteSymptomType_dialog}
            >
                <DialogContent>
                    <DialogContentText>
                        Are you sure? All the records of this symptom will be deleted and non-recoverable!
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={confirmDeleteSymptomType} color="primary">
                        Sure
                    </Button>
                    <Button onClick={closeDeleteSymptomType_dialog} color="primary" autoFocus>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>

        </>
    );
}