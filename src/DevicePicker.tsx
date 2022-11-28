import React, { useState, useEffect } from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faDesktop, faBed } from "@fortawesome/free-solid-svg-icons";

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
          <FontAwesomeIcon icon={faBed} />
        </ToggleButton>
        <ToggleButton value={Device.COMPUTER} aria-label="computer lights">
          <FontAwesomeIcon icon={faDesktop} />
        </ToggleButton>
      </ToggleButtonGroup>
    );
  } else {
    return (
      <ToggleButtonGroup value={state.currentDevice} exclusive onChange={(event, newDevice: Device) => handleDeviceChange(event, newDevice)} aria-label="device chooser">
        <ToggleButton value={Device.BEDROOM} aria-label="bedroom lights">
          <FontAwesomeIcon icon={faBed} />
        </ToggleButton>
        <ToggleButton value={Device.COMPUTER} aria-label="computer lights" disabled>
          <FontAwesomeIcon icon={faDesktop} />
        </ToggleButton>
      </ToggleButtonGroup>
    )
  }
}

export { Device };