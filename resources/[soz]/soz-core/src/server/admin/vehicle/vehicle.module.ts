import { Module } from '../../../core/decorators/module';
import { VehicleProvider } from './vehicle.provider';
import {DatabaseModule} from "../../database/database.module";

@Module({
    imports: [DatabaseModule],
    providers: [VehicleProvider],
})
export class VehicleModule {}
