import { Provider } from '@public/core/decorators/provider';

@Provider()
export class DroneProvider {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public removeDrone(_drone: number) {}
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public getDroneType(_drone: number): string | null {
        return null;
    }
}
