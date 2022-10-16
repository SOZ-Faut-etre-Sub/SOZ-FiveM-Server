import { Provider } from '../../core/decorators/provider';

@Provider()
export class VehicleLockProvider {
    public unlock() {}

    public lock() {}
}
