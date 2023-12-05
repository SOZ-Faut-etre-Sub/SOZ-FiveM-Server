import { Module } from '../../core/decorators/module';
import { WeaponGunsmithProvider } from './weapon.gunsmith.provider';
import { WeaponProvider } from './weapon.provider';

@Module({
    providers: [WeaponProvider, WeaponGunsmithProvider],
})
export class WeaponModule {}
