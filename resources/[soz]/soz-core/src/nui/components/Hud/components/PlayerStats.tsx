import { FunctionComponent, useState } from 'react';
import { useSelector } from 'react-redux';

import { usePlayer } from '../../../hook/data';
import { useNuiEvent } from '../../../hook/nui';
import { RootState } from '../../../store';
import { StatusGauge } from './StatusGauge';

type SyringeDelay = {
    delay: number;
    interval: NodeJS.Timeout;
    initialDelay: number;
};

export const PlayerStats: FunctionComponent = () => {
    const [syringeDelay, setSyringeDelay] = useState<SyringeDelay>(null);
    const [battery, setBattery] = useState<number>(100);

    const hasWatch = useSelector((state: RootState) => state.hud.hasWatch);
    const showStress = useSelector((state: RootState) => state.hud.settings.showStress);
    const showStamina = useSelector((state: RootState) => state.hud.settings.showStamina);

    const player = usePlayer();

    const health = useSelector((state: RootState) => state.playerStats.health);
    const armor = useSelector((state: RootState) => state.playerStats.armor);
    const stamina = useSelector((state: RootState) => state.playerStats.stamina);

    useNuiEvent('hud', 'SetBattery', setBattery);
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

    const healthPercent = player.metadata.isdead ? 0 : ((health - 100) * 100) / (player.metadata.max_health - 100);

    return (
        <>
            <StatusGauge
                value={healthPercent}
                color={healthPercent > 20 ? '#329121' : '#92212B'}
                hideCondition={value => value > 80}
            >
                <img className="size-9" src="/public/images/hud/player/health.webp" alt="" />
            </StatusGauge>

            <StatusGauge value={armor} color="#00A5E7">
                <img className="size-9" src="/public/images/hud/player/armor.webp" alt="armor" />
            </StatusGauge>

            {hasWatch && (
                <StatusGauge
                    value={syringeDelay ? (syringeDelay.delay / syringeDelay.initialDelay) * 100 : 0}
                    color="#00A5E7"
                >
                    <img className="size-9" src="/public/images/hud/player/syringe.webp" alt="syringe" />
                </StatusGauge>
            )}

            {hasWatch && (
                <StatusGauge value={player.metadata.drug} color="#00A5E7">
                    <img className="size-9" src="/public/images/hud/player/drug.webp" alt="drug" />
                </StatusGauge>
            )}

            {hasWatch && (
                <StatusGauge value={player.metadata.alcohol} color="#00A5E7">
                    <img className="size-9" src="/public/images/hud/player/alcohol.webp" alt="alcohol" />
                </StatusGauge>
            )}

            <StatusGauge value={player.metadata.hunger} color="#FCAF40" hideCondition={value => value >= 50}>
                <img className="size-9" src="/public/images/hud/player/hunger.webp" alt="hunger" />
            </StatusGauge>

            <StatusGauge value={player.metadata.thirst} color="#00A5E7" hideCondition={value => value >= 50}>
                <img className="size-9" src="/public/images/hud/player/thirst.webp" alt="thirst" />
            </StatusGauge>

            {hasWatch && showStress && (
                <StatusGauge value={player.metadata.stress_level} color="#FCAF40">
                    <img className="size-9" src="/public/images/hud/player/stress.webp" alt="stress" />
                </StatusGauge>
            )}

            {hasWatch && showStamina && (
                <StatusGauge
                    value={stamina}
                    color={stamina <= 25 ? '#FCAF40' : '#3270cd'}
                    hideCondition={value => value >= 80}
                >
                    <img className="size-9" src="/public/images/hud/player/stamina.webp" alt="stamina" />
                </StatusGauge>
            )}

            <StatusGauge value={battery} color="#fc9914" hideCondition={value => value > 99}>
                <img className="size-9" src="/public/images/hud/vehicle/battery.webp" alt="battery" />
            </StatusGauge>
        </>
    );
};
