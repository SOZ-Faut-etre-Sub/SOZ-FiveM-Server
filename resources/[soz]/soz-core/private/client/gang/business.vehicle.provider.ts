import { Provider } from '@core/decorators/provider';

@Provider()
export class VehicleBusinessProvider {
    public canCustom(): boolean {
        return false;
    }

    public canPerformance(): boolean {
        return false;
    }
}
