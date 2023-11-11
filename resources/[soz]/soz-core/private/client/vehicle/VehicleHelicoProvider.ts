import { Provider } from '@public/core/decorators/provider';

@Provider()
export class VehicleHelicoProvider {
    public isHelicam() {
        return false;
    }
}
