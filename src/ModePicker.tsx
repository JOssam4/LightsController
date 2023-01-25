import React, { useState, useEffect } from 'react';
import { Device } from './DevicePicker';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

enum Mode {
  WHITE = 'white',
  COLOR = 'colour',
  SCENE = 'scene',
  MUSIC = 'music',
}

interface Props {
    currentDevice: Device;
    initialMode: Mode;
    setMode: (mode: Mode) => void;
}


export default function ModePicker(props: Props) {
    const [mode, setMode] = useState(props.initialMode);

    
    useEffect(() => {
        setMode(props.initialMode);
    }, [props.initialMode]);

    function updateMode(mode: Mode) {
        // setMode(mode);
        props.setMode(mode);
        fetch(`/mode?device=${props.currentDevice}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({mode}),
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

    if (mode === Mode.WHITE) {
        return (
            <div id="mode-picker">    
                <ToggleButtonGroup value={mode} size="small" exclusive onChange={(event, newMode: Mode) => updateMode(newMode)} aria-label="mode chooser">
                    <ToggleButton value={Mode.WHITE} aria-label="white" disabled>
                        <p>WHITE</p>
                    </ToggleButton>
                    <ToggleButton value={Mode.COLOR} aria-label="color">
                        <p>COLOR</p>
                    </ToggleButton>
                    <ToggleButton value={Mode.SCENE} aria-label="scene">
                        <p>SCENE</p>
                    </ToggleButton>
                </ToggleButtonGroup>
            </div>
        );
    } else if (mode === Mode.COLOR) {
        return (
            <div id="mode-picker">
                <ToggleButtonGroup value={mode} size="small" exclusive onChange={(event, newMode: Mode) => updateMode(newMode)} aria-label="mode chooser">
                    <ToggleButton value={Mode.WHITE} aria-label="white">
                        <p>WHITE</p>
                    </ToggleButton>
                    <ToggleButton value={Mode.COLOR} aria-label="color" disabled>
                        <p>COLOR</p>
                    </ToggleButton>
                    <ToggleButton value={Mode.SCENE} aria-label="scene">
                        <p>SCENE</p>
                    </ToggleButton>
                </ToggleButtonGroup>
            </div>
        );
    } else {
        return (
            <div id="mode-picker">
                <ToggleButtonGroup value={mode} size="small" exclusive onChange={(event, newMode: Mode) => updateMode(newMode)} aria-label="mode chooser">
                    <ToggleButton value={Mode.WHITE} aria-label="white">
                        <p>WHITE</p>
                    </ToggleButton>
                    <ToggleButton value={Mode.COLOR} aria-label="color">
                        <p>COLOR</p>
                    </ToggleButton>
                    <ToggleButton value={Mode.SCENE} aria-label="scene" disabled>
                        <p>SCENE</p>
                    </ToggleButton>
                </ToggleButtonGroup>
            </div>
        );
    }
}

export { Mode };