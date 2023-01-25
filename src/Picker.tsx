import React, { useEffect, useState } from 'react';
import { HsvColorPicker, HsvColor } from 'react-colorful';
import { Device } from './DevicePicker';
import { Mode } from './ModePicker';
import InputField from './InputField';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import { BrightnessLow, BrightnessHigh } from '@mui/icons-material';


interface Props {
  currentDevice: Device;
  initialColor: HsvColor;
  mode: Mode;
  initialWhiteBrightness: number;
  overrideMode: () => void;
}

export default function Picker(props: Props) {
  const [color, setColor] = useState<HsvColor>(props.initialColor);
  const [whiteBrightness, setWhiteBrightness] = useState<number>(props.initialWhiteBrightness);

  useEffect(() => {
    setColor(props.initialColor);
  }, [props.initialColor]);

  function updateLights(color: HsvColor) {
    // Allow switching of modes just by touching the color pad
    props.overrideMode();
    setColor(color);
    fetch(`/color?device=${props.currentDevice}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({color}),
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

  function forceUpdateColor() {
    // assuming state holds final color
    fetch(`/color?device=${props.currentDevice}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    body: JSON.stringify({color}),
    })
      .then((response) => {
        if (!response.ok) {
          console.error(response.statusText);
        }
      });
  }

  function updateBrightness(event: Event, newVal: number | number[]) {
    const brightness = (typeof newVal === "number") ? newVal : newVal[newVal.length - 1];
    if (props.mode === Mode.COLOR) {
      setColor({
        h: color.h,
        s: color.s,
        v: brightness,
      });
    } else {
      setWhiteBrightness(brightness);
    }
    fetch(`/brightness?device=${props.currentDevice}`, {
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

  const brightnessSlider = (props.mode === Mode.COLOR) ? (
    <Slider value={color.v}
                  aria-label="Brightness Slider"
                  min={1} max={100}
                  valueLabelDisplay="on"
                  onChange={(event, newVal: number | number[]) => updateBrightness(event, newVal)}
    />
  ) : (
    <Slider value={whiteBrightness}
                  aria-label="Brightness Slider"
                  min={1} max={100}
                  valueLabelDisplay="on"
                  onChange={(event, newVal: number | number[]) => updateBrightness(event, newVal)}
    />
  )

  if (props.initialColor) {
    return (
      <div className="color-picker">
        <HsvColorPicker
          color={color}
          onChange={(color: HsvColor) => updateLights(color)}
          onTouchEnd={() => {forceUpdateColor(); console.log('touch end');}}
          onMouseUp={() => {forceUpdateColor(); console.log('mouse up');}}
        />
        <br />
        <br />
        <Stack spacing={2} direction="row" alignItems="center">
          <BrightnessLow style={{color: 'white'}}/>
          {brightnessSlider}
          <BrightnessHigh style={{color: 'white'}} />
        </Stack>
        <br />
        <br />
        <InputField color={color} handleChange={(hsv: HsvColor) => updateLights(hsv)} />
      </div>
    );
  } else {
    return null;
  }

}