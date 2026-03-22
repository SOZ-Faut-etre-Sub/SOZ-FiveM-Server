import { Inject, Injectable } from '@core/decorators/injectable';

import { PrismaService } from '../database/prisma.service';

@Injectable()
export class TcgRepository {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    async getActiveCards() {
        return this.prismaService.tcg_card.findMany({
            where: { active: true },
        });
    }

    async getDailyClaim(citizenid: string, claimDate: string) {
        return this.prismaService.tcg_daily_claim.findUnique({
            where: {
                citizenid_claim_date: { citizenid, claim_date: claimDate },
            },
        });
    }

    async upsertDailyClaim(citizenid: string, claimDate: string, claimedCount: number) {
        return this.prismaService.tcg_daily_claim.upsert({
            where: {
                citizenid_claim_date: { citizenid, claim_date: claimDate },
            },
            update: { claimed_count: claimedCount },
            create: { citizenid, claim_date: claimDate, claimed_count: claimedCount },
        });
    }

    async insertUserCards(citizenid: string, cardIds: number[]) {
        const data = cardIds.map(card_id => ({ citizenid, card_id }));
        await this.prismaService.tcg_user_card.createMany({ data });

        return this.prismaService.tcg_user_card.findMany({
            where: { citizenid, card_id: { in: cardIds } },
            include: { tcg_card: true },
            orderBy: { obtained_at: 'desc' },
            take: cardIds.length,
        });
    }

    async getCollection(citizenid: string) {
        return this.prismaService.tcg_user_card.findMany({
            where: { citizenid },
            include: { tcg_card: true },
            orderBy: { obtained_at: 'desc' },
        });
    }
}
