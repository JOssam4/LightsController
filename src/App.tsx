import React, { useState, useEffect } from 'react';
import { ColorPicker, useColor, toColor, Color} from 'react-color-palette';
import "react-color-palette/lib/css/styles.css";
import './App.css';
import DevicePicker, { Device } from './DevicePicker';
import Picker from './Picker';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSpinner} from '@fortawesome/free-solid-svg-icons';

interface ColorResponse {
  h: number;
  s: number;
  v: number;
}

interface State {
  currentDevice: Device;
  livingroomColor: Color | null;
  bedroomColor: Color | null;
}

function App() {
  const [state, setState] = useState<State>({
    currentDevice: Device.COMPUTER,
    livingroomColor: null,
    bedroomColor: null,
  });

  useEffect(() => {
    console.log('ran useeffect');
    fetch(`http://localhost:3001/color?device=${state.currentDevice}`)
      .then((resp) => resp.json())
      .then((currentColor: ColorResponse) => {
        const {h, s, v} = currentColor;
        if (state.currentDevice === Device.BEDROOM) {
          console.log('setting state: ');
          console.dir({h, s, v});
          setState({...state, bedroomColor: toColor('hsv', {h, s, v})});
        } else {
          setState( { ...state, livingroomColor: toColor('hsv', {h, s, v})});
        }
      });
  }, [state.currentDevice]);

  function setCurrentDevice(newDevice: Device) {
    setState({ ...state, currentDevice: newDevice });
  }


  if (state.livingroomColor || state.bedroomColor) {
    if (state.currentDevice === Device.BEDROOM && state.bedroomColor) {
      return (
        <div className="App">
          <div>
            <DevicePicker setCurrentDevice={(currentDevice: Device) => setCurrentDevice(currentDevice)} currentDevice={state.currentDevice} />
          </div>
          <Picker currentDevice={state.currentDevice} initialColor={state.bedroomColor} />
        </div>
      )
    } else if (state.currentDevice === Device.COMPUTER && state.livingroomColor) {
      return (
        <div className="App">
          <div>
            <DevicePicker setCurrentDevice={(currentDevice: Device) => setCurrentDevice(currentDevice)} currentDevice={state.currentDevice} />
          </div>
          <Picker currentDevice={state.currentDevice} initialColor={state.livingroomColor} />
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
}

export default App;
