import { Module } from '../../core/decorators/module';
import { VoipService } from './voip.service';

@Module({
    providers: [VoipService],
})
export class VoipModule {}
