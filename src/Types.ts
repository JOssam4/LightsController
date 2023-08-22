import exp from "constants";

enum AlertState {
    SELECT = 'select',
    LSELECT = 'lselect',
};

enum EffectState {
    COLORLOOP = 'colorloop',
    NONE = 'none'
};

type HueDeviceState = {
    on: boolean; // True if the light should be on
    bri: number; // Brightness, in range 0 - 254. 0 is not off
    hue: number; // Hue, in range 0 - 65535
    sat: number; // Saturation, in range 0 - 254
    effect: EffectState;
    xy: [number, number]; // Color as an array of xy-coordinates
    ct: number; // White color temperature, in range 153 (cold) - 500 (warm)
    alert: AlertState; // 'select' flashes light once, 'lselect' flashes repeatedly for 10 seconds
    colormode: HueMode;
    mode: string;
    reachable: boolean;
}

type HueDeviceResponse = {
    id: string; // Custom addition so we don't have to send back a nested object or a map
    state: HueDeviceState;
    swupdate: Object;
    type: string;
    name: string;
    modelid: string;
    manufacturername: string;
    productname: string;
    capabilities: Object;
    config: Object;
    uniqueid: string;
    swversion: string;
    swconfigid: string;
    productid: string;
}

type TuyaDeviceResponse = {
    id: string; // same as gwId. Use as key to identify device to server
    name: string // Name of device
    ip: string;
    gwId: string;
    active: number;
    ability: number;
    encrypt: boolean;
    productKey: string;
    version: string;
}

type DevicesResponse = {
    hue: HueDeviceResponse[];
    tuya: TuyaDeviceResponse[];
}

interface HSVState {
    h: number;
    s: number;
    v: number;
}

const enum TuyaMode {
    WHITE = 'white',
    COLOR = 'colour',
    SCENE = 'scene',
    MUSIC = 'music',
}

const enum HueMode {
    HS = 'hs',
    XY = 'xy',
    CT = 'ct'
}

type Mode = TuyaMode | HueMode;


type LightState = {
    color: HSVState;
    white: number;
    toggle: boolean;
    mode: Mode;
    sceneBrightness?: number;
}

type DeviceType = HueDeviceResponse | TuyaDeviceResponse;

type CompletedStatus = {
    completed: boolean;
}

export type { HueDeviceState, HueDeviceResponse, TuyaDeviceResponse, DeviceType, DevicesResponse, LightState, Mode, CompletedStatus };