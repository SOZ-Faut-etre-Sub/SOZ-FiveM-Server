import { Inject, Injectable } from '@core/decorators/injectable';
import { DEFAULT_TAX_PERCENTAGE, Tax, TaxType } from '@public/shared/tax';

import { RepositoryType } from '../../shared/repository';
import { PrismaService } from '../database/prisma.service';
import { Repository } from './repository';

@Injectable(TaxRepository, Repository)
export class TaxRepository extends Repository<RepositoryType.Tax> {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    public type = RepositoryType.Tax;

    protected async load(): Promise<Record<TaxType, Tax>> {
        const taxes = await this.prismaService.tax.findMany();
        const list = {};

        for (const tax of taxes) {
            list[tax.id] = {
                ...tax,
            };
        }

        return list as Record<TaxType, Tax>;
    }

    public async getTaxValue(taxType: TaxType) {
        const tax = await this.find(taxType);

        if (!tax) {
            return DEFAULT_TAX_PERCENTAGE;
        }

        return tax.value;
    }
}
