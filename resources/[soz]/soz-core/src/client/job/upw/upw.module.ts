import { Module } from '../../../core/decorators/module';
import { UpwCloakroomProvider } from './upw.cloakroom.provider';
import { UpwMenuProvider } from './upw.menu.provider';

@Module({
    providers: [UpwMenuProvider, UpwCloakroomProvider],
})
export class UpwModule {}
