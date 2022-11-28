import React, { useState, useEffect } from 'react';
import {IconButton} from '@mui/material';
import {PowerSettingsNewOutlined} from '@mui/icons-material';
import {Device} from "./DevicePicker";

interface Props {
  currentDevice: Device;
  status: boolean;
}

interface State {
  status: boolean;
}

export default function Toggle(props: Props) {
  const [state, setState] = useState<State>({
    status: props.status,
  });

  useEffect(() => {
    setState({status: props.status});
  }, [props])

  function handleClick() {
    console.log('clicked toggle button');
    fetch(`http://localhost:3001/toggle?device=${props.currentDevice}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({toggle: !state.status}),
    })
      .then((response) => {
        if (!response.ok && response.status !== 429) {
          console.log(`error code: ${response.status}`);
          console.error(response.statusText);
        } else if (!response.ok) {
          console.log('too many requests');
        }
      });
    setState({ status: !state.status });
  }

  if (state.status) {
    return (
      <IconButton aria-label="On/Off" color="success" onClick={() => handleClick()}>
        <PowerSettingsNewOutlined fontSize="large" />
      </IconButton>
    );
  } else {
    return (
      <IconButton aria-label="On/Off" onClick={() => handleClick()}>
        <PowerSettingsNewOutlined fontSize="large" />
      </IconButton>
    );
  }
}