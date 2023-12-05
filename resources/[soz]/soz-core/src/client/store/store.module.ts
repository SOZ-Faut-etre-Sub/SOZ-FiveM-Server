import { Module } from '../../core/decorators/module';
import { StateGlobalProvider } from './state.global.provider';
import { StateGridProvider } from './state.grid.provider';

@Module({
    providers: [StateGlobalProvider, StateGridProvider],
})
export class StoreModule {}
