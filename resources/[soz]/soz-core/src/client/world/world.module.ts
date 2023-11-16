import { Module } from '../../core/decorators/module';
import { BlipFactory } from '../blip';
import { CayoMapProvider } from './cayo.map.provider';
@Module({
    providers: [CayoMapProvider, BlipFactory],
})
export class WorldModule {}
