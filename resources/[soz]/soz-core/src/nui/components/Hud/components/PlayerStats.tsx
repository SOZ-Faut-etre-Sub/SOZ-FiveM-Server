import { FunctionComponent, useState } from 'react';
import { useSelector } from 'react-redux';

import { useAssetPath } from '../../../hook/assets';
import { usePlayer } from '../../../hook/data';
import { useNuiEvent } from '../../../hook/nui';
import { RootState } from '../../../store';
import { useHudColor } from '../hooks/useHudColor';
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
    const [showStats, setShowStats] = useState<boolean>(true);

    const whatIf2Enabled = useSelector((state: RootState) => state.features.WhatIfSecondEpisode);

    const hasWatch = useSelector((state: RootState) => state.hud.hasWatch);
    const showStress = useSelector((state: RootState) => state.hud.settings.showStress);
    const showStamina = useSelector((state: RootState) => state.hud.settings.showStamina);

    const player = usePlayer();
    const { gaugeColors } = useHudColor();
    const { iconSize } = useZoom();
    const { getPath } = useAssetPath();

    const health = useSelector((state: RootState) => state.playerStats.health);
    const armor = useSelector((state: RootState) => state.playerStats.armor);
    const plates = useSelector((state: RootState) => state.playerStats.armorPlates);
    const stamina = useSelector((state: RootState) => state.playerStats.stamina);

    useNuiEvent('hud', 'SetShowStats', setShowStats);
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
            {showStats && (
                <StatusGauge
                    value={healthPercent}
                    color={healthPercent > 20 ? gaugeColors.green_light : gaugeColors.red_light}
                    backgroundColor={healthPercent > 20 ? gaugeColors.green_dark : gaugeColors.red_dark}
                    hideCondition={value => value > (whatIf2Enabled ? 50 : 80)}
                >
                    <img
                        style={{
                            width: iconSize,
                            height: iconSize,
                        }}
                        src={getPath('images/hud/player/health.webp')}
                        alt=""
                    />
                </StatusGauge>
            )}

            {showStats && (
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
                        src={getPath('images/hud/player/armor.webp')}
                        alt="armor"
                    />
                </StatusGauge>
            )}

            {hasWatch && showStats && (
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
                        src={getPath('images/hud/player/syringe.webp')}
                        alt="syringe"
                    />
                </StatusGauge>
            )}

            {hasWatch && showStats && (
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
                        src={getPath('images/hud/player/drug.webp')}
                        alt="drug"
                    />
                </StatusGauge>
            )}

            {hasWatch && showStats && (
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
                        src={getPath('images/hud/player/alcohol.webp')}
                        alt="alcohol"
                    />
                </StatusGauge>
            )}

            {showStats && (
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
                        src={getPath('images/hud/player/hunger.webp')}
                        alt="hunger"
                    />
                </StatusGauge>
            )}

            {showStats && (
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
                        src={getPath('images/hud/player/thirst.webp')}
                        alt="thirst"
                    />
                </StatusGauge>
            )}

            {whatIf2Enabled || (hasWatch && showStress && showStats) ? (
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
                        src={getPath('images/hud/player/stress.webp')}
                        alt="stress"
                    />
                </StatusGauge>
            ) : null}

            {whatIf2Enabled ? (
                <StatusGauge
                    value={player.metadata.hazmat_protection}
                    color={gaugeColors.blue_light}
                    backgroundColor={gaugeColors.blue_dark}
                    hideCondition={() => !player.metadata.hazmat}
                >
                    <img
                        style={{
                            width: iconSize,
                            height: iconSize,
                        }}
                        src={getPath('images/hud/player/nuke.webp')}
                        alt="hazmat"
                    />
                </StatusGauge>
            ) : null}

            {whatIf2Enabled || (hasWatch && showStamina && showStats) ? (
                <StatusGauge
                    value={stamina}
                    max={whatIf2Enabled ? 50 : 100}
                    color={stamina <= 25 ? gaugeColors.orange_light : gaugeColors.blue_light}
                    backgroundColor={stamina <= 25 ? gaugeColors.orange_dark : gaugeColors.blue_dark}
                    hideCondition={value => value >= (whatIf2Enabled ? 25 : 80)}
                >
                    <img
                        style={{
                            width: iconSize,
                            height: iconSize,
                        }}
                        src={getPath('images/hud/player/stamina.webp')}
                        alt="stamina"
                    />
                </StatusGauge>
            ) : null}

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
                    src={getPath('images/hud/vehicle/battery.webp')}
                    alt="battery"
                />
            </StatusGauge>
        </>
    );
};
