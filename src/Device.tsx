import React, { useState } from 'react';
import './Device.css';

interface Props {
    deviceId: string;
    deviceName: string;
    setControlled: (deviceId: string, isControlled: boolean) => void;
}

interface State {
    isControlled: boolean;
}

export default function Device(props: Props) {
    const [state, setState] = useState<State>({
        isControlled: false,
    });

    function setControlled(isControlled: boolean) {
        setState({ ...state, isControlled });
        props.setControlled(props.deviceId, isControlled);
    }

    const backgroundColor = (state.isControlled) ? {backgroundColor: 'purple'} : {};

    return (
        <div className="device"
             onClick={() => setControlled(!state.isControlled)}
             style={backgroundColor}>
            <p>{props.deviceName}</p>
        </div>
    );
}

