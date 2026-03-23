import { Inject, Injectable } from '@core/decorators/injectable';

import { PrismaService } from '../database/prisma.service';

@Injectable()
export class TcgRepository {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    // ---- Cards ----

    async getActiveCards() {
        return this.prismaService.tcg_card.findMany({
            where: { active: true },
        });
    }

    async getAvailableCards() {
        return this.prismaService.tcg_card.findMany({
            where: {
                active: true,
                tcg_user_card: null,
            },
        });
    }

    async getAvailableCardCount(): Promise<number> {
        return this.prismaService.tcg_card.count({
            where: {
                active: true,
                tcg_user_card: null,
            },
        });
    }

    async getCardById(cardId: number) {
        return this.prismaService.tcg_card.findUnique({
            where: { id: cardId },
        });
    }

    // ---- Daily claim ----

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

    // ---- User cards (unique ownership) ----

    async insertUserCard(citizenid: string, cardId: number) {
        return this.prismaService.tcg_user_card.create({
            data: { citizenid, card_id: cardId },
            include: { tcg_card: true },
        });
    }

    async getCollection(citizenid: string) {
        return this.prismaService.tcg_user_card.findMany({
            where: { citizenid },
            include: { tcg_card: true },
            orderBy: { obtained_at: 'desc' },
        });
    }

    async ownsCard(citizenid: string, cardId: number): Promise<boolean> {
        const card = await this.prismaService.tcg_user_card.findFirst({
            where: { citizenid, card_id: cardId },
        });
        return card !== null;
    }

    async getCardOwner(cardId: number): Promise<string | null> {
        const uc = await this.prismaService.tcg_user_card.findUnique({
            where: { card_id: cardId },
        });
        return uc?.citizenid ?? null;
    }

    async transferCard(cardId: number, fromCitizenid: string, toCitizenid: string) {
        return this.prismaService.tcg_user_card.updateMany({
            where: { card_id: cardId, citizenid: fromCitizenid },
            data: { citizenid: toCitizenid, obtained_at: new Date() },
        });
    }

    // ---- Profile ----

    async getProfile(citizenid: string) {
        return this.prismaService.tcg_profile.findUnique({
            where: { citizenid },
        });
    }

    async getProfileByUsername(username: string) {
        return this.prismaService.tcg_profile.findUnique({
            where: { username },
        });
    }

    async createProfile(citizenid: string, username: string) {
        return this.prismaService.tcg_profile.create({
            data: { citizenid, username },
        });
    }

    async getUsernamesByCitizenIds(citizenids: string[]): Promise<Record<string, string>> {
        const profiles = await this.prismaService.tcg_profile.findMany({
            where: { citizenid: { in: citizenids } },
        });
        const map: Record<string, string> = {};
        for (const p of profiles) {
            map[p.citizenid] = p.username;
        }
        return map;
    }

    // ---- Wallpaper ----

    async getWallpaper(citizenid: string) {
        return this.prismaService.tcg_wallpaper.findUnique({
            where: { citizenid },
            include: { tcg_card: true },
        });
    }

    async setWallpaper(citizenid: string, cardId: number) {
        return this.prismaService.tcg_wallpaper.upsert({
            where: { citizenid },
            update: { card_id: cardId },
            create: { citizenid, card_id: cardId },
        });
    }

    async removeWallpaper(citizenid: string) {
        return this.prismaService.tcg_wallpaper.deleteMany({
            where: { citizenid },
        });
    }

    async removeWallpaperIfCard(citizenid: string, cardId: number) {
        return this.prismaService.tcg_wallpaper.deleteMany({
            where: { citizenid, card_id: cardId },
        });
    }

    // ---- Contacts ----

    async getContacts(citizenid: string) {
        return this.prismaService.tcg_contact.findMany({
            where: {
                OR: [{ citizenid }, { target_id: citizenid }],
            },
            orderBy: { created_at: 'desc' },
        });
    }

    async getContactRelation(citizenidA: string, citizenidB: string) {
        return this.prismaService.tcg_contact.findFirst({
            where: {
                OR: [
                    { citizenid: citizenidA, target_id: citizenidB },
                    { citizenid: citizenidB, target_id: citizenidA },
                ],
            },
        });
    }

    async createContactRequest(citizenid: string, targetId: string) {
        return this.prismaService.tcg_contact.create({
            data: { citizenid, target_id: targetId, status: 'pending' },
        });
    }

    async updateContactStatus(id: number, status: string) {
        return this.prismaService.tcg_contact.update({
            where: { id },
            data: { status },
        });
    }

    async deleteContact(id: number) {
        return this.prismaService.tcg_contact.delete({
            where: { id },
        });
    }

    async isAcceptedContact(citizenidA: string, citizenidB: string): Promise<boolean> {
        const relation = await this.getContactRelation(citizenidA, citizenidB);
        return relation?.status === 'accepted';
    }

    // ---- Trade requests ----

    async createTradeRequest(
        senderId: string,
        receiverId: string,
        requestedCardId: number,
        offerType: string,
        offerCardId: number | null,
        offerAmount: number | null,
    ) {
        return this.prismaService.tcg_trade_request.create({
            data: {
                sender_id: senderId,
                receiver_id: receiverId,
                requested_card_id: requestedCardId,
                offer_type: offerType,
                offer_card_id: offerCardId,
                offer_amount: offerAmount,
                status: 'pending',
            },
        });
    }

    async getTradesForPlayer(citizenid: string) {
        return this.prismaService.tcg_trade_request.findMany({
            where: {
                OR: [{ sender_id: citizenid }, { receiver_id: citizenid }],
                status: { in: ['pending'] },
            },
            include: {
                requested_card: true,
                offered_card: true,
            },
            orderBy: { created_at: 'desc' },
        });
    }

    async getTradeById(id: number) {
        return this.prismaService.tcg_trade_request.findUnique({
            where: { id },
            include: {
                requested_card: true,
                offered_card: true,
            },
        });
    }

    async updateTradeStatus(id: number, status: string, message?: string) {
        return this.prismaService.tcg_trade_request.update({
            where: { id },
            data: { status, message: message ?? null },
        });
    }

    async cancelPendingTradesForCard(cardId: number, excludeTradeId?: number) {
        return this.prismaService.tcg_trade_request.updateMany({
            where: {
                status: 'pending',
                OR: [{ requested_card_id: cardId }, { offer_card_id: cardId }],
                ...(excludeTradeId ? { NOT: { id: excludeTradeId } } : {}),
            },
            data: { status: 'cancelled' },
        });
    }

    // ---- Showcase (Vitrine) ----

    async getShowcaseAll() {
        return this.prismaService.tcg_showcase.findMany({
            include: { tcg_card: true },
            orderBy: { created_at: 'desc' },
        });
    }

    async getShowcaseByPlayer(citizenid: string) {
        return this.prismaService.tcg_showcase.findMany({
            where: { citizenid },
            include: { tcg_card: true },
        });
    }

    async getShowcaseCountByPlayer(citizenid: string): Promise<number> {
        return this.prismaService.tcg_showcase.count({
            where: { citizenid },
        });
    }

    async isCardInShowcase(cardId: number): Promise<boolean> {
        const item = await this.prismaService.tcg_showcase.findUnique({
            where: { card_id: cardId },
        });
        return item !== null;
    }

    async addShowcase(citizenid: string, cardId: number, description: string) {
        return this.prismaService.tcg_showcase.create({
            data: { citizenid, card_id: cardId, description },
        });
    }

    async removeShowcase(citizenid: string, cardId: number) {
        return this.prismaService.tcg_showcase.deleteMany({
            where: { citizenid, card_id: cardId },
        });
    }

    async removeShowcaseByCard(cardId: number) {
        return this.prismaService.tcg_showcase.deleteMany({
            where: { card_id: cardId },
        });
    }
	async getPlayerCharinfo(citizenid: string): Promise<{ account: string; phone: string } | null> {
        const player = await this.prismaService.player.findFirst({
            where: { citizenid },
            select: { charinfo: true },
        });
        if (!player?.charinfo) return null;
        try {
            const info = JSON.parse(player.charinfo as string);
            return { account: info.account, phone: info.phone };
        } catch {
            return null;
        }
    }
}
