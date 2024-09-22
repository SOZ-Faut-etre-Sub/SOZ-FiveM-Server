/* eslint-disable @typescript-eslint/no-unused-vars */
import { Gang } from '@private/shared/gang';
import { Injectable } from '@public/core/decorators/injectable';

@Injectable()
export class GangService {
    public async getMaxParkingPlace(garareId: string) {
        return 0;
    }

    public async getMaxSafeSize(gang: Gang) {
        return 0;
    }
}
