import React, {useState, useEffect, useRef} from 'react';
import {Switch, Route, Redirect, useLocation} from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Logo from './img/logo.svg';
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import BarChartIcon from '@material-ui/icons/BarChart';
import SettingsIcon from '@material-ui/icons/Settings';
import HomeIcon from '@material-ui/icons/Home';
import './App.css';
import Home from './pages/Home'
import Settings from "./pages/Settings";
import Chart from "./pages/Chart";
import saveButton from './img/save.svg';
import CircularProgress from "@material-ui/core/CircularProgress";
import grey from "@material-ui/core/colors/grey";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from "@material-ui/core/Button";
import ErrorIcon from '@material-ui/icons/Error';


export const SystemServiceContext = React.createContext({
  // for use to lock the UI for very short time only
  UILocker:{ isUILockerOn: null, UILockerSwitch: null, UILockerRequireCount:null},
  // for use to lock the UI for much longer period
  loader: { isLoading: null, loaderSwitch: null, loaderRequireCount:null },
  // for showing error message
  errorDialog: {setErrorMsg:null}
});

export const DatabaseContext = React.createContext(null);


export default function App() {
  let UILockerRequireCount = useRef(0).current;
  let loaderRequireCount = useRef(0).current;

  const [isUILockerOn, setIsUILockerOn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorDialogState, setErrorDialogState] = useState({isOpen:false, title:null, contentText:null});

  const [db, setDB] = useState(null);
  const [toPage, setToPage] = React.useState('');

  const [saveNewSymptoms, setSaveNewSymptoms] = useState(false);

  function UILockerSwitch(onOff) {
    if(onOff === 'on') {
      if(UILockerRequireCount === 0) {
        setIsUILockerOn(true);
      }
      UILockerRequireCount++;
    } else if(onOff === 'off') {
      UILockerRequireCount--;
      if(UILockerRequireCount === 0) {
        setIsUILockerOn(false);
      }
    }
  }

  function loaderSwitch(onOff) {
    if(onOff === 'on') {
      if(loaderRequireCount === 0) {
        setIsLoading(true);
      }
      loaderRequireCount++;
    } else if(onOff === 'off') {
      loaderRequireCount--;
      if(loaderRequireCount === 0) {
        setIsLoading(false);
      }
    }
  }

  function setErrorMsg(errorTitle, errorContentText) {
    setErrorDialogState({isOpen: true, title: errorTitle, contentText: errorContentText});
  }



  /** Initialize the database */
  useEffect(()=>{
    let request = window.indexedDB.open("praiseHK-lite_symptom-analyzer_DB", 1);
    request.onupgradeneeded = function(event) {
      let db = event.target.result;

      // Create an objectStore to hold information about symptom types
      let objectStore1 = db.createObjectStore("symptom_types", {keyPath: 'id', autoIncrement: true});
      /* Create indices for "symptoms_types" object store */
      objectStore1.createIndex("symptom_type_name", 'name', { unique: true });
      // Add default symptom type name to the object store
      let default_symptom_types = ['Redness of eyes', 'Itchy eyes', 'Chest tightness', 'Shortness of breath', 'Phlegm','Wheezing'];
      objectStore1.transaction.oncomplete = (event) => {
        let objectStore = db.transaction('symptom_types', 'readwrite').objectStore('symptom_types');
        default_symptom_types.forEach( (symptomType) => {
          objectStore.add({name: symptomType});
        });
      }

      // Create an objectStore to hold information about the relationship between symptoms and different pollutants
      let objectStore2 = db.createObjectStore("symptoms_pollutants_relation", {keyPath: 'id', autoIncrement: true});
      /* Create indices for "symptoms_pollutants_relation" object store */
      objectStore2.createIndex("datetime", 'datetime', { unique: false });
      objectStore2.createIndex("symptom_type_id", "symptom_type_id", { unique: false });

    };
    request.onsuccess = (event) => {
        setDB(event.target.result);
    };
    request.onerror = function(event) {
      console.log("Database initialization error");
    };
  }, []);


  let currentPath = useLocation().pathname;
  if(currentPath === '/')
    currentPath += 'home';
  if(currentPath === '/android_asset/www/index.html') // specific for android only (when loaded for the 1st time)
    currentPath = '/home';
  if(!db) {
    return <></>;
  } else if(toPage!=='' && toPage!==currentPath.substring(1)) {
    return <Redirect to={'/'+toPage} />
  } else {
    return (
        <>
          <Loader isLoading={isLoading} />
          <UILocker isLocked={isUILockerOn} />
          <ErrorDialog
              state={errorDialogState}
              setState={setErrorDialogState}
          />

          <DatabaseContext.Provider value={db}>
            <SystemServiceContext.Provider
                value={{
                  UILocker:{
                    isUILockerOn: isUILockerOn,
                    UILockerSwitch: UILockerSwitch,
                    UILockerRequireCount: UILockerRequireCount
                  },
                  loader: {
                    isLoading: isLoading,
                    loaderSwitch: loaderSwitch,
                    loaderRequireCount: loaderRequireCount
                  },
                  errorDialog: {
                    setErrorMsg: setErrorMsg
                  }
                }}
            >
              <div className="App">
                <AppBar color='inherit' position='sticky' style={{paddingTop:'10px', paddingBottom:'10px'}}>
                  <div>
                    <img src={Logo} width={89} height={52} />
                  </div>
                </AppBar>
                <Container maxWidth='md' style={{ marginTop:'10px' }}>
                  <Switch>
                    <Route path='/settings' component={Settings} />
                    <Route path='/chart' component={Chart} />
                    <Route
                        path='/'
                        render={
                          (props) => <Home {...props} saveNewSymptoms={saveNewSymptoms} setSaveNewSymptoms={setSaveNewSymptoms} />
                        }
                    />
                  </Switch>
                </Container>
                <Container maxWidth={false} style={{ position:'fixed', bottom:0, backgroundColor:'white'}}>
                  <BottomNavigation
                      value={currentPath.substring(1)}
                      onChange={(event, newPage) => {
                        setToPage(newPage);
                      }}
                      showLabels
                      style={{ marginLeft:'auto', marginRight:'auto', maxWidth:'500px' }}
                  >
                    <BottomNavigationAction value='chart' icon={<BarChartIcon />} />
                    <BottomNavigationAction value='home' icon={<HomeIcon />} />
                    <BottomNavigationAction value='settings' icon={<SettingsIcon />} />
                  </BottomNavigation>
                  {
                    currentPath === '/home'
                    &&
                    <img
                        src={saveButton}
                        onClick={ ()=>{setSaveNewSymptoms(true)} }
                        style={{
                          position:'absolute',
                          bottom:'15px',
                          left: '50%',
                          WebkitTransform: 'translateX(-50%)',
                          transform: 'translateX(-50%)',
                          width: '64px',
                          height: '64px',
                          cursor: 'pointer'
                        }}
                    />
                  }
                </Container>
              </div>
            </SystemServiceContext.Provider>
          </DatabaseContext.Provider>
        </>
    );
  }

}


function Loader(props) {
  return(
      <div className={`loader-modal-screen ${props.isLoading?'loading':'not-loading'}`}>
        <CircularProgress style={{color:'grey'}} thickness={6} />
      </div>
  );
}

function UILocker(props) {
  return(
      <div className={`UILocker-modal-screen ${props.isLocked?'UI-locked':'UI-not-locked'}`} />
  );
}

function ErrorDialog(props) {
  const {isOpen, title, contentText} = props.state
  function closeDialog() {
    props.setState( {isOpen:false, title:null, contentText:null} );
  }

  return(
      <Dialog
          open={isOpen}
          onClose={closeDialog}
      >
        <DialogTitle><ErrorIcon color='secondary' /> {title? title:'Error'}</DialogTitle>
        <DialogContent>
          <DialogContentText>{contentText}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
  )
}
