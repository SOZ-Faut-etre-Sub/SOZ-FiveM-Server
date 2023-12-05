import { Module } from '../../core/decorators/module';
import { PedFactory } from './ped.factory';

@Module({
    providers: [PedFactory],
})
export class FactoryModule {}
