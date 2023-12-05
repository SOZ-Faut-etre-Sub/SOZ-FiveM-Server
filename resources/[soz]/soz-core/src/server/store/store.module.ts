import { Module } from '../../core/decorators/module';
import { StateGlobalProvider } from './state.global.provider';

@Module({
    providers: [StateGlobalProvider],
})
export class StoreModule {}
