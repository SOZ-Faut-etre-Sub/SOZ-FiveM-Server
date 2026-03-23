import { Inject, Injectable } from '@core/decorators/injectable';

import {
    TCG_DAILY_FREE_CARDS,
    TCG_USERNAME_MIN,
    TCG_USERNAME_MAX,
    TCG_USERNAME_REGEX,
    TCG_SHOWCASE_MAX,
    TCG_SHOWCASE_DESC_MAX,
    TCG_SHOWCASE_DESC_REGEX,
    TcgDailyStatus,
    TcgClaimResult,
    TcgCollectionCard,
    TcgWallpaperResult,
    TcgContact,
    TcgContactRequest,
    TcgContactCollectionCard,
    TcgProfileResult,
    TcgTradeOffer,
    TcgTradeResult,
    TcgCreateTradeInput,
    TcgRespondTradeInput,
    TcgShowcaseItem,
    TcgShowcaseResult,
} from '../../shared/tcg/tcg.types';
import { ClientEvent } from '../../shared/event/client';
import { BankService } from '../bank/bank.service';
import { PrismaService } from '../database/prisma.service';
import { PlayerHealthProvider } from '../player/player.health.provider';
import { PlayerService } from '../player/player.service';
import { TcgRepository } from './tcg.repository';

const TCG_PHONE_NUMBER = 'TCG-SRV';

function getTodayDate(): string {
    return new Date().toISOString().slice(0, 10);
}

@Injectable()
export class TcgService {
    @Inject(TcgRepository)
    private repository: TcgRepository;

    @Inject(BankService)
    private bankService: BankService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(PrismaService)
    private prismaService: PrismaService;

    @Inject(PlayerHealthProvider)
    private playerHealthProvider: PlayerHealthProvider;

    private showcaseRelaxCooldown: Record<string, number> = {};

    private async getBankAccount(citizenid: string): Promise<string | null> {
        const player = this.playerService.getPlayerByCitizenId(citizenid);
        if (player) return player.charinfo.account;
        const dbInfo = await this.repository.getPlayerCharinfo(citizenid);
        return dbInfo?.account ?? null;
    }

    private async getPlayerPhone(citizenid: string): Promise<string | null> {
        const player = this.playerService.getPlayerByCitizenId(citizenid);
        if (player) return player.charinfo.phone;
        const dbInfo = await this.repository.getPlayerCharinfo(citizenid);
        return dbInfo?.phone ?? null;
    }

    private async sendTcgSms(citizenid: string, message: string): Promise<void> {
        const targetPhone = await this.getPlayerPhone(citizenid);
        if (!targetPhone) return;

        const conversationId = [TCG_PHONE_NUMBER, targetPhone].sort().join('+');

        // Ensure conversation exists for the recipient
        const existingConv = await this.prismaService.phone_messages_conversations.findFirst({
            where: {
                conversation_id: conversationId,
                user_identifier: targetPhone,
            },
        });

        if (!existingConv) {
            // Create both sides of the conversation
            await this.prismaService.phone_messages_conversations.create({
                data: {
                    conversation_id: conversationId,
                    user_identifier: targetPhone,
                    participant_identifier: TCG_PHONE_NUMBER,
                },
            });
            await this.prismaService.phone_messages_conversations.create({
                data: {
                    conversation_id: conversationId,
                    user_identifier: TCG_PHONE_NUMBER,
                    participant_identifier: targetPhone,
                },
            });
        }

        // Create the message
        const createdMessage = await this.prismaService.phone_messages.create({
            data: {
                user_identifier: TCG_PHONE_NUMBER,
                author: TCG_PHONE_NUMBER,
                conversation_id: conversationId,
                message,
            },
        });

        // Update conversation: increment unread, unmask, update timestamp
        await this.prismaService.phone_messages_conversations.updateMany({
            where: {
                conversation_id: conversationId,
                user_identifier: targetPhone,
            },
            data: {
                unread: { increment: 1 },
                masked: false,
                updatedAt: new Date(),
            },
        });

        // Notify online player to refresh messages
        const targetPlayer = this.playerService.getPlayerByCitizenId(citizenid);
        if (targetPlayer) {
            const messageData = { ...createdMessage, createdAt: Number(createdMessage.createdAt) };
            TriggerClientEvent(ClientEvent.PHONE_SIMCARD_MESSAGES_MESSAGE_NEW, targetPlayer.source, messageData);
            TriggerClientEvent(ClientEvent.PHONE_SIMCARD_MESSAGES_CONVERSATION_RELOAD, targetPlayer.source);
        }
    }

    // ---- Profile ----

    async getProfile(citizenid: string): Promise<TcgProfileResult> {
        const profile = await this.repository.getProfile(citizenid);
        if (!profile) {
            return { success: false };
        }
        return { success: true, username: profile.username };
    }

    async setUsername(citizenid: string, username: string): Promise<TcgProfileResult> {
        if (username.length < TCG_USERNAME_MIN || username.length > TCG_USERNAME_MAX) {
            return { success: false, message: `Le pseudo doit faire entre ${TCG_USERNAME_MIN} et ${TCG_USERNAME_MAX} caractères.` };
        }
        if (!TCG_USERNAME_REGEX.test(username)) {
            return { success: false, message: 'Le pseudo ne peut contenir que des lettres et des chiffres.' };
        }

        const existing = await this.repository.getProfile(citizenid);
        if (existing) {
            return { success: false, message: 'Tu as déjà choisi ton pseudo.' };
        }

        const taken = await this.repository.getProfileByUsername(username);
        if (taken) {
            return { success: false, message: 'Ce pseudo est déjà pris.' };
        }

        await this.repository.createProfile(citizenid, username);
        return { success: true, username };
    }

    // ---- Daily status & claim (unique cards) ----

    async getDailyStatus(citizenid: string): Promise<TcgDailyStatus> {
        const claim = await this.repository.getDailyClaim(citizenid, getTodayDate());
        const claimedToday = claim?.claimed_count ?? 0;
        const availableCards = await this.repository.getAvailableCardCount();

        return {
            dailyLimit: TCG_DAILY_FREE_CARDS,
            claimedToday,
            remainingToday: Math.max(0, TCG_DAILY_FREE_CARDS - claimedToday),
            availableCards,
        };
    }

    async claimDailyCards(citizenid: string): Promise<TcgClaimResult> {
        const today = getTodayDate();
        const claim = await this.repository.getDailyClaim(citizenid, today);
        const claimedToday = claim?.claimed_count ?? 0;

        if (claimedToday >= TCG_DAILY_FREE_CARDS) {
            return { success: false, cards: [], remainingToday: 0, message: 'Tu as déjà récupéré tes cartes du jour !' };
        }

        const cardsToGive = TCG_DAILY_FREE_CARDS - claimedToday;
        const availableCards = await this.repository.getAvailableCards();

        if (availableCards.length === 0) {
            return { success: false, cards: [], remainingToday: cardsToGive, message: 'Plus aucune carte disponible pour le moment.' };
        }

        const actualDraw = Math.min(cardsToGive, availableCards.length);
        const shuffled = [...availableCards].sort(() => Math.random() - 0.5);
        const drawn = shuffled.slice(0, actualDraw);

        const obtainedCards = [];
        for (const card of drawn) {
            try {
                const uc = await this.repository.insertUserCard(citizenid, card.id);
                obtainedCards.push({ id: uc.tcg_card.id, name: uc.tcg_card.name, image: uc.tcg_card.image });
            } catch {
                // Race condition — card taken by someone else
            }
        }

        const newCount = claimedToday + obtainedCards.length;
        await this.repository.upsertDailyClaim(citizenid, today, newCount);

        // Reduce stress on successful claim
        if (obtainedCards.length > 0) {
            const player = this.playerService.getPlayerByCitizenId(citizenid);
            if (player) {
                this.playerHealthProvider.increaseStress(player.source, -2);
            }
        }

        return {
            success: obtainedCards.length > 0,
            cards: obtainedCards,
            remainingToday: Math.max(0, TCG_DAILY_FREE_CARDS - newCount),
            message: obtainedCards.length === 0 ? 'Aucune carte n\'a pu être attribuée.' : undefined,
        };
    }

    // ---- Collection ----

    async getCollection(citizenid: string): Promise<TcgCollectionCard[]> {
        const userCards = await this.repository.getCollection(citizenid);
        const wallpaper = await this.repository.getWallpaper(citizenid);
        const showcaseItems = await this.repository.getShowcaseByPlayer(citizenid);
        const showcaseCardIds = new Set(showcaseItems.map(s => s.card_id));

        return userCards.map(uc => ({
            userCardId: uc.id,
            cardId: uc.tcg_card.id,
            name: uc.tcg_card.name,
            image: uc.tcg_card.image,
            obtainedAt: uc.obtained_at.toISOString(),
            isWallpaper: wallpaper?.card_id === uc.card_id,
            isShowcase: showcaseCardIds.has(uc.card_id),
        }));
    }

    // ---- Wallpaper ----

    async getWallpaper(citizenid: string): Promise<TcgWallpaperResult> {
        const wp = await this.repository.getWallpaper(citizenid);
        if (!wp) return { success: false };
        return { success: true, image: wp.tcg_card.image };
    }

    async setWallpaper(citizenid: string, cardId: number): Promise<TcgWallpaperResult> {
        const owns = await this.repository.ownsCard(citizenid, cardId);
        if (!owns) return { success: false, message: 'Tu ne possèdes pas cette carte.' };

        const card = (await this.repository.getCollection(citizenid)).find(uc => uc.card_id === cardId);
        await this.repository.setWallpaper(citizenid, cardId);
        return { success: true, image: card?.tcg_card.image };
    }

    async removeWallpaper(citizenid: string): Promise<TcgWallpaperResult> {
        await this.repository.removeWallpaper(citizenid);
        return { success: true };
    }

    async invalidateWallpaperIfNeeded(citizenid: string, cardId: number): Promise<void> {
        await this.repository.removeWallpaperIfCard(citizenid, cardId);
    }

    // ---- Contacts ----

    async getContacts(citizenid: string): Promise<TcgContact[]> {
        const contacts = await this.repository.getContacts(citizenid);

        const allCitizenIds = new Set<string>();
        for (const c of contacts) {
            allCitizenIds.add(c.citizenid);
            allCitizenIds.add(c.target_id);
        }
        const usernames = await this.repository.getUsernamesByCitizenIds([...allCitizenIds]);

        return contacts.map(c => {
            const isSender = c.citizenid === citizenid;
            const otherId = isSender ? c.target_id : c.citizenid;
            return {
                id: c.id,
                citizenid: c.citizenid,
                targetId: c.target_id,
                displayName: usernames[otherId] ?? otherId,
                status: c.status as TcgContact['status'],
                isSender,
                createdAt: c.created_at.toISOString(),
            };
        });
    }

    async sendContactRequest(citizenid: string, targetUsername: string): Promise<TcgContactRequest> {
        const targetProfile = await this.repository.getProfileByUsername(targetUsername);
        if (!targetProfile) {
            return { success: false, message: 'Joueur introuvable.' };
        }

        const targetId = targetProfile.citizenid;

        if (citizenid === targetId) {
            return { success: false, message: 'Tu ne peux pas t\'ajouter toi-même.' };
        }

        const existing = await this.repository.getContactRelation(citizenid, targetId);
        if (existing) {
            if (existing.status === 'accepted') return { success: false, message: 'Vous êtes déjà contacts.' };
            if (existing.status === 'pending') return { success: false, message: 'Une demande est déjà en attente.' };
            await this.repository.deleteContact(existing.id);
        }

        await this.repository.createContactRequest(citizenid, targetId);
        return { success: true };
    }

    async acceptContact(citizenid: string, contactId: number): Promise<TcgContactRequest> {
        const contacts = await this.repository.getContacts(citizenid);
        const contact = contacts.find(c => c.id === contactId && c.target_id === citizenid && c.status === 'pending');
        if (!contact) return { success: false, message: 'Demande introuvable.' };

        await this.repository.updateContactStatus(contactId, 'accepted');
        return { success: true };
    }

    async rejectContact(citizenid: string, contactId: number): Promise<TcgContactRequest> {
        const contacts = await this.repository.getContacts(citizenid);
        const contact = contacts.find(c => c.id === contactId && c.target_id === citizenid && c.status === 'pending');
        if (!contact) return { success: false, message: 'Demande introuvable.' };

        await this.repository.updateContactStatus(contactId, 'rejected');
        return { success: true };
    }

    async removeContact(citizenid: string, contactId: number): Promise<TcgContactRequest> {
        const contacts = await this.repository.getContacts(citizenid);
        const contact = contacts.find(c => c.id === contactId && (c.citizenid === citizenid || c.target_id === citizenid));
        if (!contact) return { success: false, message: 'Contact introuvable.' };

        await this.repository.deleteContact(contactId);
        return { success: true };
    }

    async getContactCollection(citizenid: string, targetId: string): Promise<TcgContactCollectionCard[] | null> {
        const isContact = await this.repository.isAcceptedContact(citizenid, targetId);
        if (!isContact) return null;

        const userCards = await this.repository.getCollection(targetId);
        return userCards.map(uc => ({
            cardId: uc.tcg_card.id,
            name: uc.tcg_card.name,
            image: uc.tcg_card.image,
            obtainedAt: uc.obtained_at.toISOString(),
        }));
    }

    // ---- Trade ----

    async createTrade(citizenid: string, input: TcgCreateTradeInput): Promise<TcgTradeResult> {
        const isContact = await this.repository.isAcceptedContact(citizenid, input.receiverId);
        if (!isContact) return { success: false, message: 'Vous devez être contacts pour échanger.' };

        const owner = await this.repository.getCardOwner(input.requestedCardId);
        if (owner !== input.receiverId) return { success: false, message: 'Ce joueur ne possède pas cette carte.' };

        if (input.offerType === 'card') {
            if (!input.offerCardId) return { success: false, message: 'Aucune carte proposée.' };
            const ownsOffer = await this.repository.ownsCard(citizenid, input.offerCardId);
            if (!ownsOffer) return { success: false, message: 'Tu ne possèdes pas la carte proposée.' };
        } else if (input.offerType === 'money') {
            if (!input.offerAmount || input.offerAmount <= 0) return { success: false, message: 'Montant invalide.' };
            const senderAccount = await this.getBankAccount(citizenid);
            if (senderAccount) {
                const balance = await this.bankService.getAccountMoney(senderAccount);
                if (balance < input.offerAmount) {
                    return { success: false, message: `Fonds insuffisants (solde : $${balance}).` };
                }
            }
        }

        await this.repository.createTradeRequest(
            citizenid,
            input.receiverId,
            input.requestedCardId,
            input.offerType,
            input.offerType === 'card' ? input.offerCardId : null,
            input.offerType === 'money' ? input.offerAmount : null,
        );

        return { success: true, message: 'Proposition envoyée !' };
    }

    async getTrades(citizenid: string): Promise<TcgTradeOffer[]> {
        const trades = await this.repository.getTradesForPlayer(citizenid);

        const allCitizenIds = new Set<string>();
        for (const t of trades) {
            allCitizenIds.add(t.sender_id);
            allCitizenIds.add(t.receiver_id);
        }
        const usernames = await this.repository.getUsernamesByCitizenIds([...allCitizenIds]);

        return trades.map(t => ({
            id: t.id,
            senderId: t.sender_id,
            senderName: usernames[t.sender_id] ?? t.sender_id,
            receiverId: t.receiver_id,
            receiverName: usernames[t.receiver_id] ?? t.receiver_id,
            requestedCardId: t.requested_card_id,
            requestedCardName: t.requested_card.name,
            requestedCardImage: t.requested_card.image,
            offerType: t.offer_type as 'card' | 'money',
            offerCardId: t.offer_card_id,
            offerCardName: t.offered_card?.name ?? null,
            offerCardImage: t.offered_card?.image ?? null,
            offerAmount: t.offer_amount,
            status: t.status as TcgTradeOffer['status'],
            message: t.message,
            createdAt: t.created_at.toISOString(),
        }));
    }

    async respondTrade(citizenid: string, input: TcgRespondTradeInput): Promise<TcgTradeResult> {
        const trade = await this.repository.getTradeById(input.tradeId);
        if (!trade) return { success: false, message: 'Échange introuvable.' };
        if (trade.receiver_id !== citizenid) return { success: false, message: 'Tu n\'es pas le destinataire.' };
        if (trade.status !== 'pending') return { success: false, message: 'Cet échange n\'est plus en attente.' };

        if (input.action === 'refuse') {
            await this.repository.updateTradeStatus(trade.id, 'refused', input.message);
            return { success: true, message: 'Échange refusé.' };
        }

        // Accept — execute the trade

        // 1. Verify both sides still own their cards
        const receiverOwns = await this.repository.ownsCard(trade.receiver_id, trade.requested_card_id);
        if (!receiverOwns) return { success: false, message: 'Tu ne possèdes plus cette carte.' };

        if (trade.offer_type === 'card') {
            const senderOwns = await this.repository.ownsCard(trade.sender_id, trade.offer_card_id);
            if (!senderOwns) return { success: false, message: 'L\'autre joueur ne possède plus la carte proposée.' };
        }

        // Resolve usernames for SMS
        const usernames = await this.repository.getUsernamesByCitizenIds([trade.sender_id, trade.receiver_id]);
        const senderName = usernames[trade.sender_id] ?? trade.sender_id;
        const receiverName = usernames[trade.receiver_id] ?? trade.receiver_id;

        // 2. Execute transfer
        if (trade.offer_type === 'money') {
            const senderAccount = await this.getBankAccount(trade.sender_id);
            const receiverAccount = await this.getBankAccount(trade.receiver_id);

            if (!senderAccount || !receiverAccount) {
                return { success: false, message: 'Impossible de trouver les comptes bancaires.' };
            }

            // Check balance before transfer
            const balance = await this.bankService.getAccountMoney(senderAccount);
            if (balance < trade.offer_amount) {
                await this.repository.updateTradeStatus(trade.id, 'cancelled');

                await this.sendTcgSms(
                    trade.sender_id,
                    `Votre demande d'échange pour la carte ${trade.requested_card.name} détenue par ${receiverName} a été annulée pour provision insuffisante.`
                );

                return { success: false, message: 'L\'échange a été annulé : le demandeur n\'a plus les fonds suffisants.' };
            }

            // Transfer money sender → receiver
            const transferred = await this.bankService.transferBankMoney(
                senderAccount,
                receiverAccount,
                'money',
                trade.offer_amount,
                false,
                `TCG Service - Carte ${trade.requested_card.name}`
            );

            if (!transferred) {
                await this.repository.updateTradeStatus(trade.id, 'cancelled');

                await this.sendTcgSms(
                    trade.sender_id,
                    `Votre demande d'échange pour la carte ${trade.requested_card.name} détenue par ${receiverName} a été annulée pour provision insuffisante.`
                );

                return { success: false, message: 'L\'échange a été annulé : le demandeur n\'a plus les fonds suffisants.' };
            }

            // Transfer card receiver → sender
            await this.repository.transferCard(trade.requested_card_id, trade.receiver_id, trade.sender_id);

            // Invalidate wallpapers
            await this.invalidateWallpaperIfNeeded(trade.receiver_id, trade.requested_card_id);

            // SMS sender — trade accepted
            await this.sendTcgSms(
                trade.sender_id,
                `Votre demande d'échange pour la carte ${trade.requested_card.name} détenue par ${receiverName} a été acceptée.`
            );

            // SMS receiver — money received
            await this.sendTcgSms(
                trade.receiver_id,
                `L'échange de votre carte ${trade.requested_card.name} à ${senderName} vous a rapporté $${trade.offer_amount}.`
            );

        } else if (trade.offer_type === 'card') {
            // Swap cards
            await this.repository.transferCard(trade.requested_card_id, trade.receiver_id, trade.sender_id);
            await this.repository.transferCard(trade.offer_card_id, trade.sender_id, trade.receiver_id);

            // Invalidate wallpapers
            await this.invalidateWallpaperIfNeeded(trade.receiver_id, trade.requested_card_id);
            await this.invalidateWallpaperIfNeeded(trade.sender_id, trade.offer_card_id);

            // SMS sender — trade accepted
            await this.sendTcgSms(
                trade.sender_id,
                `Votre demande d'échange pour la carte ${trade.requested_card.name} détenue par ${receiverName} a été acceptée.`
            );

            // SMS receiver — card received
            await this.sendTcgSms(
                trade.receiver_id,
                `L'échange de votre carte ${trade.requested_card.name} à ${senderName} vous a rapporté la carte ${trade.offered_card?.name ?? 'inconnue'}.`
            );
        }

        // 3. Remove showcase entries for traded cards
        await this.repository.removeShowcaseByCard(trade.requested_card_id);
        if (trade.offer_card_id) {
            await this.repository.removeShowcaseByCard(trade.offer_card_id);
        }

        // 4. Cancel all other pending trades involving these cards
        await this.repository.cancelPendingTradesForCard(trade.requested_card_id, trade.id);
        if (trade.offer_card_id) {
            await this.repository.cancelPendingTradesForCard(trade.offer_card_id, trade.id);
        }

        await this.repository.updateTradeStatus(trade.id, 'accepted');

        return { success: true, message: 'Échange effectué !' };
    }

    // ---- Showcase (Vitrine) ----

    async getShowcase(): Promise<TcgShowcaseItem[]> {
        const items = await this.repository.getShowcaseAll();

        const allCitizenIds = [...new Set(items.map(i => i.citizenid))];
        const usernames = await this.repository.getUsernamesByCitizenIds(allCitizenIds);

        return items.map(item => ({
            id: item.id,
            citizenid: item.citizenid,
            cardId: item.card_id,
            cardName: item.tcg_card.name,
            cardImage: item.tcg_card.image,
            username: usernames[item.citizenid] ?? item.citizenid,
            description: item.description,
            createdAt: item.created_at.toISOString(),
        }));
    }

    async addShowcase(citizenid: string, cardId: number, description: string): Promise<TcgShowcaseResult> {
        if (description.length > TCG_SHOWCASE_DESC_MAX) {
            return { success: false, message: `Maximum ${TCG_SHOWCASE_DESC_MAX} caractères.` };
        }
        if (!TCG_SHOWCASE_DESC_REGEX.test(description)) {
            return { success: false, message: 'Lettres, chiffres et espaces uniquement.' };
        }

        const owns = await this.repository.ownsCard(citizenid, cardId);
        if (!owns) return { success: false, message: 'Tu ne possèdes pas cette carte.' };

        const count = await this.repository.getShowcaseCountByPlayer(citizenid);
        if (count >= TCG_SHOWCASE_MAX) {
            return { success: false, message: `Maximum ${TCG_SHOWCASE_MAX} cartes en vitrine.` };
        }

        const already = await this.repository.isCardInShowcase(cardId);
        if (already) return { success: false, message: 'Cette carte est déjà en vitrine.' };

        await this.repository.addShowcase(citizenid, cardId, description);
        return { success: true, message: 'Carte exposée !' };
    }

    async removeShowcase(citizenid: string, cardId: number): Promise<TcgShowcaseResult> {
        await this.repository.removeShowcase(citizenid, cardId);
        return { success: true, message: 'Carte retirée de la vitrine.' };
    }

    // ---- Stress relief ----

    async showcaseRelax(source: number, citizenid: string): Promise<{ success: boolean }> {
        const now = Date.now();
        const lastUsed = this.showcaseRelaxCooldown[citizenid] ?? 0;
        const ONE_HOUR = 60 * 60 * 1000;

        if (now - lastUsed < ONE_HOUR) {
            return { success: false };
        }

        this.showcaseRelaxCooldown[citizenid] = now;
        this.playerHealthProvider.increaseStress(source, -2);
        return { success: true };
    }
}