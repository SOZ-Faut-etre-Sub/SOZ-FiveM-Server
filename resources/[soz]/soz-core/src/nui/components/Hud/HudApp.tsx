import { FunctionComponent } from 'react';

import { DateTime } from './components/DateTime';
import { Location } from './components/Location';
import { Minimap } from './components/Minimap';
import { PlayerNeeds } from './components/PlayerNeeds';
import { DebugVoip } from './DebugVoip';
import { NewsBanner } from './NewsBanner';
import { Notifications } from './Notifications';
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
