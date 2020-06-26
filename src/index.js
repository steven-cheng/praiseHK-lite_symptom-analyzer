import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router} from "react-router-dom";
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'cordova_script';
import {MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

document.addEventListener('deviceready', () => {

    ReactDOM.render(
        <div>
            <Router> {/* RouterBasename:localDev_mobile */}
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <App />
                </MuiPickersUtilsProvider>
            </Router>
        </div>,
        document.getElementById('root')
    );
}, false);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
