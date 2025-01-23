import { animated, useSpring } from '@react-spring/web';
import cn from 'classnames';
import { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';

import { useAmmo, useHudHasStreetNames, useMinimap } from '../../hook/data';
import { RootState } from '../../store';

export const WeaponInterface: FunctionComponent = () => {
    const minimap = useMinimap();
    const hasStreetNamesEnabled = useHudHasStreetNames();
    const switchPlayerStatsPosition = useSelector((state: RootState) => state.hud.settings.switchPlayerStatsPosition);
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
            className={cn('absolute flex gap-1 items-center justify-center text-white w-fit drop-shadow-bg', {
                '-mt-14':
                    (!switchPlayerStatsPosition && !hasStreetNamesEnabled) ||
                    (switchPlayerStatsPosition && hasStreetNamesEnabled),
                '-mt-28': switchPlayerStatsPosition && !hasStreetNamesEnabled,
            })}
            style={ammoStyles}
        >
            <div className="flex flex-col justify-center items-center tabular-nums h-11">
                <span className="text-3xl leading-7">{ammo?.ammo}</span>
                <span className="text-xl leading-5 text-white/80 font-light">{ammo?.maxAmmo}</span>
            </div>
            <img className="size-12 mb-1" src="https://soz.zerator.com/static/game/images/hud/ammo.webp" alt="ammo" />
        </animated.div>
    );
};
