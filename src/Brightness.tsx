import React, { useState, useEffect } from 'react';
import { Device } from './DevicePicker';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import { BrightnessLow, BrightnessHigh } from '@mui/icons-material';

interface Props {
  initialBrightness: number;
  currentDevice: Device;
}


interface State {
  brightness: number;
}

export default function Brightness(props: Props) {
  const [state, setState] = useState<State>({
    brightness: props.initialBrightness,
  });

  useEffect(() => {
    setState({
      brightness: props.initialBrightness
    });
  }, [props]);

  function changeHandler(event: Event, newVal: number | number[]) {
    const brightness = (typeof newVal === "number") ? newVal : newVal[newVal.length - 1];
    setState({ brightness });
    fetch(`http://localhost:3001/brightness?device=${props.currentDevice}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ brightness }),
    })
      .then((response) => {
        if (!response.ok && response.status !== 429) {
          console.log(`error code: ${response.status}`);
          console.error(response.statusText);
        } else {
          console.log('too many requests');
        }
      });
  }

  if (props.initialBrightness) {
    return (
      <div id="slider">
        <Stack spacing={2} direction="row" alignItems="center">
          <BrightnessLow/>
          <Slider value={state.brightness}
                  aria-label="Brightness Slider"
                  min={1} max={100}
                  valueLabelDisplay="on"
                  onChange={(event, newVal: number | number[]) => changeHandler(event, newVal)}
          />
          <BrightnessHigh/>
        </Stack>
      </div>
    );
  } else {
    return null;
  }
}