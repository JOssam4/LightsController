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
  temperature: number | undefined;
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
  warmth: number | undefined | null;
}

export default function Controller(props: Props) {
  const [state, setState] = useState<State>({
    toggle: null,
    mode: null,
    color: null,
    // brightness = white light brightness. HSV stores its own brightness value.
    brightness: null,
    sceneBrightness: null,
    warmth: null
  });

  useEffect(() => {
    const promises: Promise<LightState>[] = Array.from(props.controlledDevices).map((deviceId: string) => {
      return new Promise((resolve, reject) => {
        fetch(`/state?device=${deviceId}`)
          .then((resp: Response) => {
            if (resp.ok) {
              resolve(resp.json());
            } else {
              reject(resp.text());
            }
          })
      });
    });
    Promise.all(promises)
        .then((values: LightState[]) => {
          const combinedState: LightState = values.reduce((val1: LightState, val2: LightState) => {
            console.dir(val1);
            console.dir(val2);
            const allKeys: Set<string> = new Set(Object.keys(val1).concat(Object.keys(val2)));
            const keysInVal2NotInVal1 = Array.from(allKeys).filter(key => !Object.keys(val1).includes(key));
            keysInVal2NotInVal1.forEach(key => {
              // @ts-ignore
              val1[key] = val2[key];
            });
            return val1;
          });
          console.log('combinedState:');
          console.dir(combinedState);
          setState({
            toggle: combinedState.toggle,
            mode: combinedState.mode,
            brightness: combinedState.brightness,
            color: combinedState.color,
            sceneBrightness: combinedState.sceneBrightness,
            warmth: combinedState?.temperature
          });
          console.log('Done getting light states in Controller.tsx')
        });
  }, [props]);

  if (state.toggle !== null && state.mode !== null && state.color && state.brightness !== null && state.sceneBrightness !== null) {
    return (
      <div id="controller">
        <Toggle controlledDevices={props.controlledDevices} status={state.toggle} />
        <ModePicker controlledDevices={props.controlledDevices} initialMode={state.mode} setMode={(mode: Mode) => setState({ ...state, mode })} />
        <Picker controlledDevices={props.controlledDevices} initialColor={state.color} mode={state.mode} initialWhiteBrightness={state.brightness} initialWarmth={state.warmth} overrideMode={() => setState({ ...state, mode: Mode.COLOR})} />
      </div>
    );
  } else {
    return <div />;
  }

}