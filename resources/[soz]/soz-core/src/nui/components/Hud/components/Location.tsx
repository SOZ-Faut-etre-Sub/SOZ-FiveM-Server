import { animated, useSpring } from '@react-spring/web';
import cn from 'classnames';
import { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';

import { useHudHasStreetNames } from '../../../hook/data';
import PinIcon from '../../../icons/hud/pin.svg';
import { RootState } from '../../../store';
import { GlassMorphismContainer } from '../../Styleguide/GlassMorphismContainer';
import { useZoom } from '../hooks/useZoom';

export const Location: FunctionComponent = () => {
    const settings = useSelector((state: RootState) => state.hud.settings);
    const streetName = useSelector((state: RootState) => state.hud.streetName);
    const minimap = useSelector((state: RootState) => state.hud.minimap);

    const { height, smallIconSize } = useZoom();
    const hasStreetNamesEnabled = useHudHasStreetNames();

    const styles = useSpring({
        from: {
            opacity: 0,
            width: `0vw`,
        },
        to: {
            height,
            opacity: hasStreetNamesEnabled ? 1 : 0,
            width:
                (settings.switchPlayerStatsPosition && !hasStreetNamesEnabled) ||
                (!hasStreetNamesEnabled && !settings.showWeather && !settings.showDateTime && minimap.isHidden)
                    ? `0vw`
                    : `${minimap.width * 100}vw`,
        },
    });

    return (
        <animated.div style={styles}>
            <GlassMorphismContainer
                borderClassName="rounded-full"
                className="flex items-center gap-2 px-5 w-full"
                style={{ height }}
                rounded={Number(height.replace('px', '')) / 2}
                disableGameClone={!hasStreetNamesEnabled}
            >
                <PinIcon className="shrink" style={{ width: smallIconSize, height: smallIconSize }} />

                <div className="flex flex-col justify-center -space-y-2.5" style={{ height, zoom: settings.zoom }}>
                    {streetName.map((name, index) => (
                        <span
                            key={index}
                            className={cn('truncate', {
                                'text-xl': index === 0,
                                'text-base font-light': index !== 0,
                            })}
                        >
                            {name}
                        </span>
                    ))}
                </div>
            </GlassMorphismContainer>
        </animated.div>
    );
};
