import React, {useState} from 'react';
import "react-color-palette/lib/css/styles.css";
import './App.css';
import Controller from './Controller';
import DevicePicker, {Device} from './DevicePicker';
import { ThemeProvider, createTheme } from '@mui/material/styles';

interface InitialResponse {
  color: ColorResponse;
  brightness: number;
  toggleStatus: boolean;
}

interface ColorResponse {
  h: number;
  s: number;
  v: number;
}

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

/*
  if (state.livingroomColor || state.bedroomColor) {
    if (state.currentDevice === Device.BEDROOM && state.bedroomColor && state.bedroomBrightness && state.bedroomOn !== null) {
      return (
        <div className="App">
          <div>
            <DevicePicker setCurrentDevice={(currentDevice: Device) => setCurrentDevice(currentDevice)} currentDevice={state.currentDevice} />
          </div>
          <Toggle currentDevice={state.currentDevice} status={state.bedroomOn} />
          <Picker currentDevice={state.currentDevice} initialColor={state.bedroomColor} />
          <Brightness initialBrightness={state.bedroomBrightness} currentDevice={state.currentDevice} />
        </div>
      )
    } else if (state.currentDevice === Device.COMPUTER && state.livingroomColor && state.livingroomBrightness && state.livingroomOn !== null) {
      return (
        <div className="App">
          <div>
            <DevicePicker setCurrentDevice={(currentDevice: Device) => setCurrentDevice(currentDevice)} currentDevice={state.currentDevice} />
          </div>
          <Toggle currentDevice={state.currentDevice} status={state.livingroomOn} />
          <Picker currentDevice={state.currentDevice} initialColor={state.livingroomColor} />
          <Brightness initialBrightness={state.livingroomBrightness} currentDevice={state.currentDevice} />
        </div>
      )
    }
    return (
      <div className="App">
        <FontAwesomeIcon icon={faSpinner} />
      </div>
    );
  }

  return (
    <div className="App">
      <FontAwesomeIcon icon={faSpinner} />
    </div>
  );
 */
}

export default App;
