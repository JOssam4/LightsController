import React, {useState, useEffect, useRef} from 'react';
import { IconButton } from '@mui/material';
import { PowerSettingsNewOutlined } from '@mui/icons-material';

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
  const canUpdateToggle = useRef(true);

  useEffect(() => {
    setState({status: props.status});
  }, [props])

  function handleClick() {
    if (!canUpdateToggle.current) {
      return;
    }
    canUpdateToggle.current = false;
    console.log('clicked toggle button');
    fetch(`/toggle?device=${Array.from(props.controlledDevices)}`, {
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
        } else if (!response.ok && response.status === 429) {
          console.log('too many requests');
        }
      })
        .finally(() => {
          setState({ status: !state.status });
          setTimeout(() => canUpdateToggle.current = true, 200);
        });

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