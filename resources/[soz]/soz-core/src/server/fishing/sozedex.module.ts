import { Module } from '../../core/decorators/module';
import { SozedexProvider } from './sozedex.provider';

@Module({
    providers: [SozedexProvider],
})
export class SozedexModule {}
