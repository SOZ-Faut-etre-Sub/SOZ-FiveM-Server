import { Module } from '../../core/decorators/module';
import { MeteorProvider } from './meteor.provider';
@Module({
    providers: [MeteorProvider],
})
export class WorldModule {}
