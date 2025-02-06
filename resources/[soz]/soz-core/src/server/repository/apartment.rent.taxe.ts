import { RentTaxe } from '@public/shared/housing/housing';
import { addDays, endOfDay } from 'date-fns';

import { Inject, Injectable } from '../../core/decorators/injectable';
import { RepositoryType } from '../../shared/repository';
import { PrismaService } from '../database/prisma.service';
import { Repository } from './repository';

@Injectable(ApartmentRentTaxeRepository, Repository)
export class ApartmentRentTaxeRepository extends Repository<RepositoryType.ApartmentRentTaxe> {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    public type = RepositoryType.ApartmentRentTaxe;

    protected async load(): Promise<Record<number, RentTaxe>> {
        const rentTaxes = await this.prismaService.apartment_rent_taxes.findMany();

        const indexedTaxes: Record<string, RentTaxe> = {};

        rentTaxes.forEach(rentTaxe => {
            indexedTaxes[rentTaxe.id] = rentTaxe;
        });

        return indexedTaxes;
    }

    public async createTaxeEntryies(taxesData: RentTaxe[]) {
        await this.prismaService.apartment_rent_taxes.createMany({ data: taxesData });
        await this.refresh();
    }

    public async deletePreviousTaxes() {
        const date = addDays(new Date(), -30);

        await this.prismaService.apartment_rent_taxes.deleteMany({
            where: {
                created_at: { lte: date },
            },
        });
        await this.refresh();
    }

    public async deleteAllTaxes() {
        await this.prismaService.apartment_rent_taxes.deleteMany({});
        await this.refresh();
    }

    public async getWeeklyTaxes(): Promise<RentTaxe[]> {
        const today = endOfDay(new Date());
        const lastWeek = addDays(today, -7);

        return await this.prismaService.apartment_rent_taxes.findMany({
            where: {
                created_at: {
                    lte: today,
                    gte: lastWeek,
                },
            },
        });
    }
}
