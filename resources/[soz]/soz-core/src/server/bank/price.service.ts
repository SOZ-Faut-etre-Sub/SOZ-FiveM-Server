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

    /**
     * Reduces the given price based on the specified tax type and calculates the tax amount.
     *
     * @param {number} price - The original price before tax deduction.
     * @param {TaxType} [taxType] - The type of tax to be used for the calculation. Optional parameter.
     * @return {Promise<[number, number]>} A Promise that resolves to a tuple:
     * - The first element is the reduced price after tax deduction.
     * - The second element is the calculated tax amount.
     */
    public async cutPrice(price: number, taxType?: TaxType): Promise<[number, number]> {
        if (!taxType) {
            return [price, 0];
        }

        const tax = await this.taxRepository.getTaxValue(taxType);
        const taxValue = tax / 100;

        return [Math.round(price - price * taxValue), Math.round(price * taxValue)];
    }
}
