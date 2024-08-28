import { animated, useSpring } from '@react-spring/web';
import cn from 'classnames';
import { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';

import PinIcon from '../../../icons/hud/pin.svg';
import { RootState } from '../../../store';
import { GlassMorphismContainer } from '../../Styleguide/GlassMorphismContainer';

export const Location: FunctionComponent = () => {
    const hasWatch = useSelector((state: RootState) => state.hud.hasWatch);
    const settings = useSelector((state: RootState) => state.hud.settings);
    const streetName = useSelector((state: RootState) => state.hud.streetName);
    const minimap = useSelector((state: RootState) => state.hud.minimap);

    const styles = useSpring({
        from: {
            width: '0vw',
        },
        to: {
            width: `${minimap.width * 100}vw`,
        },
    });

    if (!hasWatch || !settings.showStreetName) {
        return null;
    }

    return (
        <animated.div className="h-12" style={styles}>
            <GlassMorphismContainer className="flex items-center gap-2 px-5 h-12 w-full">
                <PinIcon className="w-5 h-5" />

                <div className="flex flex-col justify-center -space-y-2.5 h-12">
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
