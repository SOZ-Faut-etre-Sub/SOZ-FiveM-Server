import { Module } from '../../../core/decorators/module';
import { PoliceLicenceProvider } from './police.licence.provider';
import { PoliceMoneyCheckerProvider } from './police.moneychecker.provider';
import { PolicePlayerProvider } from './police.player.provider';
import { PoliceProvider } from './police.provider';
import { PoliceSearchWarrantProvider } from './police.search_warrant.provider';
import { PoliceSirenProvider } from './police.siren.provider';
import { PoliceSpeedZoneProvider } from './police.speedzone.provider';
import { PoliceSpikeProvider } from './police.spike.provider';
import { PoliceVehicleProvider } from './police.vehicle.provider';
import { PoliceWantedProvider } from './police.wanted.provider';

@Module({
    providers: [
        PoliceProvider,
        PolicePlayerProvider,
        PoliceSpikeProvider,
        PoliceVehicleProvider,
        PoliceLicenceProvider,
        PoliceWantedProvider,
        PoliceSirenProvider,
        PoliceMoneyCheckerProvider,
        PoliceSpeedZoneProvider,
        PoliceSearchWarrantProvider,
    ],
})
export class PoliceModule {}
