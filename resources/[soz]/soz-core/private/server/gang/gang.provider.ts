/* eslint-disable @typescript-eslint/no-unused-vars */
import { Provider } from '@core/decorators/provider';
import { MainBusiness, UniversalBusiness } from '@private/shared/businesses';
import { GangType } from '@private/shared/gang';

@Provider()
export class GangProvider {
    public async getGangRecipes(source: number) {
        return {};
    }

    public async gangApiPlayer(citizenId: string, gangId: number, boss: boolean) {}

    public async createAPIGang(
        name: string,
        type: GangType,
        business1: MainBusiness,
        business2: MainBusiness,
        universalBusiness: UniversalBusiness
    ): Promise<[number, string]> {
        return null;
    }

    public async updateAPIGang(
        id: number,
        name: string,
        type: GangType,
        business1: MainBusiness,
        business2: MainBusiness,
        universalBusiness: UniversalBusiness
    ): Promise<[boolean, string]> {
        return null;
    }
}
