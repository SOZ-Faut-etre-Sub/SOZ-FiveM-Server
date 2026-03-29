import { Inject, Injectable } from '@core/decorators/injectable';

import {
    TCG_DAILY_FREE_CARDS,
    TCG_USERNAME_MIN,
    TCG_USERNAME_MAX,
    TCG_USERNAME_REGEX,
    TCG_SHOWCASE_MAX,
    TCG_SHOWCASE_DESC_MAX,
    TCG_SHOWCASE_DESC_REGEX,
    TCG_SET_SIZE,
    TCG_ARCHETYPES,
    TCG_BIO_MAX,
    TCG_BIO_REGEX,
    TcgDailyStatus,
    TcgClaimResult,
    TcgCollectionCard,
    TcgContact,
    TcgContactRequest,
    TcgContactCollectionCard,
    TcgProfileResult,
    TcgProfilePage,
    TcgBadge,
    TcgTradeOffer,
    TcgTradeResult,
    TcgCreateTradeInput,
    TcgRespondTradeInput,
    TcgShowcaseItem,
    TcgShowcaseResult,
    TcgSellSetResult,
    TcgBorderData,
    getArchetypeCategory,
} from '../../shared/tcg/tcg.types';
import { ClientEvent } from '../../shared/event/client';
import { BankService } from '../bank/bank.service';
import { PrismaService } from '../database/prisma.service';
import { PlayerHealthProvider } from '../player/player.health.provider';
import { PlayerService } from '../player/player.service';
import { TcgRepository } from './tcg.repository';
import { TcgMigrationProvider } from './tcg.migration.provider';

const TCG_PHONE_NUMBER = '555-TCG';

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

        const existingConv = await this.prismaService.phone_messages_conversations.findFirst({
            where: {
                conversation_id: conversationId,
                user_identifier: targetPhone,
            },
        });

        if (!existingConv) {
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

            // Create personal contact so the conversation shows "TCG Service" (avatar from phone_profile JOIN)
            const existingContact = await this.prismaService.phone_contacts.findFirst({
                where: {
                    identifier: citizenid,
                    number: TCG_PHONE_NUMBER,
                },
            });
            if (!existingContact) {
                await this.prismaService.phone_contacts.create({
                    data: {
                        identifier: citizenid,
                        display: 'TCG Service',
                        number: TCG_PHONE_NUMBER,
                    },
                });
            }
        }

        const createdMessage = await this.prismaService.phone_messages.create({
            data: {
                user_identifier: TCG_PHONE_NUMBER,
                author: TCG_PHONE_NUMBER,
                conversation_id: conversationId,
                message,
            },
        });

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

        const targetPlayer = this.playerService.getPlayerByCitizenId(citizenid);
        if (targetPlayer) {
            const messageData = { ...createdMessage, createdAt: Number(createdMessage.createdAt) };
            TriggerClientEvent(ClientEvent.PHONE_SIMCARD_MESSAGES_MESSAGE_NEW, targetPlayer.source, messageData);
            TriggerClientEvent(ClientEvent.PHONE_SIMCARD_MESSAGES_CONVERSATION_RELOAD, targetPlayer.source);
        }
    }

    // ---- Profile ----

    async getProfile(citizenid: string): Promise<TcgProfileResult> {
        const profile = await this.repository.getProfileFull(citizenid);
        if (!profile) {
            return { success: false };
        }
        return {
            success: true,
            username: profile.username,
            avatar: profile.avatar ?? null,
            border: profile.tcg_border ? { id: profile.tcg_border.id, name: profile.tcg_border.name, image: profile.tcg_border.image } : null,
        };
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

    // ---- Bio ----

    async setBio(citizenid: string, bio: string): Promise<{ success: boolean; message?: string }> {
        if (bio.length > TCG_BIO_MAX) {
            return { success: false, message: `Maximum ${TCG_BIO_MAX} caractères.` };
        }
        if (!TCG_BIO_REGEX.test(bio)) {
            return { success: false, message: 'Caractères non autorisés.' };
        }

        await this.repository.updateBio(citizenid, bio.trim() || null);
        return { success: true };
    }

    // ---- Avatar ----

    async setAvatar(citizenid: string, avatar: string): Promise<{ success: boolean; avatar?: string; message?: string }> {
        if (!avatar) {
            await this.repository.setAvatar(citizenid, null);
            return { success: true, avatar: null };
        }

        // Validate it's a data URL (base64 from canvas crop) or a card image path
        const isDataUrl = avatar.startsWith('data:image/');
        const isCardPath = avatar.startsWith('images/');

        if (!isDataUrl && !isCardPath) {
            return { success: false, message: 'Format d\'image non valide.' };
        }

        // Size check for data URLs (prevent huge payloads)
        if (isDataUrl && avatar.length > 500000) {
            return { success: false, message: 'Image trop volumineuse.' };
        }

        await this.repository.setAvatar(citizenid, avatar);
        return { success: true, avatar };
    }

    async removeAvatar(citizenid: string): Promise<{ success: boolean }> {
        await this.repository.setAvatar(citizenid, null);
        return { success: true };
    }

    // ---- Border ----

    async setBorder(citizenid: string, borderId: number | null): Promise<{ success: boolean; message?: string }> {
        if (borderId !== null) {
            const borders = await this.repository.getAllBorders();
            const exists = borders.some(b => b.id === borderId);
            if (!exists) {
                return { success: false, message: 'Bordure introuvable.' };
            }
        }
        await this.repository.setBorder(citizenid, borderId);
        return { success: true };
    }

    // ---- Profile Page (public) ----
    // targetIdentifier can be a citizenid OR a username — we resolve both

    async getProfilePage(citizenid: string, targetIdentifier: string): Promise<TcgProfilePage | null> {
        // Try as citizenid first
        let profile = await this.repository.getProfileFull(targetIdentifier);
        let resolvedCitizenid = targetIdentifier;

        // If not found, try as username
        if (!profile) {
            const byUsername = await this.repository.getProfileByUsername(targetIdentifier);
            if (!byUsername) return null;
            profile = await this.repository.getProfileFull(byUsername.citizenid);
            if (!profile) return null;
            resolvedCitizenid = byUsername.citizenid;
        } else {
            resolvedCitizenid = profile.citizenid;
        }

        const showcaseItems = await this.repository.getShowcaseByPlayer(resolvedCitizenid);
        const usernames = await this.repository.getUsernamesByCitizenIds([resolvedCitizenid]);
        const avatars = await this.repository.getAvatarsByCitizenIds([resolvedCitizenid]);

        const showcase: TcgShowcaseItem[] = showcaseItems.map(item => ({
            id: item.id,
            citizenid: item.citizenid,
            cardId: item.card_id,
            cardName: item.tcg_card.name,
            cardImage: item.tcg_card.image,
            cardArchetype: item.tcg_card.archetype ?? null,
            username: usernames[item.citizenid] ?? item.citizenid,
            avatar: avatars[item.citizenid] ?? null,
            description: item.description,
            createdAt: item.created_at.toISOString(),
        }));

        // Contact status
        const contactRelation = await this.repository.getContactRelation(citizenid, resolvedCitizenid);
        const isContact = contactRelation?.status === 'accepted';
        const hasPendingRequest = contactRelation?.status === 'pending';

        const isOwnProfile = citizenid === resolvedCitizenid;

        // ---- Badge computation ----
        const currentCardCount = await this.repository.getPlayerCardCount(resolvedCitizenid);
        const stats = await this.repository.getProfileStats(resolvedCitizenid);
        const uniquePartners = await this.repository.getUniqueTradePartnerCount(resolvedCitizenid);
        const setsSold = stats?.total_sets_sold ?? 0;

        const badgeDefs: Array<{ id: string; label: string; target: number; icon: string; category: 'collector' | 'trader' | 'merchant'; description: string; value: number }> = [
            { id: 'collector_20', label: 'Débutant', target: 20, icon: '🃏', category: 'collector', description: 'Posséder 20 cartes', value: currentCardCount },
            { id: 'collector_50', label: 'Amateur', target: 50, icon: '🎴', category: 'collector', description: 'Posséder 50 cartes', value: currentCardCount },
            { id: 'collector_100', label: 'Passionné', target: 100, icon: '🏆', category: 'collector', description: 'Posséder 100 cartes', value: currentCardCount },
            { id: 'collector_500', label: 'Légende', target: 500, icon: '👑', category: 'collector', description: 'Posséder 500 cartes', value: currentCardCount },
            { id: 'trader_10', label: 'Social', target: 10, icon: '🤝', category: 'trader', description: 'Échanger avec 10 joueurs différents', value: uniquePartners },
            { id: 'trader_25', label: 'Négociateur', target: 25, icon: '💼', category: 'trader', description: 'Échanger avec 25 joueurs différents', value: uniquePartners },
            { id: 'trader_100', label: 'Diplomate', target: 100, icon: '🌍', category: 'trader', description: 'Échanger avec 100 joueurs différents', value: uniquePartners },
            { id: 'merchant_1', label: 'Vendeur', target: 1, icon: '💰', category: 'merchant', description: 'Vendre 1 set', value: setsSold },
            { id: 'merchant_7', label: 'Commerçant', target: 7, icon: '🏪', category: 'merchant', description: 'Vendre 7 sets', value: setsSold },
            { id: 'merchant_25', label: 'Magnat', target: 25, icon: '💎', category: 'merchant', description: 'Vendre 25 sets', value: setsSold },
        ];

        const allBadges: TcgBadge[] = badgeDefs.map(b => ({
            id: b.id,
            label: b.label,
            description: b.description,
            icon: b.icon,
            image: TcgMigrationProvider.getBadgeImagePath(b.id),
            category: b.category,
            earned: b.value >= b.target,
            progress: Math.min(b.value, b.target),
            target: b.target,
        }));

        // For other players: only show the HIGHEST earned badge per category
        let badges: TcgBadge[];
        if (isOwnProfile) {
            badges = allBadges;
        } else {
            badges = [];
            const categories: Array<'collector' | 'trader' | 'merchant'> = ['collector', 'trader', 'merchant'];
            for (const cat of categories) {
                const catBadges = allBadges.filter(b => b.category === cat && b.earned);
                if (catBadges.length > 0) {
                    badges.push(catBadges[catBadges.length - 1]); // highest earned (last in order)
                }
            }
        }

        // Avatar & border
        const border: TcgBorderData | null = profile.tcg_border
            ? { id: profile.tcg_border.id, name: profile.tcg_border.name, image: profile.tcg_border.image }
            : null;

        // Available borders (only for own profile)
        const availableBorders: TcgBorderData[] = isOwnProfile
            ? await this.repository.getAllBorders()
            : [];

        return {
            citizenid: resolvedCitizenid,
            username: profile.username,
            bio: profile.bio ?? null,
            avatar: profile.avatar ?? null,
            border,
            showcase,
            badges,
            allBadges: isOwnProfile ? allBadges : undefined,
            isContact,
            hasPendingRequest,
            isOwnProfile,
            availableBorders,
        };
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
                obtainedCards.push({
                    id: uc.tcg_card.id,
                    name: uc.tcg_card.name,
                    image: uc.tcg_card.image,
                    archetype: uc.tcg_card.archetype ?? null,
                });
            } catch {
                // Race condition — card taken by someone else
            }
        }

        const newCount = claimedToday + obtainedCards.length;
        await this.repository.upsertDailyClaim(citizenid, today, newCount);

        if (obtainedCards.length > 0) {
            const player = this.playerService.getPlayerByCitizenId(citizenid);
            if (player) {
                this.playerHealthProvider.increaseStress(player.source, -2);
            }
            // Increment persistent counters per category
            try {
                const categoryCounts: Record<string, number> = {};
                for (const card of obtainedCards) {
                    const cat = getArchetypeCategory(card.archetype);
                    categoryCounts[cat] = (categoryCounts[cat] ?? 0) + 1;
                }
                for (const [cat, count] of Object.entries(categoryCounts)) {
                    await this.repository.incrementCardsObtained(citizenid, count, cat as any);
                }
            } catch { /* profile may not exist yet in edge cases */ }
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
        const showcaseItems = await this.repository.getShowcaseByPlayer(citizenid);
        const showcaseCardIds = new Set(showcaseItems.map(s => s.card_id));

        return userCards.map(uc => ({
            userCardId: uc.id,
            cardId: uc.tcg_card.id,
            name: uc.tcg_card.name,
            image: uc.tcg_card.image,
            archetype: uc.tcg_card.archetype ?? null,
            obtainedAt: uc.obtained_at.toISOString(),
            isShowcase: showcaseCardIds.has(uc.card_id),
            isProtected: uc.protected,
        }));
    }

    // ---- Toggle Protected ----

    async toggleProtected(citizenid: string, cardId: number): Promise<{ success: boolean; isProtected: boolean; message?: string }> {
        const owns = await this.repository.ownsCard(citizenid, cardId);
        if (!owns) return { success: false, isProtected: false, message: 'Tu ne possèdes pas cette carte.' };

        const currentlyProtected = await this.repository.isCardProtected(citizenid, cardId);
        const newValue = !currentlyProtected;
        await this.repository.toggleProtected(citizenid, cardId, newValue);

        return { success: true, isProtected: newValue };
    }

    // ---- Sell Set ----

    async sellSet(citizenid: string, archetype: string): Promise<TcgSellSetResult> {
        // Validate archetype
        if (!TCG_ARCHETYPES.includes(archetype as any)) {
            return { success: false, message: 'Archétype invalide.' };
        }

        // Get unprotected cards of this archetype
        const cards = await this.repository.getUnprotectedCardsByArchetype(citizenid, archetype);

        if (cards.length < TCG_SET_SIZE) {
            return {
                success: false,
                message: `Tu n'as pas assez de cartes ${archetype} non protégées (${cards.length}/${TCG_SET_SIZE}).`,
            };
        }

        // Pick TCG_SET_SIZE random cards from the unprotected ones
        const shuffled = [...cards].sort(() => Math.random() - 0.5);
        const toRelease = shuffled.slice(0, TCG_SET_SIZE);
        const cardIds = toRelease.map(c => c.card_id);

        // Safety check: verify none are in showcase
        for (const cardId of cardIds) {
            const inShowcase = await this.repository.isCardInShowcase(cardId);
            if (inShowcase) {
                await this.repository.removeShowcaseByCard(cardId);
            }
        }

        // Cancel pending trades involving these cards
        for (const cardId of cardIds) {
            await this.repository.cancelPendingTradesForCard(cardId);
        }

        // Release the cards (delete ownership — cards become available for daily claims again)
        const released = await this.repository.releaseCards(cardIds);

        // Increment persistent counter
        try {
            const category = getArchetypeCategory(archetype);
            await this.repository.incrementSetsSold(citizenid, category);
        } catch { /* ignore */ }

        // SMS confirmation
        const cardNames = toRelease.map(c => c.tcg_card.name).join(', ');
        await this.sendTcgSms(
            citizenid,
            `Set ${archetype} vendu ! ${released} carte(s) remises en circulation.`
        );

        return {
            success: true,
            message: `Set ${archetype} vendu ! ${released} carte(s) remises en circulation.`,
            releasedCount: released,
        };
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
        const avatars = await this.repository.getAvatarsByCitizenIds([...allCitizenIds]);

        return contacts.map(c => {
            const isSender = c.citizenid === citizenid;
            const otherId = isSender ? c.target_id : c.citizenid;
            return {
                id: c.id,
                citizenid: c.citizenid,
                targetId: c.target_id,
                displayName: usernames[otherId] ?? otherId,
                avatar: avatars[otherId] ?? null,
                status: c.status as TcgContact['status'],
                isSender,
                createdAt: c.created_at.toISOString(),
                message: c.message ?? undefined,
            };
        });
    }

    async sendContactRequest(citizenid: string, targetUsername: string, message?: string): Promise<TcgContactRequest> {
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

        await this.repository.createContactRequest(citizenid, targetId, message);
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
            archetype: uc.tcg_card.archetype ?? null,
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
            isReceiver: t.receiver_id === citizenid,
        }));
    }

    async respondTrade(citizenid: string, input: TcgRespondTradeInput): Promise<TcgTradeResult> {
        const trade = await this.repository.getTradeById(input.tradeId);
        if (!trade) return { success: false, message: 'Échange introuvable.' };
        if (trade.receiver_id !== citizenid) return { success: false, message: 'Tu n\'es pas le destinataire.' };
        if (trade.status !== 'pending') return { success: false, message: 'Cet échange n\'est plus en attente.' };

        if (input.action === 'refuse') {
            await this.repository.updateTradeStatus(trade.id, 'refused', input.message);

            // Notify the original sender via SMS
            const usernames = await this.repository.getUsernamesByCitizenIds([trade.sender_id, trade.receiver_id]);
            const receiverName = usernames[trade.receiver_id] ?? trade.receiver_id;
            const cardName = trade.requested_card?.name ?? 'inconnue';

            let smsText = `Votre demande d'échange pour la carte ${cardName} a été refusée par ${receiverName}.`;
            if (input.message) {
                smsText += ` Motif : "${input.message}"`;
            }
            await this.sendTcgSms(trade.sender_id, smsText);

            return { success: true, message: 'Échange refusé.' };
        }

        // Accept — execute the trade
        const receiverOwns = await this.repository.ownsCard(trade.receiver_id, trade.requested_card_id);
        if (!receiverOwns) return { success: false, message: 'Tu ne possèdes plus cette carte.' };

        if (trade.offer_type === 'card') {
            const senderOwns = await this.repository.ownsCard(trade.sender_id, trade.offer_card_id);
            if (!senderOwns) return { success: false, message: 'L\'autre joueur ne possède plus la carte proposée.' };
        }

        const usernames = await this.repository.getUsernamesByCitizenIds([trade.sender_id, trade.receiver_id]);
        const senderName = usernames[trade.sender_id] ?? trade.sender_id;
        const receiverName = usernames[trade.receiver_id] ?? trade.receiver_id;

        if (trade.offer_type === 'money') {
            const senderAccount = await this.getBankAccount(trade.sender_id);
            const receiverAccount = await this.getBankAccount(trade.receiver_id);

            if (!senderAccount || !receiverAccount) {
                return { success: false, message: 'Impossible de trouver les comptes bancaires.' };
            }

            const balance = await this.bankService.getAccountMoney(senderAccount);
            if (balance < trade.offer_amount) {
                await this.repository.updateTradeStatus(trade.id, 'cancelled');
                await this.sendTcgSms(
                    trade.sender_id,
                    `Votre demande d'échange pour la carte ${trade.requested_card.name} détenue par ${receiverName} a été annulée pour provision insuffisante.`
                );
                return { success: false, message: 'L\'échange a été annulé : le demandeur n\'a plus les fonds suffisants.' };
            }

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

            await this.repository.transferCard(trade.requested_card_id, trade.receiver_id, trade.sender_id);

            await this.sendTcgSms(
                trade.sender_id,
                `Votre demande d'échange pour la carte ${trade.requested_card.name} détenue par ${receiverName} a été acceptée.`
            );
            await this.sendTcgSms(
                trade.receiver_id,
                `L'échange de votre carte ${trade.requested_card.name} à ${senderName} vous a rapporté $${trade.offer_amount}.`
            );

        } else if (trade.offer_type === 'card') {
            await this.repository.transferCard(trade.requested_card_id, trade.receiver_id, trade.sender_id);
            await this.repository.transferCard(trade.offer_card_id, trade.sender_id, trade.receiver_id);

            await this.sendTcgSms(
                trade.sender_id,
                `Votre demande d'échange pour la carte ${trade.requested_card.name} détenue par ${receiverName} a été acceptée.`
            );
            await this.sendTcgSms(
                trade.receiver_id,
                `L'échange de votre carte ${trade.requested_card.name} à ${senderName} vous a rapporté la carte ${trade.offered_card?.name ?? 'inconnue'}.`
            );
        }

        await this.repository.removeShowcaseByCard(trade.requested_card_id);
        if (trade.offer_card_id) {
            await this.repository.removeShowcaseByCard(trade.offer_card_id);
        }

        await this.repository.cancelPendingTradesForCard(trade.requested_card_id, trade.id);
        if (trade.offer_card_id) {
            await this.repository.cancelPendingTradesForCard(trade.offer_card_id, trade.id);
        }

        await this.repository.updateTradeStatus(trade.id, 'accepted');

        // Increment persistent trade counters for both parties
        try {
            await this.repository.incrementTradesCompleted(trade.sender_id);
            await this.repository.incrementTradesCompleted(trade.receiver_id);
            await this.repository.recordTradePartner(trade.sender_id, trade.receiver_id);
        } catch { /* ignore if profile doesn't exist */ }

        // Increment cards obtained for the receiver of the card (sender gets the requested card)
        try {
            const requestedCategory = getArchetypeCategory(trade.requested_card.archetype ?? null);
            await this.repository.incrementCardsObtained(trade.sender_id, 1, requestedCategory);
            if (trade.offer_type === 'card' && trade.offered_card) {
                const offeredCategory = getArchetypeCategory(trade.offered_card.archetype ?? null);
                await this.repository.incrementCardsObtained(trade.receiver_id, 1, offeredCategory);
            }
        } catch { /* ignore */ }

        return { success: true, message: 'Échange effectué !' };
    }

    // ---- Showcase (Vitrine) ----

    async getShowcase(): Promise<TcgShowcaseItem[]> {
        const items = await this.repository.getShowcaseAll();

        const allCitizenIds = [...new Set(items.map(i => i.citizenid))];
        const usernames = await this.repository.getUsernamesByCitizenIds(allCitizenIds);
        const avatars = await this.repository.getAvatarsByCitizenIds(allCitizenIds);

        return items.map(item => ({
            id: item.id,
            citizenid: item.citizenid,
            cardId: item.card_id,
            cardName: item.tcg_card.name,
            cardImage: item.tcg_card.image,
            cardArchetype: item.tcg_card.archetype ?? null,
            username: usernames[item.citizenid] ?? item.citizenid,
            avatar: avatars[item.citizenid] ?? null,
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

    async cancelTrade(citizenid: string, tradeId: number): Promise<TcgTradeResult> {
        const trade = await this.repository.getTradeById(tradeId);
        if (!trade) return { success: false, message: 'Échange introuvable.' };
        if (trade.sender_id !== citizenid) return { success: false, message: 'Tu n\'es pas l\'expéditeur.' };
        if (trade.status !== 'pending') return { success: false, message: 'Cet échange n\'est plus en attente.' };

        await this.repository.updateTradeStatus(tradeId, 'cancelled');

        // Notify the receiver via SMS
        const usernames = await this.repository.getUsernamesByCitizenIds([trade.sender_id]);
        const senderName = usernames[trade.sender_id] ?? trade.sender_id;
        const cardName = trade.requested_card?.name ?? 'inconnue';
        await this.sendTcgSms(trade.receiver_id, `${senderName} a annulé sa demande d'échange pour votre carte ${cardName}.`);

        return { success: true, message: 'Échange annulé.' };
    }
}