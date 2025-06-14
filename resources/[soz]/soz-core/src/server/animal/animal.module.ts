import { Module } from '../../core/decorators/module';
import { AnimalProvider } from './animal.provider';
import { AnimalShopProvider } from './animal.shop.provider';

@Module({
    providers: [AnimalProvider, AnimalShopProvider],
})
export class AnimalModule {}
