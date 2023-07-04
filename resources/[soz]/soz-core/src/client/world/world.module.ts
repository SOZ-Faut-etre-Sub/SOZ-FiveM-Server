import { Module } from '../../core/decorators/module';
import { CayoMapProvider } from './cayo.map.provider';
import { ObjectFactory } from './object.factory';

@Module({
    providers: [ObjectFactory, CayoMapProvider],
})
export class WorldModule {}
