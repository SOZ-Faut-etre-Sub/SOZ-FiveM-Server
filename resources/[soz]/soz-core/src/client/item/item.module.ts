import { Module } from '../../core/decorators/module';
import { ItemProvider } from './item.provider';

@Module({
    providers: [ItemProvider],
})
export class ItemModule {}
