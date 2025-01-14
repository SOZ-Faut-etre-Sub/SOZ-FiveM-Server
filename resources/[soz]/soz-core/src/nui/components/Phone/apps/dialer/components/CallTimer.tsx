import { useInterval } from '@public/nui/hook/useInterval';
import { intervalToDuration } from 'date-fns';
import { useState } from 'react';

import { useCall } from '../../../system/sim-card/hooks/useCall';

export const CallTimer = () => {
    const { currentCall } = useCall();
    const [currentDate, setCurrentDate] = useState<Date>(new Date());

    useInterval(() => {
        setCurrentDate(new Date());
    }, 1000);

    const interval = intervalToDuration({
        start: currentCall.startedAt,
        end: currentDate,
    });

    return (
        <div className="flex flex-col justify-center items-center text-gray-300">
            {interval.hours > 0 && String(interval.hours).padStart(2, '0') + ':'}
            {String(interval.minutes ?? 0).padStart(2, '0')}:{String(interval.seconds ?? 0).padStart(2, '0')}
        </div>
    );
};
