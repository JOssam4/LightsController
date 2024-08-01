import React, {useEffect, useRef, useState} from 'react';
import { HsvColorPicker, HsvColor } from 'react-colorful';
import { Mode } from './ModePicker';
import InputField from './InputField';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import { BrightnessLow, BrightnessHigh, AcUnit, LocalFireDepartment } from '@mui/icons-material';


interface Props {
  controlledDevices: Set<string>;
  initialColor: HsvColor;
  mode: Mode;
  initialWhiteBrightness: number;
  overrideMode: () => void;
  initialWarmth: number | undefined | null;
}

export default function Picker(props: Props) {
  const [color, setColor] = useState<HsvColor>(props.initialColor);
  const [whiteBrightness, setWhiteBrightness] = useState<number>(() => {
    if (props.initialWhiteBrightness) {
      return props.initialWhiteBrightness;
    } else if (props.initialColor) {
      return props.initialColor.v;
    } else {
      return 0;
    }
  });
  const [warmth, setWarmth] = useState<number | undefined | null>(props.initialWarmth);
  const canUpdateColors = useRef(true);
  const canUpdateBrightness = useRef(true);
  const canUpdateWarmth = useRef(true);

  useEffect(() => {
    setColor(props.initialColor);
  }, [props.initialColor]);

  useEffect(() => {
    setWarmth(props.initialWarmth);
  }, [props.initialWarmth]);

  function updateLights(color: HsvColor) {
    if (!canUpdateColors.current) {
      return;
    }
    // Allow switching of modes just by touching the color pad
    canUpdateColors.current = false;
    props.overrideMode();
    setColor(color);
    fetch(`/color?device=${Array.from(props.controlledDevices)}`, {
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
        } else if (!response.ok && response.status === 429) {
          console.log('too many requests');
          console.dir(response);
        }
      })
        .finally(() => setTimeout(() => canUpdateColors.current = true, 200));
  }

  function updateBrightness(event: Event, newVal: number | number[]) {
    if (!canUpdateBrightness.current) {
      return;
    }
    canUpdateBrightness.current = false;
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
    fetch(`/brightness?device=${Array.from(props.controlledDevices)}`, {
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
        } else if (!response.ok && response.status === 429) {
          console.log('too many requests');
        }
      })
        .finally(() => setTimeout(() => canUpdateBrightness.current = true, 200));
  }

  function updateWarmth(event: Event, newVal: number | number[]) {
    if (!canUpdateWarmth.current) {
      return;
    }
    canUpdateWarmth.current = false;
    const warmth = (typeof newVal === 'number') ? newVal : newVal[newVal.length - 1];
    setWarmth(warmth);
    fetch(`/warmth?device=${Array.from(props.controlledDevices)}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({warmth}),
    })
      .then((response) => {
        if (!response.ok && response.status !== 429) {
          console.log(`error code: ${response.status}`);
          console.error(response.statusText);
        } else if (!response.ok && response.status === 429) {
          console.log('too many requests');
        }
      })
      .finally(() => setTimeout(()=> canUpdateWarmth.current = true, 200));
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

  const warmthSlider = (warmth !== null && warmth !== undefined && 0 <= warmth && warmth <= 100)
    ? <Slider value={warmth!}
              aria-label="Warmth Slider"
              min={0} max={100}
              valueLabelDisplay="on"
              onChange={(event, newVal: number | number[]) => updateWarmth(event, newVal)}
    />
    : null;

  if (props.initialColor) {
    return (
      <div className="color-picker">
        <HsvColorPicker
          color={color}
          onChange={(color: HsvColor) => updateLights(color)}
          onTouchEnd={() => setTimeout(() => updateLights(color), 400)}
          onMouseUp={() => setTimeout(() => updateLights(color), 400)}
        />
        <br />
        <br />
        <Stack spacing={2} direction="row" alignItems="center">
          <BrightnessLow style={{color: 'white'}}/>
          {brightnessSlider}
          <BrightnessHigh style={{color: 'white'}} />
        </Stack>
        <br />
        {(warmth || warmth === 0) &&
          <Stack spacing={2} direction="row" alignItems="center">
            <AcUnit style={{color: 'white'}}/>
            {warmthSlider}
            <LocalFireDepartment style={{color: 'white'}} />
          </Stack>
        }
        <br />
        <br />
        <InputField color={color} handleChange={(hsv: HsvColor) => updateLights(hsv)} />
      </div>
    );
  } else {
    return null;
  }

}