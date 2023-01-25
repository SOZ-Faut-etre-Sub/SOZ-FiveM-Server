import { Module } from '../../../core/decorators/module';
import { UpwCloakroomProvider } from './upw.cloakroom.provider';
import { UpwMenuProvider } from './upw.menu.provider';
import { UpwOrderProvider } from './upw.order.provider';

@Module({
    providers: [UpwMenuProvider, UpwCloakroomProvider, UpwOrderProvider],
})
export class UpwModule {}
