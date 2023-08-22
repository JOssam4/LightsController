import React, { useEffect, useState } from 'react';
import { HsvColorPicker, HsvColor } from 'react-colorful';
import { Mode } from './ModePicker';
import InputField from './InputField';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import { BrightnessLow, BrightnessHigh } from '@mui/icons-material';
import { CompletedStatus } from './Types';


interface Props {
  controlledDevices: Set<string>;
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
    const promises = Array.from(props.controlledDevices).map((deviceId: string) => {
      return fetch(`http://localhost:3001/color?device=${deviceId}`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({color}),
      })
          .then((resp: Response) => {
            if (resp.ok) {
              return resp.json();
            } else {
              console.error(resp.text());
            }
          })
          .then((respjson: CompletedStatus) => {
            if (!respjson.completed) {
                console.log(`Failed setting color on device ${deviceId}`);
            }
          })
          .catch((err) => console.error(err));
    });
    Promise.all(promises)
        .then(() => setColor(color));
  }

  function forceUpdateColor() {
    // assuming state holds final color
    const promises = Array.from(props.controlledDevices).map((deviceId: string) => {
      return fetch(`http://localhost:3001/color?device=${deviceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({color}),
      })
          .then((resp: Response) => {
            if (resp.ok) {
              return resp.json();
            } else {
              console.error(resp.text());
            }
          })
          .then((respjson: CompletedStatus) => {
            if (respjson.completed) {
              console.log(`Completed setting color on device ${deviceId}`)
            } else {
              console.log(`Failed setting color on device ${deviceId}`);
            }
          })
          .catch((err) => console.error(err));
    });
    Promise.all(promises)
        .then(() => console.log('Completed setting colors on all devices'));
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
    const promises = Array.from(props.controlledDevices).map((deviceId: string) => {
      fetch(`http://localhost:3001/brightness?device=${deviceId}`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({brightness}),
      })
          .then((response: Response) => {
            if (response.ok) {
              return response.json();
            } else {
              console.error(`Failed setting color on device ID ${deviceId}`);
            }
          })
          .then((respjson: CompletedStatus) => {
            if (respjson.completed) {
              console.log(`Completed setting color on device ${deviceId}`)
            } else {
              console.log(`Failed setting color on device ${deviceId}`);
            }
          })
          .catch((err) => console.error(err));
    });
    Promise.all(promises)
        .then(() => console.log('Completed setting brightness on all devices'));
  }

  const brightnessSlider = (props.mode === Mode.COLOR) ? (
    <Slider value={color.v}
                  aria-label="Brightness Slider"
                  min={0} max={100}
                  valueLabelDisplay="on"
                  onChange={(event, newVal: number | number[]) => updateBrightness(event, newVal)}
    />
  ) : (
    <Slider value={whiteBrightness}
                  aria-label="Brightness Slider"
                  min={0} max={100}
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