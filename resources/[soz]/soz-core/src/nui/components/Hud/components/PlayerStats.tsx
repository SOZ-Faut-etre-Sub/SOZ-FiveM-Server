import { FunctionComponent, useState } from 'react';
import { useSelector } from 'react-redux';

import { usePlayer } from '../../../hook/data';
import { useNuiEvent } from '../../../hook/nui';
import { RootState } from '../../../store';
import { useDaltonism } from '../hooks/useDaltonism';
import { useZoom } from '../hooks/useZoom';
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
    const { gaugeColors } = useDaltonism();
    const { iconSize } = useZoom();

    const health = useSelector((state: RootState) => state.playerStats.health);
    const armor = useSelector((state: RootState) => state.playerStats.armor);
    const plates = useSelector((state: RootState) => state.playerStats.armorPlates);
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
                color={healthPercent > 20 ? gaugeColors.green_light : gaugeColors.red_light}
                backgroundColor={healthPercent > 20 ? gaugeColors.green_dark : gaugeColors.red_dark}
                hideCondition={value => value > 80}
            >
                <img
                    style={{
                        width: iconSize,
                        height: iconSize,
                    }}
                    src="https://soz.zerator.com/static/game/images/hud/player/health.webp"
                    alt=""
                />
            </StatusGauge>

            <StatusGauge
                value={armor}
                color={gaugeColors.blue_light}
                backgroundColor={gaugeColors.blue_dark}
                secondaryValue={plates}
            >
                <img
                    style={{
                        width: iconSize,
                        height: iconSize,
                    }}
                    src="https://soz.zerator.com/static/game/images/hud/player/armor.webp"
                    alt="armor"
                />
            </StatusGauge>

            {hasWatch && (
                <StatusGauge
                    value={syringeDelay ? (syringeDelay.delay / syringeDelay.initialDelay) * 100 : 0}
                    color={gaugeColors.green_light}
                    backgroundColor={gaugeColors.green_dark}
                >
                    <img
                        style={{
                            width: iconSize,
                            height: iconSize,
                        }}
                        src="https://soz.zerator.com/static/game/images/hud/player/syringe.webp"
                        alt="syringe"
                    />
                </StatusGauge>
            )}

            {hasWatch && (
                <StatusGauge
                    value={player.metadata.drug}
                    color={gaugeColors.green_light}
                    backgroundColor={gaugeColors.green_dark}
                >
                    <img
                        style={{
                            width: iconSize,
                            height: iconSize,
                        }}
                        src="https://soz.zerator.com/static/game/images/hud/player/drug.webp"
                        alt="drug"
                    />
                </StatusGauge>
            )}

            {hasWatch && (
                <StatusGauge
                    value={player.metadata.alcohol}
                    color={gaugeColors.red_light}
                    backgroundColor={gaugeColors.red_dark}
                >
                    <img
                        style={{
                            width: iconSize,
                            height: iconSize,
                        }}
                        src="https://soz.zerator.com/static/game/images/hud/player/alcohol.webp"
                        alt="alcohol"
                    />
                </StatusGauge>
            )}

            <StatusGauge
                value={player.metadata.hunger}
                color={gaugeColors.orange_light}
                backgroundColor={gaugeColors.orange_dark}
                hideCondition={value => value >= 50}
            >
                <img
                    style={{
                        width: iconSize,
                        height: iconSize,
                    }}
                    src="https://soz.zerator.com/static/game/images/hud/player/hunger.webp"
                    alt="hunger"
                />
            </StatusGauge>

            <StatusGauge
                value={player.metadata.thirst}
                color={gaugeColors.blue_light}
                backgroundColor={gaugeColors.blue_dark}
                hideCondition={value => value >= 50}
            >
                <img
                    style={{
                        width: iconSize,
                        height: iconSize,
                    }}
                    src="https://soz.zerator.com/static/game/images/hud/player/thirst.webp"
                    alt="thirst"
                />
            </StatusGauge>

            {hasWatch && showStress && (
                <StatusGauge
                    value={player.metadata.stress_level}
                    color={gaugeColors.red_light}
                    backgroundColor={gaugeColors.red_dark}
                >
                    <img
                        style={{
                            width: iconSize,
                            height: iconSize,
                        }}
                        src="https://soz.zerator.com/static/game/images/hud/player/stress.webp"
                        alt="stress"
                    />
                </StatusGauge>
            )}

            {hasWatch && showStamina && (
                <StatusGauge
                    value={stamina}
                    color={stamina <= 25 ? gaugeColors.orange_light : gaugeColors.blue_light}
                    backgroundColor={stamina <= 25 ? gaugeColors.orange_dark : gaugeColors.blue_dark}
                    hideCondition={value => value >= 80}
                >
                    <img
                        style={{
                            width: iconSize,
                            height: iconSize,
                        }}
                        src="https://soz.zerator.com/static/game/images/hud/player/stamina.webp"
                        alt="stamina"
                    />
                </StatusGauge>
            )}

            <StatusGauge
                value={battery}
                color={gaugeColors.blue_light}
                backgroundColor={gaugeColors.blue_dark}
                hideCondition={value => value > 99}
            >
                <img
                    style={{
                        width: iconSize,
                        height: iconSize,
                    }}
                    src="https://soz.zerator.com/static/game/images/hud/vehicle/battery.webp"
                    alt="battery"
                />
            </StatusGauge>
        </>
    );
};
