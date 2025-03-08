import { Module } from '../../core/decorators/module';
import { LaserGameProvider } from './laser/laser.game.provider';

@Module({
    providers: [LaserGameProvider],
})
export class GamesModule {}
