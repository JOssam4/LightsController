import React, {useState} from 'react';
import './App.css';
import Controller from './Controller';
import DevicePicker, {Device} from './DevicePicker';
import { ThemeProvider, createTheme } from '@mui/material/styles';


interface State {
  currentDevice: Device;
}

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});


function App() {
  const [state, setState] = useState<State>({
    currentDevice: Device.COMPUTER,
  });

  function setCurrentDevice(newDevice: Device) {
    setState({ ...state, currentDevice: newDevice });
  }

  return (
    <div className="App">
      <ThemeProvider theme={darkTheme}>
        <DevicePicker currentDevice={state.currentDevice}
                      setCurrentDevice={(newDevice: Device) => setCurrentDevice(newDevice)}/>
        <Controller device={state.currentDevice}/>
      </ThemeProvider>
    </div>
  );
}

export default App;
