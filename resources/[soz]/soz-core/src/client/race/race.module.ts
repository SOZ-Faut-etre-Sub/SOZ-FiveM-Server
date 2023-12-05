import { Module } from '../../core/decorators/module';
import { RaceProvider } from './race.provider';

@Module({
    providers: [RaceProvider],
})
export class RaceModule {}
