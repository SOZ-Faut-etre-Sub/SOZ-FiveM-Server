import { Module } from '../../core/decorators/module';
import { ObjectFactory } from './object.factory';

@Module({
    providers: [ObjectFactory],
})
export class WorldModule {}
