import { Module } from '../../core/decorators/module';
import { BlipFactory } from '../blip';
import { MeteorProvider } from './meteor.provider';
import { OceanProvider } from './ocean.provider';
@Module({
    providers: [BlipFactory, MeteorProvider, OceanProvider],
})
export class WorldModule {}
