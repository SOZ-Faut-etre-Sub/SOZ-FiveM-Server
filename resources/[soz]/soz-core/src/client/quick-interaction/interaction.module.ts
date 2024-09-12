import { Module } from '../../core/decorators/module';
import { InteractionProvider } from './interaction.provider';

@Module({
    providers: [InteractionProvider],
})
export class QuickInteractionModule {}
