import { Module } from '../../../core/decorators/module';
import { PoliceAnimationProvider } from './police.animation.provider';
import { PoliceCloakRoomProvider } from './police.cloakroom.provider';
import { PoliceFineProvider } from './police.fine.provider';
import { PoliceJobMenuProvider } from './police.jobMenu.provider';
import { PoliceLicenceProvider } from './police.licence.provider';
import { PoliceMoneyCheckerProvider } from './police.moneychecker.provider';
import { PolicePlayerProvider } from './police.player.provider';
import { PoliceProvider } from './police.provider';
import { PoliceSirenProvider } from './police.siren.provider';
import { PoliceSpikeProvider } from './police.spike.provider';
import { PoliceVehicleProvider } from './police.vehicle.provider';

@Module({
    providers: [
        PoliceProvider,
        PolicePlayerProvider,
        PoliceVehicleProvider,
        PoliceLicenceProvider,
        PoliceJobMenuProvider,
        PoliceFineProvider,
        PoliceCloakRoomProvider,
        PoliceMoneyCheckerProvider,
        PoliceSirenProvider,
        PoliceSpikeProvider,
        PoliceAnimationProvider,
    ],
})
export class PoliceModule {}
