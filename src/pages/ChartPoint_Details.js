import React, {useState, useEffect, useRef, useContext} from 'react';
import Typography from "@material-ui/core/Typography";
import {useTheme} from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from '@material-ui/core/CardContent';
import './ChartPoint_Details.css';
import FilterHdrIcon from '@material-ui/icons/FilterHdr';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import AcUnitIcon from '@material-ui/icons/AcUnit';

export default function ChartPoint_details(props) {
    const theme = useTheme();
    const spanColor = {color:theme.palette.primary.main};

    return(
        <div className='page' >
            <div>
                <Typography
                    variant='h5'
                    gutterBottom
                    style={{
                        textAlign:'left',
                        color:theme.palette.primary.main,
                        fontWeight: 'bold'
                    }}
                >
                    DETAILS
                </Typography>
                <Card className='card' raised={true} elevation={10} >
                    <CardContent>
                        <div className='card-content-div'>
                            <div className='icon-row'>
                                <FilterHdrIcon />
                            </div>
                            <Typography className='typography-p' variant="body2" component="p" >
                                <span style={spanColor}>Date & Time :</span> 4 Jun 2020 18:00
                            </Typography>
                            <Typography className='typography-p' variant="body2" component="p" >
                                <span style={spanColor}>Location :</span> Nathan Road
                            </Typography>
                            <Typography className='typography-p' variant="body2" component="p" >
                                <span style={spanColor}>Conc. of PM<sub>10</sub> :</span> 65 ug/m
                            </Typography>
                            <Typography className='typography-p' variant="body2" component="p" >
                                <span style={spanColor}>Seriousness :</span> 4
                            </Typography>
                        </div>
                    </CardContent>
                </Card>
                <br/>
                <Card className='card' raised={true} elevation={10} >
                    <CardContent>
                        <div className='card-content-div'>
                            <div className='icon-row'>
                                <AccountBalanceIcon/> <AcUnitIcon />
                            </div>
                            <Typography className='typography-p' variant="body2" component="p" >
                                <span style={spanColor}>Date & Time :</span> 16 Jun 2020 12:30
                            </Typography>
                            <Typography className='typography-p' variant="body2" component="p" >
                                <span style={spanColor}>Location :</span> Metro City
                            </Typography>
                            <Typography className='typography-p' variant="body2" component="p" >
                                <span style={spanColor}>Conc. of PM<sub>10</sub> :</span> 66.1 ug/m
                            </Typography>
                            <Typography className='typography-p' variant="body2" component="p" >
                                <span style={spanColor}>Seriousness :</span> 3
                            </Typography>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}