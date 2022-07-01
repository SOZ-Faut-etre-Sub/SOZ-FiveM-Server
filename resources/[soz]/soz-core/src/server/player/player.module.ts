import { Module } from '../../core/decorators/module';
import { PlayerProvider } from './player.provider';

@Module({
    providers: [PlayerProvider],
})
export class PlayerModule {}
