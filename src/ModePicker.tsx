import React, { useState, useEffect } from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

const enum Mode {
  WHITE = 'white',
  COLOR = 'colour',
  SCENE = 'scene',
  MUSIC = 'music',
}


interface Props {
    controlledDevices: Set<string>;
    initialMode: Mode;
    setMode: (mode: Mode) => void;
}


export default function ModePicker(props: Props) {
    const [mode, setMode] = useState(props.initialMode);

    
    useEffect(() => {
        setMode(props.initialMode);
    }, [props.initialMode]);

    function updateMode(mode: Mode) {
        const promises = Array.from(props.controlledDevices).map((deviceId: string) => {
            return fetch(`http://localhost:3001/mode?device=${deviceId}`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({mode}),
            })
                .then((response: Response) => {
                    if (response.ok) {
                        return response.json();
                    } else if (response.status === 429) {
                        console.error('Too many requests');
                    } else {
                        console.error(response.text());
                    }
                })
                .catch((err) => console.error(err));
        })
        Promise.all(promises)
            .then(() => props.setMode(mode));
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
                    <ToggleButton value={Mode.COLOR} aria-label="color" disabled>
                        <p>COLOR</p>
                    </ToggleButton>
                </ToggleButtonGroup>
            </div>
        );
    }
}

export { Mode };