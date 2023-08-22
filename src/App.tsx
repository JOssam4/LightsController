import React, {useState} from 'react';
import './App.css';
import Controller from './Controller';
import DevicePicker from './DevicePicker';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {DevicesResponse} from './Types';

interface State {
  // currentDevice: Device;
  devices: DevicesResponse | undefined;
  controlledDevices: Set<string>;
}

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  const [state, setState] = useState<State>({
    devices: undefined,
    controlledDevices: new Set<string>(),
  });

  function setControlledDevices(controlledDevices: Set<string>): void {
    setState({ ...state, controlledDevices });
  }

  return (
    <div className="App">
      <ThemeProvider theme={darkTheme}>
        <DevicePicker setControlledDevices={setControlledDevices} />
        <Controller controlledDevices={state.controlledDevices}/>
      </ThemeProvider>
    </div>
  );
}

export default App;
