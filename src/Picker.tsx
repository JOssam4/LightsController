import React, { useEffect } from 'react';
import {ColorPicker, useColor, Color, toColor} from 'react-color-palette'
import { Device } from './DevicePicker';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import { BrightnessLow, BrightnessHigh } from '@mui/icons-material';

interface Props {
  currentDevice: Device;
  initialColor: Color;
}

export default function Picker(props: Props) {
  const [color, setColor] = useColor('hsv', props.initialColor.hsv);

  useEffect(() => {
    setColor(props.initialColor);
  }, [props.initialColor]);

  function updateLights(color: Color) {
    const hsv = color.hsv;
    setColor(color);
    fetch(`http://localhost:3001/color?device=${props.currentDevice}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({color: hsv}),
    })
      .then((response) => {
        if (!response.ok && response.status !== 429) {
          console.log(`error code: ${response.status}`);
          console.error(response.statusText);
        } else {
          console.log('too many requests');
        }
      })
  }

  function updateBrightness(event: Event, newVal: number | number[]) {
    const brightness = (typeof newVal === "number") ? newVal : newVal[newVal.length - 1];
    setColor(toColor('hsv', {
      h: color.hsv.h,
      s: color.hsv.s,
      v: brightness,
    }));
    fetch(`http://localhost:3001/brightness?device=${props.currentDevice}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({brightness}),
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

  if (props.initialColor) {
    return (
      <div className="color-picker">
        <ColorPicker width={Math.min(456, window.innerWidth * 0.8)} color={color} dark
                     onChange={(color) => updateLights(color)}
        />
        <br />
        <br />
        <Stack spacing={2} direction="row" alignItems="center">
          <BrightnessLow style={{color: 'white'}}/>
          <Slider value={color.hsv.v}
                  aria-label="Brightness Slider"
                  min={1} max={100}
                  valueLabelDisplay="on"
                  onChange={(event, newVal: number | number[]) => updateBrightness(event, newVal)}
          />
          <BrightnessHigh style={{color: 'white'}} />
        </Stack>
      </div>
    );
  } else {
    return null;
  }

}