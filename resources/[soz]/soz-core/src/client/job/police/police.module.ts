import { Module } from '../../../core/decorators/module';
import { PoliceCloakRoomProvider } from './police.cloakroom.provider';
import { PoliceProvider } from './police.provider';

@Module({
    providers: [PoliceProvider, PoliceCloakRoomProvider],
})
export class PoliceModule {}
