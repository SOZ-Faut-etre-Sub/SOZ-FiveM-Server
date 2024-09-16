import { animated, useSpring } from '@react-spring/web';
import cn from 'classnames';
import { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '../../store';
import { GlassMorphismBox } from '../Styleguide/GlassMorphismContainer';
import { Compass } from './components/Compass';
import { DateTime } from './components/DateTime';
import { Location } from './components/Location';
import { PlayerStats } from './components/PlayerStats';
import { Weather } from './components/Weather';

export const WatchInterface: FunctionComponent = () => {
    const minimap = useSelector((state: RootState) => state.hud.minimap);

    const headerStyles = useSpring({
        from: {
            bottom: '-100vh',
        },
        to: {
            width: `${minimap.width * 100}vw`,
            bottom: `${100 - (minimap.top + 0.005) * 100}vh`,
            left: `${(minimap.left + 0.005) * 100}vw`,
        },
    });

    const footerStyles = useSpring({
        from: {
            bottom: '150vh',
        },
        to: {
            top: `${(minimap.bottom + 0.005) * 100}vh`,
            left: `${(minimap.left + 0.005) * 100}vw`,
        },
    });

    return (
        <>
            <animated.div
                className={cn('absolute flex justify-between items-end text-white -z-10', {
                    'px-5': minimap.isHidden,
                })}
                style={headerStyles}
            >
                <DateTime />
                <Weather />
            </animated.div>

            {!minimap.isHidden && (
                <GlassMorphismBox
                    className="rounded-lg"
                    style={{
                        top: `${(minimap.top + 0.0105) * 100}vh`,
                        height: `${(minimap.height - 0.015) * 100}vh`,
                        left: `${(minimap.left + 0.0045) * 100}vw`,
                        width: `${minimap.width * 100}vw`,
                    }}
                />
            )}

            <animated.div className="absolute flex gap-3 text-white h-fit" style={footerStyles}>
                <Location />
                <Compass />
                <PlayerStats />
            </animated.div>
        </>
    );
};
