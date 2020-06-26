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
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import Chart from "./pages/Chart";
import saveButton from './img/save.svg';


export const SystemServiceContext = React.createContext({
  // for use to lock the UI for very short time only
  UILocker:{ isUILockerOn: null, UILockerSwitch: null, UILockerRequireCount:null}
});

export const DatabaseContext = React.createContext(null);


function App() {
  let UILockerRequireCount = useRef(0).current;

  const [isUILockerOn, setIsUILockerOn] = useState(false);
  const [db, setDB] = useState(true);
  const [toPage, setToPage] = React.useState('toHome');

  function UILockerSwitch(onOff) {
    if(onOff === 'on') {
      if(UILockerRequireCount === 0) {
        setIsUILockerOn(true);
      }
      UILockerRequireCount++;
    } else if(onOff === 'off') {
      UILockerRequireCount--;
      if(UILockerRequireCount === 0) {
        setIsUILockerOn(true);
      }
    }
  }

  useEffect(()=>{
    /** Initialize the database */
    // let request = window.indexedDB.open("praiseHK-lite_symptom-analyzer_DB", 1);
    // request.onupgradeneeded = function(event) {
    //   let db = event.target.result;
    //
    //   // Create an objectStore to hold information about routes
    //   let objectStore = db.createObjectStore("routes", {keyPath: 'id', autoIncrement: true});
    //
    //   /* Create indices */
    //   objectStore.createIndex("distance", 'distance', { unique: false });
    //   objectStore.createIndex("time", "time", { unique: false });
    //
    // };
    // request.onsuccess = (event) => {
    //   this.setState({
    //     db: event.target.result
    //   });
    // };
    // request.onerror = function(event) {
    //   console.log("Database initialization error");
    // };
  }, []);


  let currentPath = useLocation().pathname;
  if(currentPath === '/')
    currentPath += 'home';
  if(!db) {
    return <></>;
  } else if(toPage.substring(2).toLowerCase() !== currentPath.substring(1)) {
    return <Redirect to={ '/'+toPage.substring(2).toLowerCase() } />
  } else {
    return (
        <DatabaseContext.Provider value={db}>
          <SystemServiceContext.Provider
              value={{
                UILocker:{
                  isUILockerOn: isUILockerOn,
                  UILockerSwitch: UILockerSwitch,
                  UILockerRequireCount: UILockerRequireCount
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
                  <Route path='/' component={Home} />
                </Switch>
              </Container>
              <Container maxWidth={false} style={{ position:'fixed', bottom:0, backgroundColor:'white'}}>
                <BottomNavigation
                    value={toPage}
                    onChange={(event, newPage) => {
                      setToPage(newPage);
                    }}
                    showLabels
                    style={{ marginLeft:'auto', marginRight:'auto', maxWidth:'500px' }}
                >
                  <BottomNavigationAction value='toChart' icon={<BarChartIcon />} />
                  <BottomNavigationAction value='toHome' icon={<HomeIcon />} />
                  <BottomNavigationAction value='toSettings' icon={<SettingsIcon />} />
                </BottomNavigation>
                {
                  currentPath === '/home'
                  &&
                  <img src={saveButton} style={{
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
    );
  }

}

export default App;
