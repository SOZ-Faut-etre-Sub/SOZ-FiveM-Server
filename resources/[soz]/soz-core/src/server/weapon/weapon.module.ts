import { Module } from '../../core/decorators/module';
import { WeaponProvider } from './weapon.provider';

@Module({
    providers: [WeaponProvider],
})
export class WeaponModule {}
