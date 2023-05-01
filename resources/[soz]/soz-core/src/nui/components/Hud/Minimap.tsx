import { FunctionComponent } from 'react';

import { useHud, usePlayer } from '../../hook/data';
import IconArmor from '../../icons/hud/armor.svg';
import IconHealth from '../../icons/hud/health.svg';
import { StatusBar } from './StatusBar';

export const Minimap: FunctionComponent = () => {
    const { minimap } = useHud();
    const player = usePlayer();

    if (!player) {
        return null;
    }

    const healthPercent = ((player.metadata.health - 100) * 100) / (player.metadata.max_health - 100);
    const armorPercent = player.metadata.armor.current;

    return (
        <div
            className="absolute flex py-1 justify-between"
            style={{
                height: `calc(100vh - (100vh * ${minimap.bottom}))`,
                width: `calc(100vw * ${minimap.width})`,
                top: `calc((100vh * ${minimap.bottom}) - .5rem )`,
                left: `calc(100vw * ${minimap.left})`,
            }}
        >
            <div className="h-5 w-full">
                <StatusBar
                    percent={healthPercent}
                    backgroundPrimary="rgba(60,152,30,0.5)"
                    backgroundSecondary="linear-gradient(to top, rgba(71,190,32,0.6) 31%, rgba(79,228,30,0.6) 100%)"
                >
                    <IconHealth className="text-white w-3 h-3" />
                </StatusBar>
            </div>
            <div className="h-5 w-full ml-2">
                <StatusBar
                    percent={armorPercent}
                    backgroundPrimary="rgba(19,90,128,0.5)"
                    backgroundSecondary="linear-gradient(to top, rgba(19,120,187,0.6) 31%, rgba(23,147,218,0.6) 100%)"
                >
                    <IconArmor className="text-white w-3 h-3" />
                </StatusBar>
            </div>
        </div>
    );
};
