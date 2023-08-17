import { Module } from '../../core/decorators/module';
import { CayoMapProvider } from './cayo.map.provider';
@Module({
    providers: [CayoMapProvider],
})
export class WorldModule {}
