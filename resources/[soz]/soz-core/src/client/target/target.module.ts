import { Module } from '../../core/decorators/module';
import { TargetFactoryProvider } from './target.factory.provider';
import { TargetProvider } from './target.provider';

@Module({
    providers: [TargetProvider, TargetFactoryProvider],
})
export class TargetModule {}
