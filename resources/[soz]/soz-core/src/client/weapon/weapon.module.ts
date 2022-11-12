import { Module } from '../../core/decorators/module';
import { WeaponDrawingProvider } from './weapon.drawing.provider';
import { WeaponProvider } from './weapon.provider';

@Module({
    providers: [WeaponProvider, WeaponDrawingProvider],
})
export class WeaponModule {}
