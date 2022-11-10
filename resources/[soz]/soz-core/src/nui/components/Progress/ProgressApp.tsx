import { FunctionComponent, useEffect, useState } from 'react';

import { Progress } from '../../../shared/nui/progress';
import { useNuiEvent } from '../../hook/nui';

export const ProgressApp: FunctionComponent = () => {
    const [progress, setProgress] = useState<Progress | null>(null);
    const [currentProgress, setCurrentProgress] = useState(0);

    useNuiEvent('progress', 'Start', data => {
        setCurrentProgress(0);
        setProgress(data);
    });

    useNuiEvent('progress', 'Stop', () => {
        setProgress(null);
        setCurrentProgress(0);
    });

    useEffect(() => {
        if (!progress) {
            return () => {};
        }

        const end = Date.now() + progress.duration;
        const timer = setInterval(() => {
            if (Date.now() > end) {
                setProgress(null);
                return;
            }

            const diff = end - Date.now();
            const completedPercentage = 1 - diff / progress.duration;

            setCurrentProgress(completedPercentage);
        }, 20);

        return () => {
            clearInterval(timer);
        };
    }, [progress]);

    if (!progress) {
        return null;
    }

    return (
        <div className="fixed flex bottom-14 text-center left-0 right-0 text-lime-500 text-xl mx-auto items-center">
            <div className="flex bg-black/50 p-2 rounded items-center mx-auto">
                <div>{progress.label}</div>
                {progress.units.map((unit, index) => (
                    <div key={index} className="ml-4 font-mono w-16">
                        {((unit.end - unit.start) * currentProgress + unit.start).toFixed(2)}
                        {unit.unit}
                    </div>
                ))}
            </div>
        </div>
    );
};
