import { SceneParts, Scene } from './Scene';

enum ChangeMode {
    STATIC,
    JUMP,
    GRADUAL,
};

function getCoolColorFade(brightness: number): SceneParts {
    const sceneparts: Scene[] = [];
    for (let i = 166; i < 280; i += 22) {
        sceneparts.push(
            {
                unitSwitchIntervalTime: 50,
                unitChangeTime: 10,
                unitChangeMode: ChangeMode.GRADUAL,
                h: i,
                s: 95,
                v: brightness,
                whiteLightBrightness: 0,
                colorTemperature: 0,
            },
        )
    }
    return {
        sceneNum: 0,
        sceneName: 'fade cool colors',
        parts: sceneparts
    }
}

function getWarmColorFade(brightness: number): SceneParts {
    const sceneparts: Scene[] = [];
    for (let i = 322; i < 360; i += 22) {
        sceneparts.push(
            {
                unitSwitchIntervalTime: 50,
                unitChangeTime: 10,
                unitChangeMode: ChangeMode.GRADUAL,
                h: i,
                s: 95,
                v: brightness,
                whiteLightBrightness: 0,
                colorTemperature: 0,
            },
        )
    }
    for (let i = 0; i < 60; i += 22) {
        sceneparts.push(
            {
                unitSwitchIntervalTime: 50,
                unitChangeTime: 10,
                unitChangeMode: ChangeMode.GRADUAL,
                h: i,
                s: 95,
                v: brightness,
                whiteLightBrightness: 0,
                colorTemperature: 0,
            },
        );
    }
    return {
        sceneNum: 0,
        sceneName: 'fade warm colors',
        parts: sceneparts,
    }
}

export {getCoolColorFade, getWarmColorFade};