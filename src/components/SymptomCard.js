import React, {useState, useEffect, useRef} from 'react';
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import moreIcon from "../img/more.svg";
import Grid from "@material-ui/core/Grid";
import Slider from "@material-ui/core/Slider";


export default function SymptomCard(props) {
    const [sliderValue, setSliderValue] = useState(1);


    function handle_isNoInput_changed(event) {
        props.onisNullChange(props.tempID, event.target.checked);
    }

    function handle_severity_changed(event, value) {
        props.onSeverityChange(props.tempID, value);
    }

    let type;
    if(props.id) {
        type = 'oldSymptom';
    } else {
        type = 'newSymptom';
    }

    return (
        <>
            <Card
                style={{
                    marginTop:'10px',
                    marginBottom:'10px',
                    backgroundColor: type==='oldSymptom'? 'lightgrey':'white'
                }}
                raised={true}
            >
                <CardContent>
                    <div style={{ display:'inline-block', float:'left' }}>
                        {props.name}
                        &nbsp;&nbsp; ┇ &nbsp;&nbsp;
                        {
                            type==='oldSymptom'?
                            props.datetime.slice(props.datetime.indexOf(' ')+1) :
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
                        }
                    </div>
                    <div style={{ display:'inline-block', float:'right' }}>
                        <img src={moreIcon} width={24} height={24} style={{ cursor:'pointer' }}/>
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
                                    disabled={type==='oldSymptom'}
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
        </>
    );
}