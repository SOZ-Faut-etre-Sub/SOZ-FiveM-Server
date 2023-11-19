import { Module } from '../../../core/decorators/module';
import { StonkCloakRoomProvider } from './stonk.cloakroom.provider';
import { StonkDeliveryProvider } from './stonk.delivery.provider';
import { StonkProvider } from './stonk.provider';
import { StonkResellProvider } from './stonk.resell.provider';

@Module({
    providers: [StonkProvider, StonkResellProvider, StonkDeliveryProvider, StonkCloakRoomProvider],
})
export class StonkModule {}
