import { Provider } from '@public/core/decorators/provider';

@Provider()
export class PoliceSwatProvider {
    public async disableShield() {}
    public isUsingShield(): boolean {
        return false;
    }
}
