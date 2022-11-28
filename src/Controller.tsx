import React, { useState, useEffect } from 'react';
import {Device} from './DevicePicker';
import {Color, toColor} from 'react-color-palette';
import Picker from './Picker';
import Brightness from './Brightness';
import Toggle from './Toggle';


interface ColorResponse {
  h: number;
  s: number;
  v: number;
}


interface LightState {
  color: ColorResponse;
  brightness: number;
  toggle: boolean;
}

interface Props {
  device: Device;
}

interface State {
  toggle: boolean | null;
  color: Color | null;
  brightness: number | null;
}

export default function Controller(props: Props) {
  const [state, setState] = useState<State>({
    toggle: null,
    color: null,
    brightness: null,
  });

  useEffect(() => {
    fetch(`http://localhost:3001/state?device=${props.device}`)
      .then((resp) => resp.json())
      .then((response: LightState) => {
        setState({
          toggle: response.toggle,
          brightness: response.brightness,
          color: toColor('hsv', response.color)
        })
      })
  }, [props.device]);

  if (state.toggle !== null && state.color && state.brightness !== null) {
    return (
      <div>
        <Toggle currentDevice={props.device} status={state.toggle} />
        <Picker currentDevice={props.device} initialColor={state.color} />
        <Brightness initialBrightness={state.brightness} currentDevice={props.device} />
      </div>
    );
  } else {
    return <div />;
  }

}