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
}
