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

    // ---- Protected ----

    async toggleProtected(citizenid: string, cardId: number, value: boolean) {
        return this.prismaService.tcg_user_card.updateMany({
            where: { citizenid, card_id: cardId },
            data: { protected: value },
        });
    }

    async isCardProtected(citizenid: string, cardId: number): Promise<boolean> {
        const uc = await this.prismaService.tcg_user_card.findFirst({
            where: { citizenid, card_id: cardId },
        });
        return uc?.protected === true;
    }

    // ---- Sell Set: get unprotected cards of an archetype, release them ----

    async getUnprotectedCardsByArchetype(citizenid: string, archetype: string) {
        return this.prismaService.tcg_user_card.findMany({
            where: {
                citizenid,
                protected: false,
                tcg_card: { archetype },
            },
            include: { tcg_card: true },
        });
    }

    async releaseCards(cardIds: number[]): Promise<number> {
        // Remove ownership (card becomes available again for daily claims)
        const result = await this.prismaService.tcg_user_card.deleteMany({
            where: { card_id: { in: cardIds } },
        });
        return result.count;
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

    async updateBio(citizenid: string, bio: string | null) {
        return this.prismaService.tcg_profile.update({
            where: { citizenid },
            data: { bio },
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

    async createContactRequest(citizenid: string, targetId: string, message?: string) {
        return this.prismaService.tcg_contact.create({
            data: { citizenid, target_id: targetId, status: 'pending', message: message ?? null },
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

    // ---- Stats (for badges / profile) ----

    async getPlayerCardCount(citizenid: string): Promise<number> {
        return this.prismaService.tcg_user_card.count({
            where: { citizenid },
        });
    }

    async getPlayerTradeCount(citizenid: string): Promise<number> {
        return this.prismaService.tcg_trade_request.count({
            where: {
                OR: [{ sender_id: citizenid }, { receiver_id: citizenid }],
                status: 'accepted',
            },
        });
    }

    async getPlayerArchetypeCounts(citizenid: string): Promise<Record<string, number>> {
        const cards = await this.prismaService.tcg_user_card.findMany({
            where: { citizenid },
            include: { tcg_card: { select: { archetype: true } } },
        });
        const counts: Record<string, number> = {};
        for (const c of cards) {
            const arch = c.tcg_card.archetype;
            if (arch) {
                counts[arch] = (counts[arch] ?? 0) + 1;
            }
        }
        return counts;
    }

    // ---- Profile Stats (persistent counters) ----

    async getProfileStats(citizenid: string) {
        const profile = await this.prismaService.tcg_profile.findUnique({
            where: { citizenid },
            select: {
                total_cards_obtained: true,
                total_cards_obtained_classic: true,
                total_cards_obtained_cute: true,
                total_cards_obtained_event: true,
                total_trades_completed: true,
                total_sets_sold: true,
                total_sets_sold_classic: true,
                total_sets_sold_cute: true,
                total_sets_sold_event: true,
            },
        });
        return profile ?? null;
    }

    async incrementCardsObtained(citizenid: string, count: number, category: 'classic' | 'cute' | 'event') {
        const data: Record<string, any> = {
            total_cards_obtained: { increment: count },
        };
        if (category === 'classic') data.total_cards_obtained_classic = { increment: count };
        else if (category === 'cute') data.total_cards_obtained_cute = { increment: count };
        else if (category === 'event') data.total_cards_obtained_event = { increment: count };

        return this.prismaService.tcg_profile.update({
            where: { citizenid },
            data,
        });
    }

    async incrementTradesCompleted(citizenid: string) {
        return this.prismaService.tcg_profile.update({
            where: { citizenid },
            data: { total_trades_completed: { increment: 1 } },
        });
    }

    async incrementSetsSold(citizenid: string, category: 'classic' | 'cute' | 'event') {
        const data: Record<string, any> = {
            total_sets_sold: { increment: 1 },
        };
        if (category === 'classic') data.total_sets_sold_classic = { increment: 1 };
        else if (category === 'cute') data.total_sets_sold_cute = { increment: 1 };
        else if (category === 'event') data.total_sets_sold_event = { increment: 1 };

        return this.prismaService.tcg_profile.update({
            where: { citizenid },
            data,
        });
    }

    // ---- Trade Partners (unique partners for badge) ----

    async recordTradePartner(citizenidA: string, citizenidB: string): Promise<void> {
        // Insert both directions, ignore if already exists
        await this.prismaService.$executeRawUnsafe(`
            INSERT IGNORE INTO tcg_trade_partner (citizenid, partner_id)
            VALUES (?, ?), (?, ?)
        `, citizenidA, citizenidB, citizenidB, citizenidA);
    }

    async getUniqueTradePartnerCount(citizenid: string): Promise<number> {
        const result = await this.prismaService.$queryRaw<{ count: bigint }[]>`
            SELECT COUNT(*) as count FROM tcg_trade_partner
            WHERE citizenid = ${citizenid}
        `;
        return Number(result[0]?.count ?? 0);
    }

    // ---- Avatar & Border ----

    async setAvatar(citizenid: string, avatar: string | null) {
        return this.prismaService.tcg_profile.update({
            where: { citizenid },
            data: { avatar },
        });
    }

    async getAvatar(citizenid: string): Promise<string | null> {
        const profile = await this.prismaService.tcg_profile.findUnique({
            where: { citizenid },
            select: { avatar: true },
        });
        return profile?.avatar ?? null;
    }

    async getAvatarsByCitizenIds(citizenids: string[]): Promise<Record<string, string | null>> {
        if (citizenids.length === 0) return {};
        const profiles = await this.prismaService.tcg_profile.findMany({
            where: { citizenid: { in: citizenids } },
            select: { citizenid: true, avatar: true },
        });
        const map: Record<string, string | null> = {};
        for (const p of profiles) {
            map[p.citizenid] = p.avatar ?? null;
        }
        return map;
    }

    async setBorder(citizenid: string, borderId: number | null) {
        return this.prismaService.tcg_profile.update({
            where: { citizenid },
            data: { border_id: borderId },
        });
    }

    async getBorder(citizenid: string): Promise<{ id: number; name: string; image: string } | null> {
        const profile = await this.prismaService.tcg_profile.findUnique({
            where: { citizenid },
            select: { tcg_border: true },
        });
        if (!profile?.tcg_border) return null;
        return { id: profile.tcg_border.id, name: profile.tcg_border.name, image: profile.tcg_border.image };
    }

    async getAllBorders(): Promise<Array<{ id: number; name: string; image: string }>> {
        const borders = await this.prismaService.tcg_border.findMany({
            orderBy: { name: 'asc' },
        });
        return borders.map(b => ({ id: b.id, name: b.name, image: b.image }));
    }

    async getProfileFull(citizenid: string) {
        return this.prismaService.tcg_profile.findUnique({
            where: { citizenid },
            include: { tcg_border: true },
        });
    }

    // ---- Weekly Pack ----

    async getWeeklyPackRecord(citizenid: string, weekKey: string): Promise<{ packs_bought: number } | null> {
        const rows = await this.prismaService.$queryRaw<{ packs_bought: number }[]>`
            SELECT packs_bought FROM tcg_weekly_pack
            WHERE citizenid = ${citizenid} AND week_key = ${weekKey}
        `;
        return rows.length > 0 ? rows[0] : null;
    }

    async upsertWeeklyPack(citizenid: string, weekKey: string): Promise<void> {
        await this.prismaService.$executeRawUnsafe(`
            INSERT INTO tcg_weekly_pack (citizenid, week_key, packs_bought, last_buy_at)
            VALUES (?, ?, 1, NOW(3))
            ON DUPLICATE KEY UPDATE packs_bought = packs_bought + 1, last_buy_at = NOW(3)
        `, citizenid, weekKey);
    }

    // ---- Set Prices ----

    async getSetPrice(archetype: string): Promise<number | null> {
        const rows = await this.prismaService.$queryRaw<{ set_price: number }[]>`
            SELECT set_price FROM tcg_set_price WHERE archetype = ${archetype}
        `;
        return rows.length > 0 ? Number(rows[0].set_price) : null;
    }

    async getAllSetPrices(): Promise<Array<{ rank_order: number; archetype: string; tier: string; set_price: number; prompt_count: number }>> {
        return this.prismaService.$queryRaw<Array<{ rank_order: number; archetype: string; tier: string; set_price: number; prompt_count: number }>>`
            SELECT rank_order, archetype, tier, set_price, prompt_count
            FROM tcg_set_price ORDER BY rank_order ASC
        `;
    }
}
