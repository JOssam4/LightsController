import React, { useEffect } from 'react';
import { ColorPicker, useColor, Color } from 'react-color-palette'
import { Device } from './DevicePicker';

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
  if (props.initialColor) {
    return (
      <div className="color-picker">
        <ColorPicker width={Math.min(456, window.innerWidth * 0.8)} color={color}
                     onChange={(color) => updateLights(color)}
        />
        <div id="preview" style={{backgroundColor: color.hex}}/>
      </div>
    );
  } else {
    return null;
  }

}