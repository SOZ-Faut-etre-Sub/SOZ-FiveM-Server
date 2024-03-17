import { Provider } from '@core/decorators/provider';

@Provider()
export class GangProvider {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async getGangRecipes(source: number) {
        return {};
    }
}
