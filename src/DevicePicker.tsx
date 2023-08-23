import React, {useState, useEffect, useRef} from 'react';
import {DevicesResponse, DeviceType} from './Types';
import { CircularProgress } from '@mui/material';
import Device from './Device';

interface Props {
    setControlledDevices: (deviceIds: Set<string>) => void;
}

interface State {
    devices: DeviceType[] | undefined,
}

export default function DevicePicker(props: Props) {
    const [state, setState] = useState<State>({
        devices: undefined,
    });
    const controlledDeviceIds = useRef(new Set<string>());

    useEffect(() => {
        if (state.devices === undefined) {
            console.log(`fetch('http://localhost:3001/devices')`);
            fetch('http://localhost:3001/devices')
                .then((resp: Response) => resp.json())
                .then((devices: DevicesResponse) => {
                    const hueDevices: DeviceType[] = devices.hue;
                    const tuyaDevices: DeviceType[] = devices.tuya;
                    setState({...state, devices: hueDevices.concat(tuyaDevices)});
                });
        }
    }, [state]);

    function setDeviceControlled(deviceId: string, isControlled: boolean) {
        if (isControlled) {
            controlledDeviceIds.current.add(deviceId);
        } else {
            controlledDeviceIds.current.delete(deviceId);
        }
        props.setControlledDevices(controlledDeviceIds.current);
    }

    if (state.devices === undefined) {
        return (
            <div className="device-tray">
                <CircularProgress />
            </div>
        );
    }

    const devicesInTray = state.devices?.map((device: DeviceType, i: number) =>
        <Device key={i}
                deviceId={device.id}
                deviceName={device.name}
                setControlled={(deviceId, isControlled) => setDeviceControlled(deviceId, isControlled)}
        />);


    return (
        <div className="device-tray">
            { devicesInTray }
        </div>
    );
}