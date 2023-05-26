import { Module } from '../../core/decorators/module';
import { BinocularsProvider } from './binoculars.provider';

@Module({
    providers: [BinocularsProvider],
})
export class BinocularsModule {}
