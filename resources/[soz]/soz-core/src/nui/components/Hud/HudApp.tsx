import { FunctionComponent } from 'react';

import { DamageOverlay } from './DamageOverlay';
import { DebugVoip } from './DebugVoip';
import { InstructionalOverlay } from './InstructionalOverlay';
import { NewsBanner } from './NewsBanner';
import { Notifications } from './Notifications';
import { PetManagement } from './PetManagement';
import { TwitchNewsOverlay } from './TwitchNewsOverlay';
import { VehicleInterface } from './VehicleInterface';
import { WatchInterface } from './WatchInterface';
import { WeaponInterface } from './WeaponInterface';
import { WeatherOverlay } from './WeatherIcon';
import { ZombieOverlay } from './ZombieIcon';

export const HudApp: FunctionComponent = () => {
    return (
        <main className="absolute inset-0 h-full w-full overflow-hidden">
            <WatchInterface />
            <VehicleInterface />
            <WeaponInterface />

            <InstructionalOverlay />
            <DamageOverlay />

            <Notifications />
            <NewsBanner />
            <TwitchNewsOverlay />
            <PetManagement />

            <ZombieOverlay />
            <WeatherOverlay />
            <DebugVoip />
        </main>
    );
};
