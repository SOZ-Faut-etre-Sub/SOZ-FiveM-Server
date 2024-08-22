import { animated, useSpring } from '@react-spring/web';
import { FunctionComponent, useCallback, useState } from 'react';

import { useHud, usePlayer, usePlayerStats, useVehicle } from '../../../hook/data';
import { useNuiEvent } from '../../../hook/nui';
import { StatusGauge } from './StatusGauge';

type SyringeDelay = {
    delay: number;
    interval: NodeJS.Timeout;
    initialDelay: number;
};

export const PlayerNeeds: FunctionComponent = () => {
    const [hasWatch, setHasWatch] = useState(false);
    const [syringeDelay, setSyringeDelay] = useState<SyringeDelay>(null);

    const { minimap } = useHud();
    const player = usePlayer();
    const playerStats = usePlayerStats();
    const vehicle = useVehicle();

    const styles = useSpring({
        from: {
            top: '150vh',
        },
        to: {
            top: `${(minimap.bottom + 0.015) * 100}vh`,
            left: `${((hasWatch ? minimap.right : minimap.left) + 0.015) * 100}vw`,
        },
    });

    useNuiEvent('hud', 'UpdateHasWatch', setHasWatch);

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

    const hideArmorCondition = useCallback(value => {
        return value < 1;
    }, []);
    const hideHealthCondition = useCallback(
        value => {
            if (vehicle.seat !== null) {
                return false;
            }

            return value > 75;
        },
        [vehicle.seat]
    );

    if (!player) {
        return null;
    }

    const armorPercent = playerStats[1];
    const healthPercent = player.metadata.isdead
        ? 0
        : ((playerStats[0] - 100) * 100) / (player.metadata.max_health - 100);

    return (
        <animated.div className="absolute " style={styles}>
            <div className="flex gap-4 relative">
                <StatusGauge
                    percent={healthPercent}
                    gaugeColor={healthPercent > 20 ? '#329121' : '#92212B'}
                    gaugeBackgroundColor={healthPercent > 20 ? '#283525' : '#362628'}
                    hideCondition={hideHealthCondition}
                >
                    <img className="w-7 h-7" src="/public/images/hud/health.webp" alt="" />
                </StatusGauge>

                <StatusGauge
                    percent={armorPercent}
                    gaugeColor="#00A5E7"
                    gaugeBackgroundColor="#263136"
                    hideCondition={hideArmorCondition}
                >
                    <img className="w-7 h-7" src="/public/images/hud/armor.webp" alt="" />
                </StatusGauge>

                {hasWatch && (
                    <StatusGauge
                        percent={syringeDelay ? (syringeDelay.delay / syringeDelay.initialDelay) * 100 : 0}
                        gaugeColor="#00A5E7"
                        gaugeBackgroundColor="#263136"
                    >
                        <img className="w-7 h-7" src="/public/images/hud/syringe.webp" alt="" />
                    </StatusGauge>
                )}

                {hasWatch && (
                    <StatusGauge percent={player.metadata.drug} gaugeColor="#00A5E7" gaugeBackgroundColor="#263136">
                        <img className="w-7 h-7" src="/public/images/hud/drug.webp" alt="" />
                    </StatusGauge>
                )}

                {hasWatch && (
                    <StatusGauge percent={player.metadata.alcohol} gaugeColor="#00A5E7" gaugeBackgroundColor="#263136">
                        <img className="w-7 h-7" src="/public/images/hud/alcohol.webp" alt="" />
                    </StatusGauge>
                )}

                {hasWatch && (
                    <StatusGauge
                        percent={player.metadata.stress_level}
                        gaugeColor="#FCAF40"
                        gaugeBackgroundColor="#362F26"
                        hideCondition={value => value >= 50}
                    >
                        <img className="w-7 h-7" src="/public/images/hud/stress.webp" alt="hunger" />
                    </StatusGauge>
                )}

                <StatusGauge
                    percent={player.metadata.hunger}
                    gaugeColor="#FCAF40"
                    gaugeBackgroundColor="#362F26"
                    hideCondition={value => value >= 50}
                >
                    <img className="w-7 h-7" src="/public/images/hud/hunger.webp" alt="hunger" />
                </StatusGauge>

                <StatusGauge
                    percent={player.metadata.thirst}
                    gaugeColor="#00A5E7"
                    gaugeBackgroundColor="#263136"
                    hideCondition={value => value >= 50}
                >
                    <img className="w-7 h-7" src="/public/images/hud/thirst.webp" alt="thirst" />
                </StatusGauge>
            </div>
        </animated.div>
    );
};
