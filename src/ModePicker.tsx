import React, {useState, useEffect, useRef} from 'react';
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
    const canUpdateMode = useRef(true);

    
    useEffect(() => {
        setMode(props.initialMode);
    }, [props.initialMode]);

    function updateMode(mode: Mode) {
        if (!canUpdateMode.current) {
            return;
        }
        canUpdateMode.current = false;
        props.setMode(mode);
        fetch(`/mode?device=${Array.from(props.controlledDevices)}`, {
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
            } else if (!response.ok && response.status === 429) {
              console.log('too many requests');
            }
          })
            .finally(() => setTimeout(() => canUpdateMode.current = true, 200));
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