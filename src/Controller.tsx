import React, { useState, useEffect } from 'react';
import { Device } from './DevicePicker';
import { HsvColor } from 'react-colorful';
import Picker from './Picker';
import Toggle from './Toggle';

interface LightState {
  color: HsvColor;
  brightness: number;
  toggle: boolean;
}

interface Props {
  device: Device;
}

interface State {
  toggle: boolean | null;
  color: HsvColor | null;
  brightness: number | null;
}

export default function Controller(props: Props) {
  const [state, setState] = useState<State>({
    toggle: null,
    color: null,
    brightness: null,
  });

  useEffect(() => {
    fetch(`/state?device=${props.device}`)
      .then((resp) => resp.json())
      .then((response: LightState) => {
        setState({
          toggle: response.toggle,
          brightness: response.brightness,
          color: response.color
        })
      })
  }, [props.device]);

  if (state.toggle !== null && state.color && state.brightness !== null) {
    return (
      <div>
        <Toggle currentDevice={props.device} status={state.toggle} />
        <Picker currentDevice={props.device} initialColor={state.color} />
      </div>
    );
  } else {
    return <div />;
  }

}