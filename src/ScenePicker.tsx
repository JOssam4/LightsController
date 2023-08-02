import React, { useEffect, useState } from 'react';
import { Device } from './DevicePicker';
import Scene, { SceneParts } from './Scene';
import { getCoolColorFade, getWarmColorFade } from './SavedScenes';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import { BrightnessLow, BrightnessHigh } from '@mui/icons-material';


interface Props {
    currentDevice: Device;
    brightness: number;
}

interface State {
    scenes: SceneParts[];
    brightness: number;
}

function getRgbs(c: number, x: number, h: number): [number, number, number] {
    if (h >= 0 && h < 60) {
        return [c, x, 0];
      } else if (h >= 60 && h < 120) {
        return [x, c, 0];
      } else if (h >= 120 && h < 180) {
        return [0, c, x];
      } else if (h >= 180 && h < 240) {
        return [0, x, c];
      } else if (h >= 240 && h < 300) {
        return [x, 0, c];
      } else {
        return [c, 0, x];
      }
} 

function getRGB(h: number, s: number, v: number) {
    s /= 100;
    v /= 100;

    const c = v * s;
    const hh = h / 60.0;
    const x = c * (1.0 - Math.abs((hh % 2) - 1));
    const m = v - c;
    const [rp, gp, bp] = getRgbs(c, x, h);
    return [((rp + m) * 255).toFixed(2), ((gp + m) * 255).toFixed(2), ((bp + m) * 255).toFixed(2)];
}

export default function ScenePicker(props: Props) {
    const [state, setState] = useState<State>({
        scenes: [],
        brightness: props.brightness,
    });

    useEffect(() => {
        setState({
            ...state,
            scenes: [getCoolColorFade(state.brightness), getWarmColorFade(state.brightness)],
        });
    }, [state.brightness]);

    useEffect(() => {
        setState({
            ...state,
            brightness: props.brightness,
        });
    }, [props.brightness]);

    function setActiveScene(scene: SceneParts) {
        fetch(`/scene?device=${props.currentDevice}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(scene),
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

    function renderScenes(): JSX.Element[] {
        const ret = [];
        for (const scene of state.scenes) {
            const firstScene = scene.parts[0];
            const firstSceneConversion = getRGB(firstScene.h, firstScene.s, firstScene.v);
            const firstRGB = `rgb(${firstSceneConversion[0]}, ${firstSceneConversion[1]}, ${firstSceneConversion[2]})`;

            const lastScene = scene.parts[scene.parts.length - 1];
            const lastSceneConversion = getRGB(lastScene.h, lastScene.s, lastScene.v);
            const lastRGB = `rgb(${lastSceneConversion[0]}, ${lastSceneConversion[1]}, ${lastSceneConversion[2]})`;
            ret.push(
                <Grid xs={6} sm={6} md={6} lg={6} xl={6}>
                    <Scene 
                        gradientColors={[firstRGB, lastRGB]} 
                        sceneparts={scene} 
                        sceneName={scene.sceneName}
                        onClickHandler={(sceneParts: SceneParts) => setActiveScene(sceneParts)} 
                    />
                </Grid>
            );
        }
        return ret;
    }

    function updateBrightness(event: Event, newVal: number | number[]) {
        const brightness = (typeof newVal === 'number') ? newVal : newVal[newVal.length - 1]
        setState({...state, brightness });
        fetch(`/brightness?device=${props.currentDevice}`, {
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
                } else {
                    console.log('too many requests');
                }
            });
    }

    return (
        <Grid container spacing={2}>
            {renderScenes()}
            <Grid xs={12} sm={12} md={12} lg={12} xl={12}>
                <Stack spacing={2} direction="row" alignItems="center">
                    <BrightnessLow style={{color: 'white'}} />
                    <Slider value={state.brightness}
                    aria-label="Brightness Slider"
                    min={1} max={100} 
                    valueLabelDisplay="on"
                    onChange={(event, newVal: number | number[]) => updateBrightness(event, newVal)}
                />    
                    <BrightnessHigh style={{color: 'white'}} />
                </Stack>
            </Grid>
        </Grid>
    );
}