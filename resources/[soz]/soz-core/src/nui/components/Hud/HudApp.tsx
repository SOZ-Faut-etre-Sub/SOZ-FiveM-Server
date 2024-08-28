import { FunctionComponent } from 'react';

import { DebugVoip } from './DebugVoip';
import { NewsBanner } from './NewsBanner';
import { Notifications } from './Notifications';
import { TwitchNewsOverlay } from './TwitchNewsOverlay';
import { VehicleInterface } from './VehicleInterface';
import { WatchInterface } from './WatchInterface';
import { WeaponAndVoipInterface } from './WeaponAndVoipInterface';
import { ZombieOverlay } from './ZombieIcon';

export const HudApp: FunctionComponent = () => {
    return (
        <main className="absolute h-full w-full overflow-hidden">
            <WatchInterface />
            <VehicleInterface />
            <WeaponAndVoipInterface />

            <Notifications />
            <NewsBanner />
            <TwitchNewsOverlay />

            <ZombieOverlay />
            <DebugVoip />
        </main>
    );
};
