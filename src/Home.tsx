import React, {useState} from 'react';
import './Home.css';
import Controller from './Controller';
import DevicePicker from './DevicePicker';
import {DevicesResponse} from './Types';
import NavigationDrawer from './NavigationDrawer';

interface State {
  // currentDevice: Device;
  devices: DevicesResponse | undefined;
  controlledDevices: Set<string>;
}

function Home() {
  const [state, setState] = useState<State>({
    devices: undefined,
    controlledDevices: new Set<string>(),
  });

  function setControlledDevices(controlledDevices: Set<string>): void {
    setState({ ...state, controlledDevices });
  }

  return (
    <div className="home">
        <NavigationDrawer />
        <DevicePicker setControlledDevices={setControlledDevices} />
        <Controller controlledDevices={state.controlledDevices}/>
    </div>
  );
}

export default Home;
