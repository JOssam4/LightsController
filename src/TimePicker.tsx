import React, { useRef } from 'react';
import ScrollPicker from './ScrollPicker';

export default function TimePicker() {

  const hours = useRef<number>(0);
  const minutes = useRef<number>(0);
  const seconds = useRef<number>(0);

  function onChangeHours(hrs: number) {
    hours.current = hrs;
  }

  function onChangeMinutes(mins: number) {
    minutes.current = mins;
  }

  function onChangeSeconds(secs: number) {
    seconds.current = secs;
  }

  return (
    <div className="timepicker-container">
      <ScrollPicker onChange={onChangeHours} unit="hours" cellHeight={35} initial={hours.current} maxHours={23} isSmallScreen={false} />
      <ScrollPicker onChange={onChangeMinutes} unit="mins" cellHeight={35} initial={minutes.current} isSmallScreen={false} />
      <ScrollPicker onChange={onChangeSeconds} unit="secs" cellHeight={35} initial={seconds.current} isSmallScreen={false} />
    </div>
  );
}