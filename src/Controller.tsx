import React, { useState, useEffect } from 'react';
import { Device } from './DevicePicker';
import ModePicker, { Mode } from './ModePicker';
import { HsvColor } from 'react-colorful';
import Picker from './Picker';
import Toggle from './Toggle';
import ScenePicker from './ScenePicker';

interface LightState {
  color: HsvColor;
  mode: Mode;
  brightness: number;
  toggle: boolean;
  sceneBrightness: number;
}

interface Props {
  device: Device;
}

interface State {
  toggle: boolean | null;
  mode: Mode | null;
  color: HsvColor | null;
  brightness: number | null;
  sceneBrightness: number | null;
}

export default function Controller(props: Props) {
  const [state, setState] = useState<State>({
    toggle: null,
    mode: null,
    color: null,
    // brightness = white light brightness. HSV stores its own brightness value.
    brightness: null,
    sceneBrightness: null,
  });

  useEffect(() => {
    fetch(`/state?device=${props.device}`)
      .then((resp) => resp.json())
      .then((response: LightState) => {
        setState({
          toggle: response.toggle,
          mode: response.mode,
          brightness: response.brightness,
          color: response.color,
          sceneBrightness: response.sceneBrightness
        })
        console.log(`sceneBrightness: ${response.sceneBrightness}`)
      })
  }, [props.device, state.mode]);

  if (state.toggle !== null && state.mode !== null && state.color && state.brightness !== null && state.sceneBrightness !== null) {
    if (state.mode === Mode.SCENE) {
      return (
        <div id="controller">
          <Toggle currentDevice={props.device} status={state.toggle} />
          <ModePicker currentDevice={props.device} initialMode={state.mode} setMode={(mode: Mode) => setState({ ...state, mode })} />
          <ScenePicker currentDevice={props.device} brightness={state.sceneBrightness} />
        </div>
      );
    }
    return (
      <div>
        <Toggle currentDevice={props.device} status={state.toggle} />
        <ModePicker currentDevice={props.device} initialMode={state.mode} setMode={(mode: Mode) => setState({ ...state, mode })} />
        <Picker currentDevice={props.device} initialColor={state.color} mode={state.mode} initialWhiteBrightness={state.brightness} overrideMode={() => setState({ ...state, mode: Mode.COLOR})} />
        <ScenePicker currentDevice={props.device} brightness={state.sceneBrightness} />
      </div>
    );
  } else {
    return <div />;
  }

}