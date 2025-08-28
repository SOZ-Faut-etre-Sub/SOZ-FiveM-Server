import { FunctionComponent, useState } from 'react';
import { useSelector } from 'react-redux';

import { useAssetPath } from '../../../hook/assets';
import { usePetStats } from '../../../hook/data';
import { useNuiEvent } from '../../../hook/nui';
import { RootState } from '../../../store';
import { useHudColor } from '../hooks/useHudColor';
import { useZoom } from '../hooks/useZoom';
import { StatusGauge } from './StatusGauge';

export const PetStats: FunctionComponent = () => {
    const [showStats, setShowStats] = useState<boolean>(true);

    const hasWatch = useSelector((state: RootState) => state.hud.hasWatch);
    const showAnimalStats = useSelector((state: RootState) => state.hud.settings.showAnimalStats);

    const petStats = usePetStats();
    const { gaugeColors } = useHudColor();
    const { iconSize } = useZoom();
    const { getPath } = useAssetPath();

    useNuiEvent('hud', 'SetShowStats', setShowStats);

    if (!petStats || !hasWatch || !showAnimalStats || !showStats) return null;

    return (
        <>
            <StatusGauge
                value={petStats.hunger}
                color={gaugeColors.orange_light}
                backgroundColor={gaugeColors.orange_dark}
                hideCondition={value => value >= 50}
            >
                <img
                    style={{
                        width: iconSize,
                        height: iconSize,
                    }}
                    src={getPath('images/hud/pet/hunger.webp')}
                    alt="hunger"
                />
            </StatusGauge>
            <StatusGauge
                value={petStats.thirst}
                color={gaugeColors.blue_light}
                backgroundColor={gaugeColors.blue_dark}
                hideCondition={value => value >= 50}
            >
                <img
                    style={{
                        width: iconSize,
                        height: iconSize,
                    }}
                    src={getPath('images/hud/pet/thirst.webp')}
                    alt="thirst"
                />
            </StatusGauge>
            <StatusGauge
                value={petStats.energy}
                color={gaugeColors.blue_light}
                backgroundColor={gaugeColors.blue_dark}
                hideCondition={value => value > petStats.maxEnergy / 2}
                max={petStats.maxEnergy}
            >
                <img
                    style={{
                        width: iconSize,
                        height: iconSize,
                    }}
                    src={getPath('images/hud/pet/stamina.webp')}
                    alt="battery"
                />
            </StatusGauge>
        </>
    );
};
