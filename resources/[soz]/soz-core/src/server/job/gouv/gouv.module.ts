import { Module } from '../../../core/decorators/module';
import { GouvCraftProvider } from './gouv.craft.provider';
import { GouvFineProvider } from './gouv.fine.provider';
import { GouvProvider } from './gouv.provider';
import { GouvRadarProvider } from './gouv.radar.provider';

@Module({
    providers: [GouvFineProvider, GouvProvider, GouvRadarProvider, GouvCraftProvider],
})
export class GouvModule {}
