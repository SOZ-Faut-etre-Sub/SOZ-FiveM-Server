import React, { useState } from 'react';

import useInterval from '../../../hooks/useInterval';
import { useCall } from '../hooks/useCall';

const getTimeFromSeconds = (secs: number) => {
    const totalSeconds = Math.ceil(secs);
    const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    return {
        seconds,
        minutes,
        hours,
    };
};
const formatTime = (time: number) => (time < 10 ? `0${time}` : time);

export const CallTimer = () => {
    const { call } = useCall();
    const [time, setTime] = useState({ seconds: 0, minutes: 0, hours: 0 });

    useInterval(() => {
        if (!call.startedAt || call.startedAt === 0) return;

        setTime(getTimeFromSeconds(new Date().getTime() / 1000 - call.startedAt));
    }, 1000);

    return (
        <div className="flex flex-col justify-center items-center text-gray-300">
            <div className="font-light">{`${formatTime(time.hours)}:${formatTime(time.minutes)}:${formatTime(
                time.seconds
            )}`}</div>
        </div>
    );
};
