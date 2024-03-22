import { Provider } from '@core/decorators/provider';

@Provider()
export class VehicleBusinessProvider {
    public canCustom(): boolean {
        return false;
    }

    public canPerformance(): boolean {
        return false;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public testCrimiGarage(entity: number, notif: boolean): boolean {
        return false;
    }
}
