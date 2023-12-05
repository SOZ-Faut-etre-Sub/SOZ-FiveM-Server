import { Module } from '../../core/decorators/module';
import { CraftProvider } from './craft.provider';

@Module({
    providers: [CraftProvider],
})
export class CraftModule {}
