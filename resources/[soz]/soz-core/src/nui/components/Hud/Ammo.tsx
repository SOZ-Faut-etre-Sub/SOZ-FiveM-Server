import { animated, useSpring } from '@react-spring/web';
import { FunctionComponent } from 'react';

import { useHud } from '../../hook/data';

export const Ammo: FunctionComponent = () => {
    const { ammo, minimap } = useHud();

    const styles = useSpring({
        from: {
            top: '150vh',
        },
        to: {
            top: ammo.hasWeapon ? `${(minimap.bottom + 0.015) * 100}vh` : '150vh',
            right: `${(minimap.left + 0.005) * 100}vw`,
        },
    });

    return (
        <animated.div className="absolute flex gap-1 items-center justify-center text-white h-11 w-fit" style={styles}>
            <div className="flex flex-col justify-center items-center tabular-nums">
                <span className="text-2xl leading-5 h-5">{ammo?.ammo}</span>
                <span className="text-base leading-4 text-gray-500 font-light h-5">{ammo?.maxAmmo}</span>
            </div>
            <img className="size-8 mb-1" src="/public/images/hud/ammo.webp" alt="ammo" />
        </animated.div>
    );
};
