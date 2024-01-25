import React, {useState, useRef} from 'react';
import {Button, Typography} from '@mui/material';
import ScrollPicker from './ScrollPicker';
import './TimePicker.css';

interface Props {
  controlledDevices: Set<string>;
}

export default function TimePicker(props: Props) {
  const [submitted, setSubmitted] = useState<boolean>(false);

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

  function getFutureDatetime(): Date {
    const numMillisecondsFromHours: number = hours.current * 60 * 60 * 1000;
    const numMillisecondsFromMinutes: number = minutes.current * 60 * 1000;
    const numMillisecondsFromSeconds: number = seconds.current * 1000;
    const numMillisecondsFromNow: number = numMillisecondsFromHours + numMillisecondsFromMinutes + numMillisecondsFromSeconds;
    return new Date(Date.now() + numMillisecondsFromNow);
  }

  function submitTimer() {
    const futureDatetime = getFutureDatetime();
    console.log(`sending timer request for ${futureDatetime}`);
    fetch(`/timer?device=${Array.from(props.controlledDevices)}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({time: futureDatetime}),
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
        setSubmitted(true);
      })
  }

  return (
    <div className="timepicker-container">

      <div className="scrollpicker-columns-wrapper">
        <span className="scrollpicker-wrapper">
        <Typography variant="body1" className="scrollpicker-label">Hours</Typography>
        <ScrollPicker onChange={onChangeHours} unit="hours" cellHeight={35} initial={hours.current} maxHours={23}
                      isSmallScreen={false}/>
        </span>
          <span className="scrollpicker-wrapper">
          <Typography variant="body1" className="scrollpicker-label">Minutes</Typography>
          <ScrollPicker onChange={onChangeMinutes} unit="mins" cellHeight={35} initial={minutes.current}
                        isSmallScreen={false}/>
        </span>
          <span className="scrollpicker-wrapper">
          <Typography variant="body1" className="scrollpicker-label">Seconds</Typography>
          <ScrollPicker onChange={onChangeSeconds} unit="secs" cellHeight={35} initial={seconds.current}
                        isSmallScreen={false}/>
        </span>
      </div>
      <div className="timpicker-submit-button">
        <Button variant="outlined" onClick={() => submitTimer()} disabled={submitted || props.controlledDevices.size === 0}>Submit</Button>
      </div>
    </div>
  );
}