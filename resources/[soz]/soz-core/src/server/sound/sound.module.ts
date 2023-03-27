import { Module } from '../../core/decorators/module';
import { SoundProvider } from './sound.provider';

@Module({
    providers: [SoundProvider],
})
export class SoundModule {}
