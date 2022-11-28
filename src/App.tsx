import React, {useEffect, useState} from 'react';
import {Color, toColor} from 'react-color-palette';
import "react-color-palette/lib/css/styles.css";
import './App.css';
import DevicePicker, {Device} from './DevicePicker';
import Picker from './Picker';
import Brightness from './Brightness';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSpinner} from '@fortawesome/free-solid-svg-icons';

interface InitialResponse {
  color: ColorResponse;
  brightness: number;
}

interface ColorResponse {
  h: number;
  s: number;
  v: number;
}

interface State {
  currentDevice: Device;
  livingroomColor: Color | null;
  livingroomBrightness: number | null;
  bedroomColor: Color | null;
  bedroomBrightness: number | null;
}


function App() {
  const [state, setState] = useState<State>({
    currentDevice: Device.COMPUTER,
    livingroomColor: null,
    livingroomBrightness: null,
    bedroomColor: null,
    bedroomBrightness: null,
  });

  useEffect(() => {
    console.log('ran useeffect');
    fetch(`http://localhost:3001/initial?device=${state.currentDevice}`)
      .then((resp) => resp.json())
      .then((initialResponse: InitialResponse) => {
        const { color, brightness } = initialResponse;
        if (state.currentDevice === Device.BEDROOM) {
          setState({ ...state, bedroomBrightness: brightness, bedroomColor: toColor('hsv', color) });
        } else {
          setState({ ...state, livingroomBrightness: brightness, livingroomColor: toColor('hsv', color) });
        }
      })
    }, []);

  useEffect(() => {
    /*
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
    fetch(`http://localhost:3001/brightness?device=${state.currentDevice}`)
      .then((resp) => resp.json())
      .then((currentBrightness: number) => {
        if (state.currentDevice === Device.BEDROOM) {
          setState({ ... state, bedroomBrightness: currentBrightness});
        } else {
          setState({ ...state, livingroomBrightness: currentBrightness});
        }
      })
     */
  }, [state.currentDevice]);

  function setCurrentDevice(newDevice: Device) {
    setState({ ...state, currentDevice: newDevice });
  }


  if (state.livingroomColor || state.bedroomColor) {
    if (state.currentDevice === Device.BEDROOM && state.bedroomColor && state.bedroomBrightness) {
      return (
        <div className="App">
          <div>
            <DevicePicker setCurrentDevice={(currentDevice: Device) => setCurrentDevice(currentDevice)} currentDevice={state.currentDevice} />
          </div>
          <Picker currentDevice={state.currentDevice} initialColor={state.bedroomColor} />
          <Brightness initialBrightness={state.bedroomBrightness} currentDevice={state.currentDevice} />
        </div>
      )
    } else if (state.currentDevice === Device.COMPUTER && state.livingroomColor && state.livingroomBrightness) {
      return (
        <div className="App">
          <div>
            <DevicePicker setCurrentDevice={(currentDevice: Device) => setCurrentDevice(currentDevice)} currentDevice={state.currentDevice} />
          </div>
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
}

export default App;
