import { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '../../../store';
import { weekToString } from '../hooks/weekToString';

export const DateTime: FunctionComponent = () => {
    const hasWatch = useSelector((state: RootState) => state.hud.hasWatch);
    const settings = useSelector((state: RootState) => state.hud.settings);
    const { dayOfWeek, hour, minute } = useSelector((state: RootState) => state.hud.dateTime);

    if (!hasWatch || !settings.showDateTime) {
        return null;
    }

    return (
        <div className="flex flex-col drop-shadow-bg" style={{ zoom: settings.zoom }}>
            <span className="text-2xl leading-4 font-light capitalize">{weekToString(dayOfWeek)}</span>
            <span className="text-2.5xl">
                {hour <= 9 && '0'}
                {hour}:{minute <= 9 && '0'}
                {minute}
            </span>
        </div>
    );
};
