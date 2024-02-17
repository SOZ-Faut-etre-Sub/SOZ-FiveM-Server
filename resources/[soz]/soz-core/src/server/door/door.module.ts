import { Module } from '../../core/decorators/module';
import { DoorProvider } from './door.provider';

@Module({
    providers: [DoorProvider],
})
export class DoorModule {}
