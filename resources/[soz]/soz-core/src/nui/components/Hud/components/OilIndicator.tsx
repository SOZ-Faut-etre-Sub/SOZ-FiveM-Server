import cn from 'classnames';
import { FunctionComponent } from 'react';

import { useDaltonism } from '../hooks/useDaltonism';

export const OilIndicator: FunctionComponent<{ oil: number }> = ({ oil }) => {
    const { imagePrefix } = useDaltonism();

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
            src={`/public/images/hud/vehicle/${imagePrefix}oil-${oilStatus}.webp`}
            alt="oil"
        />
    );
};
