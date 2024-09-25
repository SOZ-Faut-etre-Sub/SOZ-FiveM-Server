import { Module } from '../../core/decorators/module';
import { InteractionOffsetProvider } from './interaction.offset.provider';
import { InteractionProvider } from './interaction.provider';

@Module({
    providers: [InteractionProvider, InteractionOffsetProvider],
})
export class QuickInteractionModule {}
