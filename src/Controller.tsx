import React, { useState, useEffect } from 'react';
import ModePicker, { Mode } from './ModePicker';
import { HsvColor } from 'react-colorful';
import Picker from './Picker';
import Toggle from './Toggle';

interface LightState {
  color: HsvColor;
  mode: Mode;
  brightness: number;
  toggle: boolean;
  sceneBrightness: number;
}

interface Props {
  controlledDevices: Set<string>;
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
    // brightness = white light brightness/hue warmth. HSV stores its own brightness value.
    brightness: null,
    sceneBrightness: null,
  });

  useEffect(() => {
    const promises: Promise<void>[] = Array.from(props.controlledDevices).map((deviceId: string) => {
      return fetch(`http://localhost:3001/state?device=${deviceId}`)
          .then((resp: Response) => {
            if (resp.ok) {
              return resp.json();
            } else {
              console.error(resp.text());
            }
          })
          .then((respjson: LightState) => setState({
            toggle: respjson.toggle,
            mode: respjson.mode,
            brightness: respjson.brightness,
            color: respjson.color,
            sceneBrightness: respjson?.sceneBrightness,
          }))
          .catch((err) => console.error(err));
    });
    Promise.all(promises)
        .then(() => console.log('Done getting light states in Controller.tsx'));
  }, [props]);

  if (state.toggle !== null && state.mode !== null && state.color && state.brightness !== null && state.sceneBrightness !== null) {
    return (
      <div id="controller">
        <Toggle controlledDevices={props.controlledDevices} status={state.toggle} />
        <ModePicker controlledDevices={props.controlledDevices} initialMode={state.mode} setMode={(mode: Mode) => setState({ ...state, mode })} />
        <Picker controlledDevices={props.controlledDevices} initialColor={state.color} mode={state.mode} initialWhiteBrightness={state.brightness} overrideMode={() => setState({ ...state, mode: Mode.COLOR})} />
      </div>
    );
  } else {
    return <div />;
  }

}