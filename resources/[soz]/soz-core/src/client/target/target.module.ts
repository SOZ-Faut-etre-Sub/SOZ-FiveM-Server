import { Module } from '../../core/decorators/module';
import { TargetProvider } from './target.provider';

@Module({
    providers: [TargetProvider],
})
export class TargetModule {}
