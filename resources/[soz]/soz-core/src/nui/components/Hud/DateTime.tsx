import { animated, useSpring } from '@react-spring/web';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale/fr';
import { FunctionComponent } from 'react';

import { useHud } from '../../hook/data';

export const DateTime: FunctionComponent = () => {
    const { hasWatch, dateTime, minimap } = useHud();

    const styles = useSpring({
        from: {
            bottom: '-100vh',
        },
        to: {
            width: `${minimap.width * 100}vw`,
            bottom: `${100 - minimap.top * 100}vh`,
            left: `${(minimap.left + 0.005) * 100}vw`,
        },
    });

    if (!hasWatch) {
        return null;
    }

    return (
        <animated.div className="absolute flex text-white " style={styles}>
            <div className="flex flex-col">
                <span className="text-2xl leading-4 font-light capitalize">
                    {format(dateTime.dayOfWeek, 'ccc', { locale: fr }).replace('.', '')}
                </span>
                <span className="text-5xl">
                    {dateTime.hour <= 9 && '0'}
                    {dateTime.hour}:{dateTime.minute <= 9 && '0'}
                    {dateTime.minute}
                </span>
            </div>
        </animated.div>
    );
};
