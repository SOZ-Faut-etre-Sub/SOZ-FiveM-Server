import { Module } from '../../../core/decorators/module';
import { UpwChargerProvider } from './upw.charger.provider';
import { UpwCloakroomProvider } from './upw.cloakroom.provider';
import { UpwMenuProvider } from './upw.menu.provider';
import { UpwOrderProvider } from './upw.order.provider';

@Module({
    providers: [UpwMenuProvider, UpwCloakroomProvider, UpwOrderProvider, UpwChargerProvider],
})
export class UpwModule {}
