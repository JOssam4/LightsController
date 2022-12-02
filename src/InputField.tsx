import React, { useState, useEffect } from 'react';
import { HsvColor } from 'react-colorful';

interface Props {
  color: HsvColor;
  handleChange: (hsv: HsvColor) => void;
}

function clamp(value: number, max: number, min: number): number {
  return value > max ? max : value < min ? min : value;
}

function toHsv(value: string[]): HsvColor {
  const [h, s, v] = value.map((v, i) => clamp(Number(v), i ? (i < 3 ? 100 : 1) : 360, 0));

  return { h, s, v };
}

function getHsvString(hsv: HsvColor) {
  return `${Math.round(hsv.h)}°, ${hsv.s.toFixed(1)}%, ${hsv.v.toFixed(1)}%`;
}

export default function InputField(props: Props) {

  const [state, setState] = useState<string>(getHsvString(props.color));

  useEffect(() => {
    setState(getHsvString(props.color));
  }, [props.color])

  const changeHSV = (e: React.ChangeEvent<HTMLInputElement>): void => {

    const value = e.target.value.match(/\d+(?:\.\d+)?/g);
    // value now is of type string[] with values [h, s, v]

    if (value && value.length === 3) {
      const {h, s, v} = toHsv(value);

      setState(getHsvString({h, s, v}));
    }
  };

  function setHSV() {
    const value = state.match(/\d+(?:\.\d+)?/g);
    if (value && value.length === 3) {
      const hsv = toHsv(value);
      props.handleChange(hsv);
    }
  }

  return (
    <div className="color-picker-input">
      <input className="color-picker-input-field"
             value={state}
             onChange={changeHSV}
             onBlur={() => setHSV()}
      />
      <label className="color-picker-input-label">HSV</label>
    </div>
  );



}