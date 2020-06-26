import React, {useState, useEffect, useRef} from 'react';
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from "@material-ui/core/Switch";


export default function Settings() {
    return (
        <>
            <Typography variant='h6' color='primary'>Settings</Typography>
            <br/>
            <div style={{textAlign:'left'}}>
                <Typography variant='h5' color='primary'>PUSH NOTIFICATION</Typography>
                <Divider/>
                <br/>
                <Typography variant='body1'>
                    <span style={{verticalAlign:"sub"}}>Receive input reminder</span>
                    <FormControlLabel control={<Switch color='primary' />} style={{float:'right'}}/>
                </Typography>
                <br/>
                <Divider/>
            </div>
            <br/>
            <br/>
            <div style={{textAlign:'left'}}>
                <Typography variant='h5' color='primary'>EXPORT</Typography>
                <Divider/>
                <br/>
                <Typography variant='body1'>
                    <span style={{verticalAlign:"sub"}}>Export correlation chart as image</span>
                </Typography>
                <br/>
                <Divider/>
                <br/>
                <Typography variant='body1'>
                    <span style={{verticalAlign:"sub"}}>Export data as csv</span>
                </Typography>
                <br/>
                <Divider/>
            </div>

        </>
    );
}