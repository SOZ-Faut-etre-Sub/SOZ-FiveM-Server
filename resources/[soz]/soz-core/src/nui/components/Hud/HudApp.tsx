import { FunctionComponent } from 'react';

import { Minimap } from './Minimap';
import { NewsBanner } from './NewsBanner';
import { Notifications } from './Notifications';
import { PlayerNeeds } from './PlayerNeeds';
import { SpeedoMeter } from './SpeedoMeter';
import { TwitchNewsOverlay } from './TwitchNewsOverlay';
import { VoiceIndicator } from './VoiceIndicator';
import { ZombieOverlay } from './ZombieIcon';

export const HudApp: FunctionComponent = () => {
    return (
        <main className="absolute h-full w-full">
            <Notifications />
            <NewsBanner />
            <Minimap />
            <VoiceIndicator />
            <PlayerNeeds />
            <SpeedoMeter />
            <TwitchNewsOverlay />
            <ZombieOverlay />
        </main>
    );
};
