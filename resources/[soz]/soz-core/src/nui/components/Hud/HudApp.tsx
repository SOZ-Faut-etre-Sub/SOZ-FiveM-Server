import classNames from 'classnames';
import { FunctionComponent, useState } from 'react';

import { useNuiEvent } from '../../hook/nui';
import { Minimap } from './Minimap';
import { NewsBanner } from './NewsBanner';
import { Notifications } from './Notifications';
import { PlayerNeeds } from './PlayerNeeds';
import { SpeedoMeter } from './SpeedoMeter';
import { TwitchNewsOverlay } from './TwitchNewsOverlay';
import { VoiceIndicator } from './VoiceIndicator';

export const HudApp: FunctionComponent = () => {
    const [showHud, setShowHud] = useState(true);

    useNuiEvent('hud', 'SetShowHud', setShowHud);

    const classes = classNames('absolute h-full w-full transition-opacity duration-500', {
        'opacity-0': !showHud,
        'opacity-100': showHud,
    });

    return (
        <main className={classes}>
            <Notifications />
            <NewsBanner />
            <Minimap />
            <VoiceIndicator />
            <PlayerNeeds />
            <SpeedoMeter />
            <TwitchNewsOverlay />
        </main>
    );
};
