import { animated, useSpring } from '@react-spring/web';
import cn from 'classnames';
import { FunctionComponent, useState } from 'react';

import { useHud } from '../../../hook/data';
import { useNuiEvent } from '../../../hook/nui';
import PinIcon from '../../../icons/hud/pin.svg';
import { GlassMorphismContainer } from '../../Styleguide/GlassMorphismContainer';

export const Location: FunctionComponent = () => {
    const [hasWatch, setHasWatch] = useState(false);
    const { streetName, minimap } = useHud();

    const styles = useSpring({
        from: {
            bottom: '150vh',
        },
        to: {
            width: `${minimap.width * 100}vw`,
            top: `${(minimap.bottom + 0.015) * 100}vh`,
            left: `${(minimap.left + 0.005) * 100}vw`,
        },
    });

    useNuiEvent('hud', 'UpdateHasWatch', setHasWatch);

    if (!hasWatch) {
        return null;
    }

    return (
        <animated.div className="absolute flex text-white h-fit" style={styles}>
            <GlassMorphismContainer className="flex items-center gap-2 py-2 px-4 w-full">
                <PinIcon className="w-5 h-5" />

                <div className="flex flex-col justify-center h-8">
                    {streetName.map((name, index) => (
                        <p
                            key={index}
                            className={cn('truncate', {
                                'text-base leading-4': index === 0,
                                'text-xs leading-3': index !== 0,
                            })}
                        >
                            {name}
                        </p>
                    ))}
                </div>
            </GlassMorphismContainer>
        </animated.div>
    );
};
