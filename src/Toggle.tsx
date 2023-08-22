import React, { useState, useEffect } from 'react';
import { IconButton } from '@mui/material';
import { PowerSettingsNewOutlined } from '@mui/icons-material';
import {CompletedStatus} from "./Types";

interface Props {
  controlledDevices: Set<string>;
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

    const promises = Array.from(props.controlledDevices).map((deviceId: string) => {
      return fetch(`http://localhost:3001/toggle?device=${deviceId}`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({toggle: !state.status}),
      })
          .then((response: Response) => {
            if (response.ok) {
              return response.json();
            } else {
              console.error(response.text());
            }
          })
          .then((respjson: CompletedStatus) => {
            if (!respjson.completed) {
              console.error(`Could not toggle device with id ${deviceId}`);
            }
          })
          .catch((err) => console.error(err));
    });
    Promise.all(promises)
        .then(() => setState({ status: !state.status }));
  }

  if (state.status) {
    return (
      <IconButton aria-label="On/Off" color="success" onClick={() => handleClick()} id="toggle-button">
        <PowerSettingsNewOutlined fontSize="inherit" />
      </IconButton>
    );
  } else {
    return (
      <IconButton aria-label="On/Off" onClick={() => handleClick()} id="toggle-button">
        <PowerSettingsNewOutlined fontSize="inherit" />
      </IconButton>
    );
  }
}