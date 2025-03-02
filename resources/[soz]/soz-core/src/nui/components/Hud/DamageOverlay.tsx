import { useAssetPath } from '@public/nui/hook/assets';
import { animated, useSpring } from '@react-spring/web';
import { useState } from 'react';
import { useSelector } from 'react-redux';

import { PlayerPedHash } from '../../../shared/player';
import { useMinimap, usePlayer } from '../../hook/data';
import { useNuiEvent } from '../../hook/nui';
import { RootState } from '../../store';

export function DamageOverlay() {
    const hasWatch = useSelector((state: RootState) => state.hud.hasWatch);
    const showInjuryTracker = useSelector((state: RootState) => state.hud.settings.showInjuryTracker);
    const zoomInjuryTracker = useSelector((state: RootState) => state.hud.settings.zoomInjuryTracker);
    const minimap = useMinimap();
    const player = usePlayer();
    const { getPath } = useAssetPath();

    const [bones, setBones] = useState<string[]>([]);

    const shouldDisplay = hasWatch && showInjuryTracker && bones.length > 0;
    const playerType = player?.skin?.Model?.Hash === PlayerPedHash.Male ? 'male' : 'female';

    const styles = useSpring({
        from: {
            opacity: 0,
        },
        to: {
            opacity: 1,
            top: shouldDisplay ? '0vh' : '-50vh',
            left: `${minimap.left * 100}vw`,
        },
    });

    useNuiEvent('hud', 'SetDamagedBones', setBones);

    return (
        <animated.div className="absolute top-0 left-0 flex justify-center" style={styles}>
            <div className="relative h-[30vh]" style={{ zoom: zoomInjuryTracker }}>
                <img
                    alt="skel"
                    src={getPath(`images/hud/player/damages/${playerType}/skel.webp`)}
                    className="h-full top-0 inset-0 opacity-70"
                />

                {bones?.map(bone => (
                    <img
                        key={bone}
                        alt={bone}
                        src={getPath(`images/hud/player/damages/${playerType}/${bone}.webp`)}
                        className="absolute h-full top-0 inset-0 opacity-80"
                    />
                ))}
            </div>
        </animated.div>
    );
}
