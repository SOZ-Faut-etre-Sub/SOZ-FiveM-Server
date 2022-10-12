import { Inject, Injectable } from '../../core/decorators/injectable';
import { Qbcore } from '../qbcore';

@Injectable()
export class VehicleService {
    @Inject(Qbcore)
    private QBCore: Qbcore;

    public getVehicleProperties(vehicle: number): any[] {
        return this.QBCore.getVehicleProperties(vehicle);
    }
}
