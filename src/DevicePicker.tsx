import React, { useState } from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { Bed, Computer } from '@mui/icons-material';


enum Device {
  BEDROOM,
  COMPUTER,
}

interface Props {
  currentDevice: Device;
  setCurrentDevice: (device: Device) => void;
}

interface State {
  currentDevice: Device;
}

export default function DevicePicker(props: Props) {
  const [state, setState] = useState<State>({
    currentDevice: props.currentDevice,
  });

  function handleDeviceChange(event: React.MouseEvent, newDevice: Device) {
    console.log(`newDevice: ${newDevice}`);
    props.setCurrentDevice(newDevice);
    setState({ ...state, currentDevice: newDevice });
  }

  if (state.currentDevice === Device.BEDROOM) {
    return (
      <ToggleButtonGroup value={state.currentDevice} exclusive onChange={(event, newDevice: Device) => handleDeviceChange(event, newDevice)} aria-label="device chooser">
        <ToggleButton value={Device.BEDROOM} aria-label="bedroom lights" disabled>
          <Bed fontSize="large"/>
        </ToggleButton>
        <ToggleButton value={Device.COMPUTER} aria-label="computer lights">
          <Computer fontSize="large" />
        </ToggleButton>
      </ToggleButtonGroup>
    );
  } else {
    return (
      <div id="device-picker">
        <ToggleButtonGroup value={state.currentDevice} exclusive onChange={(event, newDevice: Device) => handleDeviceChange(event, newDevice)} aria-label="device chooser">
          <ToggleButton value={Device.BEDROOM} aria-label="bedroom lights">
            <Bed fontSize="large" />
          </ToggleButton>
          <ToggleButton value={Device.COMPUTER} aria-label="computer lights" disabled>
            <Computer fontSize="large" />
          </ToggleButton>
        </ToggleButtonGroup>
      </div>
    )
  }
}

export { Device };