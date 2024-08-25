import { FunctionComponent } from 'react';

import { DateTime } from './DateTime';
import { DebugVoip } from './DebugVoip';
import { Location } from './Location';
import { Minimap } from './Minimap';
import { NewsBanner } from './NewsBanner';
import { Notifications } from './Notifications';
import { PlayerNeeds } from './PlayerNeeds';
import { SpeedoMeter } from './SpeedoMeter';
import { TwitchNewsOverlay } from './TwitchNewsOverlay';
import { VoiceIndicator } from './VoiceIndicator';
import { WeatherIcon } from './WeatherIcon';
import { ZombieOverlay } from './ZombieIcon';

export const HudApp: FunctionComponent = () => {
    return (
        <main className="absolute h-full w-full">
            <DateTime />
            <Minimap />
            <Location />
            <PlayerNeeds />
            <Notifications />
            <NewsBanner />
            <VoiceIndicator />
            <SpeedoMeter />
            <TwitchNewsOverlay />
            <ZombieOverlay />
            <WeatherIcon />
            <DebugVoip />
        </main>
    );
};
