import { Module } from '../../core/decorators/module';
import { MeteorProvider } from './meteor.provider';
import { OceanProvider } from './ocean.provider';
@Module({
    providers: [MeteorProvider, OceanProvider],
})
export class WorldModule {}
