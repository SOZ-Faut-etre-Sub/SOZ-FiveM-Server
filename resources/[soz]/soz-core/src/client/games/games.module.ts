import { Module } from '../../core/decorators/module';
import { GamesProvider } from './games.provider';
import { LaserGameProvider } from './laser/laser.game.provider';

@Module({
    providers: [LaserGameProvider, GamesProvider],
})
export class GamesModule {}
