import React, { useState } from 'react';
import Paper from '@mui/material/Paper';

enum ChangeMode {
    STATIC,
    JUMP,
    GRADUAL,
};

interface Scene {
    unitSwitchIntervalTime: number;
    unitChangeTime: number;
    unitChangeMode: ChangeMode;
    h: number;
    s: number;
    v: number;
    whiteLightBrightness: number;
    colorTemperature: number;
};


interface SceneParts {
    sceneNum: number;
    parts: Scene[];
    sceneName: string;
}


interface Props {
    gradientColors: string[];
    sceneparts: SceneParts;
    sceneName: string;
    onClickHandler: (sceneParts: SceneParts) => void;
    key: number;
}

// Represents a mapping between a SceneParts object and an HTML element
export default function Scene(props: Props) {
    const [isActive, setIsActive] = useState(false);
    const gradient = `linear-gradient(0.25turn, ${props.gradientColors[0]}, ${props.gradientColors[1]})`;
    console.log(`gradient: ${gradient}`);
    if (isActive) {
        return (
            <Paper variant="outlined" square elevation={2} style={{padding: '0 2%', background: gradient}}>
                <div style={{background: gradient, height: '100%', width: '100%'}}>
                    <p>{props.sceneName}</p>
                </div>
            </Paper>
        );
    }
    return (
        <Paper variant="outlined" square elevation={2} style={{padding: '0 2%', background: gradient}}>
            <div onClick={() => {
                props.onClickHandler(props.sceneparts)
                setIsActive(!isActive);
            }} style={{background: gradient}} key={props.key}>
                <p className="scene-description">{props.sceneName}</p>
            </div>
        </Paper>
    );
}

export type {SceneParts, Scene};