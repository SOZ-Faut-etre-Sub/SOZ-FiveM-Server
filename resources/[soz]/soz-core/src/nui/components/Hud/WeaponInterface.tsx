import { animated, useSpring } from '@react-spring/web';
import { FunctionComponent } from 'react';

import { useAmmo, useMinimap } from '../../hook/data';

export const WeaponInterface: FunctionComponent = () => {
    const minimap = useMinimap();
    const ammo = useAmmo();

    const [ammoStyles] = useSpring(
        () => ({
            from: {
                top: '150vh',
            },
            to: {
                top: ammo.hasWeapon ? `${(minimap.bottom + 0.005) * 100}vh` : '150vh',
                right: `${(minimap.left + 0.005) * 100}vw`,
            },
        }),
        [ammo, minimap]
    );

    return (
        <animated.div
            className="absolute flex gap-1 items-center justify-center text-white w-fit drop-shadow-bg -z-10"
            style={ammoStyles}
        >
            <div className="flex flex-col justify-center items-center tabular-nums h-11">
                <span className="text-3xl leading-7">{ammo?.ammo}</span>
                <span className="text-xl leading-5 text-white/80 font-light">{ammo?.maxAmmo}</span>
            </div>
            <img className="size-12 mb-1" src="/public/images/hud/ammo.webp" alt="ammo" />
        </animated.div>
    );
};
