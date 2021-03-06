import React, {useState, useEffect, useRef} from 'react';
import {Switch, Route, useLocation, useHistory} from "react-router-dom";
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
import ChartPoint_Details from "./pages/ChartPoint_Details";
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

  const history = useHistory();

  const [isUILockerOn, setIsUILockerOn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorDialogState, setErrorDialogState] = useState({isOpen:false, title:null, contentText:null});

  const [db, setDB] = useState(null);

  const [symptomTypes, setSymptomTypes] = useState([]);
  const [saveNewSymptoms, setSaveNewSymptoms] = useState(false);
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);


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
      let default_symptom_types = ['Wheezing', 'Phlegm', 'Shortness of breath', 'Chest tightness', 'Itchy eyes', 'Redness of eyes'];
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
      objectStore2.createIndex("typeName", "typeName", { unique: false });
      objectStore2.createIndex('typeName,datetime,severity', ['typeName','datetime','severity'], {unique:false});
    };
    request.onsuccess = (event) => {
        setDB(event.target.result);
    };
    request.onerror = function(event) {
      console.log("Database initialization error");
    };
  }, []);

  /** Get the symptom types from the DB after initialized */
  useEffect(()=>{
    if(db) {
      const objectStore = db.transaction('symptom_types').objectStore('symptom_types');
      const request = objectStore.openCursor();
      let symptom_types = [];
      request.onsuccess = (event) => {
        let cursor = event.target.result;
        if(cursor) {
          symptom_types.push(cursor.value.name);
          cursor.continue();
        } else {
          setSymptomTypes(symptom_types);
        }
      };
      request.onerror = () => {
        console.log('Error: failed to get symptom types from the database');
      };

    }
  },[db]);


  /** Prepare for rendering */
  let currentPath = useLocation().pathname;
  if(currentPath === '/')
    currentPath += 'home';
  if(currentPath === '/android_asset/www/index.html') // specific for android only (when loaded for the 1st time)
    currentPath = '/home';

  let containerBackgroundColor;
  if(currentPath === '/chartPoint_details') {
    containerBackgroundColor = '#e6efff';
  } else {
    containerBackgroundColor = 'initial';
  }


  /** Rendering */
  if(!db)
    return <></>;
  if(symptomTypes.length===0)
    return <></>;
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
              <Container maxWidth='md' style={{ paddingTop:'10px', height:'100%', backgroundColor:containerBackgroundColor }}>
                <Switch>
                  <Route path='/settings' component={Settings} />
                  <Route
                      path='/chart'
                      render={
                        (props) => <Chart {...props} symptomTypes={symptomTypes}  />
                      }
                  />
                  <Route path='/chartPoint_details' component={ChartPoint_Details} />
                  <Route
                      path='/'
                      render={
                        (props) => <Home
                                      {...props}
                                      symptomTypes={symptomTypes}
                                      setSymptomTypes={setSymptomTypes}
                                      saveNewSymptoms={saveNewSymptoms}
                                      setSaveNewSymptoms={setSaveNewSymptoms}
                                      isSaveButtonDisabled={isSaveButtonDisabled}
                                      setIsSaveButtonDisabled={setIsSaveButtonDisabled}
                                  />
                      }
                  />
                </Switch>
              </Container>
              <Container maxWidth={false} style={{ position:'fixed', bottom:0, backgroundColor:'white'}}>
                <BottomNavigation
                    value={currentPath.substring(1)}
                    onChange={(event, newPage) => {
                      history.push('/' + newPage);
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
                      onClick={
                        ()=>{
                          if(!isSaveButtonDisabled)
                            setSaveNewSymptoms(true)
                        }
                      }
                      style={{
                        position:'absolute',
                        bottom:'15px',
                        left: '50%',
                        WebkitTransform: 'translateX(-50%)',
                        transform: 'translateX(-50%)',
                        width: '64px',
                        height: '64px',
                        filter: isSaveButtonDisabled? 'grayscale(75%)':'',
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
