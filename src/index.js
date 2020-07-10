import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router} from "react-router-dom";
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'cordova_script';
import {MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import {StylesProvider} from '@material-ui/core/styles';
import {createMuiTheme} from "@material-ui/core/styles";
import {ThemeProvider} from '@material-ui/core/styles';


document.addEventListener('deviceready', () => {

    // Customize default theme
    const theme = createMuiTheme({
        palette: {
            primary: {main:'#0091CE'}
        }
    });

    ReactDOM.render(
        <div>
            <StylesProvider injectFirst>
                {/* RouterBasename:browser-dev <Router basename="/~praise/praiseHK-lite_symptom-analyzer/dev"> */}
                {/* RouterBasename:browser-prod <Router basename="/~praise/praiseHK-lite_symptom-analyzer/prod"> */}
                <Router> {/* RouterBasename:localDev_mobile */}
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <ThemeProvider theme={theme}>
                            <App />
                        </ThemeProvider>
                    </MuiPickersUtilsProvider>
                </Router>
            </StylesProvider>
        </div>,
        document.getElementById('root')
    );
}, false);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
