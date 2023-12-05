import { Module } from '../../core/decorators/module';
import { AfkProvider } from './afk.provider';

@Module({
    providers: [AfkProvider],
})
export class AfkModule {}
