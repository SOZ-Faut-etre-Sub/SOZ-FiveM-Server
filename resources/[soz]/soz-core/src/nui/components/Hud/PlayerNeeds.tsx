import { FunctionComponent, useState } from 'react';

import { usePlayer } from '../../hook/data';
import { useNuiEvent } from '../../hook/nui';
import AlcoholIcon from '../../icons/hud/alcohol.svg';
import DrugIcon from '../../icons/hud/drug.svg';
import HungerIcon from '../../icons/hud/hunger.svg';
import SyringeIcon from '../../icons/hud/syringe.svg';
import ThirstIcon from '../../icons/hud/thirst.svg';
import { StatusBar } from './StatusBar';

type SyringeDelay = {
    delay: number;
    interval: NodeJS.Timeout;
    initialDelay: number;
};

export const PlayerNeeds: FunctionComponent = () => {
    const player = usePlayer();
    const [syringeDelay, setSyringeDelay] = useState<SyringeDelay>(null);

    useNuiEvent('hud', 'SetSyringeDelay', delay => {
        setSyringeDelay(previousDelay => {
            if (previousDelay) {
                clearInterval(previousDelay.interval);
            }

            const interval = setInterval(() => {
                setSyringeDelay(previousDelay => {
                    if (!previousDelay) {
                        return;
                    }

                    if (previousDelay.delay <= 0) {
                        clearInterval(previousDelay.interval);
                        return null;
                    }

                    return {
                        delay: previousDelay.delay - 100,
                        interval: previousDelay.interval,
                        initialDelay: previousDelay.initialDelay,
                    };
                });
            }, 100);

            return {
                delay,
                interval,
                initialDelay: delay,
            };
        });
    });

    if (!player) {
        return null;
    }

    return (
        <div className="absolute w-[12vw] bottom-[2.2rem] right-[0.8vw]">
            <StatusBar
                percent={syringeDelay ? (syringeDelay.delay / syringeDelay.initialDelay) * 100 : 0}
                backgroundPrimary="rgba(150, 8, 183, 0.6)"
                backgroundSecondary="linear-gradient(to top, rgba(150, 8, 183, 0.8) 31%, rgba(184, 12, 223, 0.8) 100%)"
            >
                <SyringeIcon className="text-white w-3 h-3" />
            </StatusBar>
            <StatusBar
                percent={player.metadata.drug}
                backgroundPrimary="rgba(79, 228, 30, 0.4)"
                backgroundSecondary="linear-gradient(to top, rgba(37, 228, 30, 0.6) 31%, rgba(97, 243, 91, 0.6) 100%)"
            >
                <DrugIcon className="text-white w-3 h-3" />
            </StatusBar>
            <StatusBar
                percent={player.metadata.alcohol}
                backgroundPrimary="rgba(228, 30, 53, 0.4)"
                backgroundSecondary="linear-gradient(to top, rgba(228, 30, 47, 0.6) 31%, rgba(241, 78, 92, 0.6) 100%)"
            >
                <AlcoholIcon className="text-white w-3 h-3" />
            </StatusBar>
            <StatusBar
                percent={player.metadata.hunger}
                hideCondition={value => value >= 50}
                backgroundPrimary="rgba(251, 140, 0, 0.4)"
                backgroundSecondary="linear-gradient(to top, rgba(251, 140, 0, 0.6) 31%, rgba(255, 168, 55, 0.6) 100%)"
            >
                <HungerIcon className="text-white w-3 h-3" />
            </StatusBar>
            <StatusBar
                percent={player.metadata.thirst}
                hideCondition={value => value >= 50}
                backgroundPrimary="rgba(30, 135, 228, 0.4)"
                backgroundSecondary="linear-gradient(to top, rgba(30, 135, 228, 0.6) 31%, rgba(94, 165, 239, 0.6) 100%)"
            >
                <ThirstIcon className="text-white w-3 h-3" />
            </StatusBar>
        </div>
    );
};
