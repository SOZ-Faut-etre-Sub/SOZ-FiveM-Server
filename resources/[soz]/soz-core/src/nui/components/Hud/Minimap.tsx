import { FunctionComponent, useCallback } from 'react';

import { useHud, usePlayer, usePlayerHealth, useVehicle } from '../../hook/data';
import IconArmor from '../../icons/hud/armor.svg';
import IconHealth from '../../icons/hud/health.svg';
import { StatusBar } from './StatusBar';

export const Minimap: FunctionComponent = () => {
    const { minimap } = useHud();
    const player = usePlayer();
    let playerHealth = usePlayerHealth();
    const vehicle = useVehicle();

    const hideHealthCondition = useCallback(
        value => {
            if (vehicle.seat !== null) {
                return false;
            }

            return value > 60;
        },
        [vehicle.seat]
    );

    const hideArmorCondition = useCallback(
        value => {
            return vehicle.seat === null || value < 1;
        },
        [vehicle.seat]
    );

    if (!player) {
        return null;
    }

    if (player.metadata.isdead) {
        playerHealth = 0;
    }

    const healthPercent = ((playerHealth - 100) * 100) / (player.metadata.max_health - 100);
    const armorPercent = player.metadata.armor.current;

    // console.log(JSON.stringify(minimap, null, 4));
    const top = (minimap.bottom - 0.003) * 100;
    const height = 100 - top;
    const left = (minimap.left + 0.004) * 100;
    const width = minimap.width * 100;

    return (
        <div
            className="absolute flex flex-col justify-around"
            style={{
                height: `${height}vh`,
                width: `${width}vw`,
                top: `${top}vh`,
                left: `${left}vw`,
            }}
        >
            <div className="flex w-full justify-around mt-[-0.6rem]">
                <div className="h-5 max-h-[100%] w-[50%] pr-1">
                    <StatusBar
                        hideCondition={hideHealthCondition}
                        percent={healthPercent}
                        backgroundPrimary="rgba(60,152,30,0.5)"
                        backgroundSecondary="linear-gradient(to top, rgba(71,190,32,0.6) 31%, rgba(79,228,30,0.6) 100%)"
                    >
                        <IconHealth className="text-white h-full" />
                    </StatusBar>
                </div>
                <div className="h-5 max-h-[100%] w-[50%] pl-1">
                    <StatusBar
                        percent={armorPercent}
                        hideCondition={hideArmorCondition}
                        backgroundPrimary="rgba(19,90,128,0.5)"
                        backgroundSecondary="linear-gradient(to top, rgba(19,120,187,0.6) 31%, rgba(23,147,218,0.6) 100%)"
                    >
                        <IconArmor className="text-white h-full" />
                    </StatusBar>
                </div>
            </div>
        </div>
    );
};
