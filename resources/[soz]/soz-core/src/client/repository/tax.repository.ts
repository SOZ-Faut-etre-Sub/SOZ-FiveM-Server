import { DEFAULT_TAX_PERCENTAGE, TaxType } from '@public/shared/tax';

import { Injectable } from '../../core/decorators/injectable';
import { RepositoryType } from '../../shared/repository';
import { Repository } from './repository';

@Injectable(TaxRepository, Repository)
export class TaxRepository extends Repository<RepositoryType.Tax> {
    public type = RepositoryType.Tax;

    public getTaxValue(taxType: TaxType): number {
        const tax = this.find(taxType);

        if (!tax) {
            return DEFAULT_TAX_PERCENTAGE;
        }

        return tax.value;
    }

    public getPriceWithTax(price: number, taxType: TaxType): number {
        return Math.round(price * (1 + this.getTaxValue(taxType) / 100));
    }

    public getNotRoundedPriceWithTax(price: number, taxType: TaxType): string {
        return (price * (1 + this.getTaxValue(taxType) / 100)).toFixed(2);
    }
}
