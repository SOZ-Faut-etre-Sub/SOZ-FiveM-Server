import { Module } from '../../core/decorators/module';
import { MapPickerProvider } from './map.picker.provider';

@Module({
    providers: [MapPickerProvider],
})
export class PickerModule {}
