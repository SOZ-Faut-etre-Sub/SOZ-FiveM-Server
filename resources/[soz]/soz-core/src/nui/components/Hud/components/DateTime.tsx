import { format } from 'date-fns';
import { fr } from 'date-fns/locale/fr';
import { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '../../../store';

export const DateTime: FunctionComponent = () => {
    const hasWatch = useSelector((state: RootState) => state.hud.hasWatch);
    const showDateTime = useSelector((state: RootState) => state.hud.settings.showDateTime);
    const { dayOfWeek, hour, minute } = useSelector((state: RootState) => state.hud.dateTime);

    if (!hasWatch || !showDateTime) {
        return null;
    }

    return (
        <div className="flex flex-col">
            <span className="text-2xl leading-4 font-light capitalize">
                {format(dayOfWeek, 'ccc', { locale: fr }).replace('.', '')}
            </span>
            <span className="text-2.5xl">
                {hour <= 9 && '0'}
                {hour}:{minute <= 9 && '0'}
                {minute}
            </span>
        </div>
    );
};
