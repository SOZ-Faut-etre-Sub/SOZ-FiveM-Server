import { getDurationDeltateStr, getDurationStr, SplitInfo } from '@public/shared/race';
import cn from 'classnames';
import { FunctionComponent, useEffect, useState } from 'react';

import { useNuiEvent } from '../../hook/nui';

export const RaceApp: FunctionComponent = () => {
    const [splits, SetSplits] = useState<SplitInfo[] | null>(null);

    useNuiEvent('race', 'SetSplits', data => {
        SetSplits(data);
    });

    if (!splits) {
        return null;
    }

    let currentCp = splits.findIndex(split => split.current);
    if (currentCp == -1) {
        currentCp = splits.length;
    }
    let firstDisplay = currentCp - 3;
    let lastDisplay = currentCp + 4;
    if (currentCp < 3) {
        firstDisplay = 0;
        lastDisplay = 7;
    } else if (splits.length - currentCp <= 4) {
        firstDisplay = splits.length - 8;
        lastDisplay = splits.length - 1;
    }

    return (
        <>
            <CountDown />
            <div className="font-prompt font-medium text-white absolute left-[1%] top-20">
                <div className="m-2 p-2">
                    <span className="align-top text-7xl" style={{ lineHeight: 0.9 }}>
                        {Math.min(currentCp + 1, splits.length)}/{splits.length}
                    </span>
                    <span className="align-top p-2">CHECKPOINT</span>
                </div>
                {splits.map((time, index) => {
                    if (index > lastDisplay || index < firstDisplay) {
                        return null;
                    }
                    const cp = index + 1 >= splits.length ? 'Fin' : 'CP' + (index + 1);
                    return <Split split={time} checkpoint={cp} />;
                })}
                <Timer />
            </div>
        </>
    );
};

const Timer: FunctionComponent = () => {
    const [currentDuration, setCurrentDuration] = useState(0);
    const [startTime, setStartTime] = useState<number>(0);
    const [endTime, setEndTime] = useState<number>(0);

    useEffect(() => {
        const timer = setInterval(() => {
            const duration = !startTime ? 0 : (endTime || Date.now()) - startTime;

            setCurrentDuration(duration);
        }, 20);

        return () => {
            clearInterval(timer);
        };
    }, [currentDuration, startTime, endTime]);

    useNuiEvent('race', 'setStart', data => {
        setStartTime(data);
    });
    useNuiEvent('race', 'setEnd', data => {
        setEndTime(data);
    });

    return (
        <div className="text-6xl w-80 font-lato font-bold bg-opacity-60 bg-race-notcurrent italic rounded-md w-60 m-2 p-2 text-right">
            {getDurationStr(currentDuration)}
        </div>
    );
};

type SplitProps = {
    split: SplitInfo;
    checkpoint: string;
};

const Split: FunctionComponent<SplitProps> = ({ split, checkpoint }) => {
    return (
        <div
            className={cn('flex text-xl justify-center bg-opacity-60 italic rounded-md w-60 m-2 p-2', {
                'bg-race-notcurrent': !split.current,
                'bg-race-current': split.current,
            })}
            key={checkpoint}
        >
            <span className="flex-auto w-8">{checkpoint}</span>
            <span
                className={cn('flex-auto w-32 font-lato font-bold text-right text-xs', split.deltaColor)}
                style={{ lineHeight: '1.75rem' }}
            >
                {split.deltaColor ? getDurationDeltateStr(split.delta) : ''}
            </span>
            <span className="flex-auto w-32 font-lato font-bold text-right">{getDurationStr(split.time)}</span>
        </div>
    );
};

const CountDown: FunctionComponent = () => {
    const [countDown, setCountDown] = useState<string | null>(null);

    useNuiEvent('race', 'setCountDown', data => {
        setCountDown(data);
    });

    if (!countDown) {
        return;
    }

    return (
        <div className="font-prompt font-medium text-white top-48 italic absolute inset-1/2 text-6xl animate-display-persist opacity-100">
            {countDown}
        </div>
    );
};
