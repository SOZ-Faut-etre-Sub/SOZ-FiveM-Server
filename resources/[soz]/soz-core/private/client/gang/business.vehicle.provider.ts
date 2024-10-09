/* eslint-disable @typescript-eslint/no-unused-vars */
import { Provider } from '@core/decorators/provider';

@Provider()
export class VehicleBusinessProvider {
    public canCustom(): boolean {
        return false;
    }

    public canPerformance(): boolean {
        return false;
    }

    public testCrimiGarage(entity: number, notif: boolean): boolean {
        return false;
    }

    public async mapping(entity: number, admin: boolean) {}
}
