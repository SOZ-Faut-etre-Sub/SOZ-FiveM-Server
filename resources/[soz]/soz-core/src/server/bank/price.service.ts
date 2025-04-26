import { Inject, Injectable } from '@core/decorators/injectable';
import { TaxType } from '@public/shared/tax';

import { TaxRepository } from '../repository/tax.repository';

@Injectable()
export class PriceService {
    @Inject(TaxRepository)
    private taxRepository: TaxRepository;

    public async getPrice(price: number, taxType?: TaxType) {
        if (!taxType) {
            return price;
        }

        const tax = await this.taxRepository.getTaxValue(taxType);
        const taxValue = tax / 100;

        return Math.round(price + price * taxValue);
    }

    public async getGain(bet: number, win: number, taxType?: TaxType) {
        if (!taxType) {
            return win;
        }

        const tax = await this.taxRepository.getTaxValue(taxType);
        const taxValue = tax / 100;

        const gain = win - bet;
        if (gain <= 0) {
            return win;
        }

        return Math.round(win - gain * taxValue);
    }
}
