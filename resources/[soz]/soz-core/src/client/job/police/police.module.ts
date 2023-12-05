import { Module } from '../../../core/decorators/module';
import { PoliceCloakRoomProvider } from './police.cloakroom.provider';
import { PoliceProvider } from './police.provider';
import { PoliceSirenProvider } from './police.siren.provider';

@Module({
    providers: [PoliceProvider, PoliceCloakRoomProvider, PoliceSirenProvider],
})
export class PoliceModule {}
