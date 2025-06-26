import { Injectable } from '@public/core/decorators/injectable';

@Injectable()
export class CasinoVipService {
    hasVipSubscription(): boolean {
        return this.hasVipStandard() || this.hasVipPremium();
    }

    hasVipStandard(): boolean {
        return false;
    }

    hasVipPremium(): boolean {
        return false;
    }
}
