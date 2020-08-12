import React, {useState, useEffect, useRef, useContext} from 'react';
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Switch from "@material-ui/core/Switch";
import {useTheme} from "@material-ui/core/styles";


const switchContainer_style = { display:'flex', justifyContent:'space-between', alignItems:'center' };
const switchLabel_style = {flex:'none', marginLeft:10};


export default function MicroEnvSelect_Dialog(props) {
    const [microEnvState, setMicroEnvState] = useState({
                                                indoor: false,
                                                windowOpened: false,
                                                airPurifierOn: false,
                                                airConditionerOn: false
                                            });


    const handleButtonClicked = (env) => {
        if(env==='indoor' && !microEnvState.indoor) {
            setMicroEnvState({
                indoor: true,
                windowOpened: false,
                airPurifierOn: false,
                airConditionerOn: false
            })
        } else if(env === 'outdoor' && microEnvState.indoor) {
            setMicroEnvState({
                indoor: false,
                windowOpened: false,
                airPurifierOn: false,
                airConditionerOn: false
            })
        }
    }

    const handleSwitchChange = (event) => {
        setMicroEnvState({ ...microEnvState, [event.target.name]: event.target.checked });
    };

    const handleConfirmed = () => {
        props.setMicroEnvState(microEnvState);
        props.close();
    }

    useEffect(()=>{
        if(props.isOpen) {
            setMicroEnvState({
                indoor: props.microEnvState.indoor,
                windowOpened: props.microEnvState.windowOpened,
                airPurifierOn: props.microEnvState.airPurifierOn,
                airConditionerOn: props.microEnvState.airConditionerOn
            })
        }
    },[props.isOpen])

    /** Prepared for Rendering */
    const theme = useTheme();

    /** Rendering */
    return (
        <Dialog
            open={props.isOpen}
            onClose={props.close}
        >
            <DialogTitle style={{color:theme.palette.primary.main}} >
                Micro Environment
            </DialogTitle>
            <DialogContent>
                <Paper elevation={3} style={{ minWidth:300, paddingTop:10, paddingBottom:10 }}>
                    <div style={{...switchContainer_style, justifyContent:'center'}} >
                        <div style={{flex:'none'}}>
                            <ButtonGroup color="primary">
                                <Button
                                    variant={microEnvState.indoor? 'contained':'outlined'}
                                    onClick={()=>{handleButtonClicked('indoor')}}
                                >
                                    Indoor
                                </Button>
                                <Button
                                    variant={microEnvState.indoor? 'outlined':'contained'}
                                    onClick={()=>{handleButtonClicked('outdoor')}}
                                >
                                    Outdoor
                                </Button>
                            </ButtonGroup>
                        </div>
                    </div>
                    <div style={{ display: microEnvState.indoor? 'block':'none' }}>
                        <div style={switchContainer_style} >
                            <p style={switchLabel_style}>Open Window</p>
                            <div style={{flex:'none'}}>
                                <Switch
                                    disabled={!microEnvState.indoor}
                                    checked={microEnvState.windowOpened}
                                    onChange={handleSwitchChange}
                                    name="windowOpened"
                                    color='primary'
                                />
                            </div>
                        </div>
                        <div style={switchContainer_style} >
                            <p style={switchLabel_style}>Air Purifier</p>
                            <div style={{flex:'none'}}>
                                <Switch
                                    disabled={!microEnvState.indoor}
                                    checked={microEnvState.airPurifierOn}
                                    onChange={handleSwitchChange}
                                    name="airPurifierOn"
                                    color='primary'
                                />
                            </div>
                        </div>
                        <div style={switchContainer_style} >
                            <p style={switchLabel_style}>Air-conditioner</p>
                            <div style={{flex:'none'}}>
                                <Switch
                                    disabled={!microEnvState.indoor}
                                    checked={microEnvState.airConditionerOn}
                                    onChange={handleSwitchChange}
                                    name="airConditionerOn"
                                    color='primary'
                                />
                            </div>
                        </div>
                    </div>
                </Paper>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleConfirmed} color="primary">
                    Confirm
                </Button>
                <Button onClick={props.close} color="primary">
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    )
}