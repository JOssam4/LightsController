import React, { useState } from 'react';
import NavigationDrawer from './NavigationDrawer';
import DevicePicker from './DevicePicker';
import TimePicker from './TimePicker';

interface State {
  controlledDevices: Set<string>;
}

export default function Timer() {
  const [state, setState] = useState<State>({
    controlledDevices: new Set<string>(),
  });

  function setControlledDevices(controlledDevices: Set<string>): void {
    setState({ ...state, controlledDevices });
  }

  return (
    <div className="home">
      <NavigationDrawer />
      <DevicePicker setControlledDevices={setControlledDevices} />
      <TimePicker controlledDevices={state.controlledDevices} />
    </div>
  );
}