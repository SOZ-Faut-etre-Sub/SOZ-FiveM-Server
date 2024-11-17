import cn from 'classnames';
import { FunctionComponent } from 'react';

import { useHudColor } from '../hooks/useHudColor';

export const OilIndicator: FunctionComponent<{ oil: number; fuelType: string }> = ({ oil, fuelType }) => {
    const { imagePrefix } = useHudColor();

    let oilStatus = 'yellow';

    if (oil <= 10 && oil > 5) {
        oilStatus = 'yellow';
    } else if (oil <= 5 && oil > 3) {
        oilStatus = 'orange';
    } else if (oil <= 3) {
        oilStatus = 'red';
    }

    return (
        <img
            className={cn('size-8 transition-all duration-1000', {
                'opacity-5': oil > 10,
                'opacity-100': oil <= 10,
            })}
            src={`https://soz.zerator.com/static/game/images/hud/vehicle/${imagePrefix}${fuelType === 'essence' ? 'oil' : 'battery'}-${oilStatus}.webp`}
            alt="oil"
        />
    );
};
