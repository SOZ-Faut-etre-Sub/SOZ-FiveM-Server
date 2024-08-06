import { invoices } from '@prisma/client';

import { Inject, Injectable } from '../../core/decorators/injectable';
import { Invoice } from '../../shared/bank';
import { PlayerData } from '../../shared/player';
import { RepositoryType } from '../../shared/repository';
import { PrismaService } from '../database/prisma.service';
import { JobService } from '../job.service';
import { Repository } from './repository';

@Injectable(BankInvoiceRepository, Repository)
export class BankInvoiceRepository extends Repository<RepositoryType.BankInvoice> {
    public type = RepositoryType.BankInvoice;

    @Inject(PrismaService)
    private prismaService: PrismaService;

    @Inject(JobService)
    private jobService: JobService;

    protected async load(): Promise<Record<number, Invoice>> {
        const result = await this.prismaService.invoices.findMany();
        const invoices = {};

        for (const invoice of result) {
            invoices[invoice.id] = this.serializeFromDatabase(invoice);
        }

        return invoices;
    }

    public async create(
        playerSource: PlayerData,
        playerTarget: PlayerData,
        targetAccount: string,
        label: string,
        amount: number,
        kind = 'invoice'
    ): Promise<Invoice> {
        const data = await this.prismaService.invoices.create({
            data: {
                citizenid: playerTarget.citizenid,
                emitter: playerSource.citizenid,
                emitterName: this.jobService.getJob(playerSource.job.id).label,
                emitterSafe: `safe_${playerSource.job.id}`,
                targetAccount,
                label,
                amount,
                kind,
            },
        });

        this.data[data.id] = this.serializeFromDatabase(data);

        return this.data[data.id];
    }

    public async setPayed(invoiceId: number): Promise<boolean> {
        await this.prismaService.invoices.update({
            where: { id: invoiceId, payed: false, refused: false },
            data: { payed: true },
        });

        this.data[invoiceId].payed = true;
        return true;
    }

    public async setRejected(invoiceId: number): Promise<boolean> {
        await this.prismaService.invoices.update({
            where: { id: invoiceId, payed: false, refused: false },
            data: { refused: true },
        });

        this.data[invoiceId].refused = true;
        return true;
    }

    protected serializeFromDatabase(data: invoices): Invoice {
        return {
            id: data.id,
            citizenid: data.citizenid,
            emitter: data.emitter,
            emitterName: data.emitterName,
            emitterSafe: data.emitterSafe,
            targetAccount: data.targetAccount,
            label: data.label,
            amount: data.amount,
            payed: data.payed,
            kind: data.kind,
            refused: data.refused,
            createdAt: data.created_at.getTime(),
        };
    }
}
