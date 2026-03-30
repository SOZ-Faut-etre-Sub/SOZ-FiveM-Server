import { Provider } from '@public/core/decorators/provider';

import { Inject } from '../../core/decorators/injectable';
import { Rpc } from '../../core/decorators/rpc';
import { RpcServerEvent } from '../../shared/rpc';
import { TcgCreateTradeInput, TcgRespondTradeInput, TcgWeeklyPackResult, TcgWeeklyPackStatus, TcgMarketPrice } from '../../shared/tcg/tcg.types';
import { PlayerService } from '../player/player.service';
import { TcgService } from './tcg.service';

@Provider()
export class TcgProvider {
    @Inject(PlayerService)
    private readonly playerService: PlayerService;

    @Inject(TcgService)
    private readonly tcgService: TcgService;

    private getCitizenId(source: number): string | null {
        return this.playerService.getPlayer(source)?.citizenid ?? null;
    }

    // ---- Profile ----

    @Rpc(RpcServerEvent.PHONE_APP_TCG_GET_PROFILE)
    async getProfile(source: number) {
        const cid = this.getCitizenId(source);
        if (!cid) return { success: false };
        return this.tcgService.getProfile(cid);
    }

    @Rpc(RpcServerEvent.PHONE_APP_TCG_SET_USERNAME)
    async setUsername(source: number, username: string) {
        const cid = this.getCitizenId(source);
        if (!cid) return { success: false, message: 'Joueur introuvable.' };
        return this.tcgService.setUsername(cid, username);
    }

    @Rpc(RpcServerEvent.PHONE_APP_TCG_SET_BIO)
    async setBio(source: number, bio: string) {
        const cid = this.getCitizenId(source);
        if (!cid) return { success: false, message: 'Joueur introuvable.' };
        return this.tcgService.setBio(cid, bio);
    }

    // ---- Profile Page ----

    @Rpc(RpcServerEvent.PHONE_APP_TCG_GET_PROFILE_PAGE)
    async getProfilePage(source: number, targetCitizenid: string) {
        const cid = this.getCitizenId(source);
        if (!cid) return null;
        return this.tcgService.getProfilePage(cid, targetCitizenid);
    }

    // ---- Cards ----

    @Rpc(RpcServerEvent.PHONE_APP_TCG_GET_DAILY_STATUS)
    async getDailyStatus(source: number) {
        const cid = this.getCitizenId(source);
        if (!cid) return null;
        return this.tcgService.getDailyStatus(cid);
    }

    @Rpc(RpcServerEvent.PHONE_APP_TCG_CLAIM_DAILY_CARDS)
    async claimDailyCards(source: number) {
        const cid = this.getCitizenId(source);
        if (!cid) return { success: false, cards: [], remainingToday: 0, message: 'Joueur introuvable.' };
        return this.tcgService.claimDailyCards(cid);
    }

    @Rpc(RpcServerEvent.PHONE_APP_TCG_GET_COLLECTION)
    async getCollection(source: number) {
        const cid = this.getCitizenId(source);
        if (!cid) return [];
        return this.tcgService.getCollection(cid);
    }

    // ---- Protected ----

    @Rpc(RpcServerEvent.PHONE_APP_TCG_TOGGLE_PROTECTED)
    async toggleProtected(source: number, cardId: number) {
        const cid = this.getCitizenId(source);
        if (!cid) return { success: false, isProtected: false, message: 'Joueur introuvable.' };
        return this.tcgService.toggleProtected(cid, cardId);
    }

    // ---- Sell Set ----

    @Rpc(RpcServerEvent.PHONE_APP_TCG_SELL_SET)
    async sellSet(source: number, archetype: string) {
        const cid = this.getCitizenId(source);
        if (!cid) return { success: false, message: 'Joueur introuvable.' };
        return this.tcgService.sellSet(cid, archetype);
    }

    // ---- Contacts ----

    @Rpc(RpcServerEvent.PHONE_APP_TCG_GET_CONTACTS)
    async getContacts(source: number) {
        const cid = this.getCitizenId(source);
        if (!cid) return [];
        return this.tcgService.getContacts(cid);
    }

    @Rpc(RpcServerEvent.PHONE_APP_TCG_SEND_CONTACT_REQUEST)
    async sendContactRequest(source: number, targetUsername: string, message?: string) {
        const cid = this.getCitizenId(source);
        if (!cid) return { success: false, message: 'Joueur introuvable.' };
        return this.tcgService.sendContactRequest(cid, targetUsername, message);
    }

    @Rpc(RpcServerEvent.PHONE_APP_TCG_ACCEPT_CONTACT)
    async acceptContact(source: number, contactId: number) {
        const cid = this.getCitizenId(source);
        if (!cid) return { success: false, message: 'Joueur introuvable.' };
        return this.tcgService.acceptContact(cid, contactId);
    }

    @Rpc(RpcServerEvent.PHONE_APP_TCG_REJECT_CONTACT)
    async rejectContact(source: number, contactId: number) {
        const cid = this.getCitizenId(source);
        if (!cid) return { success: false, message: 'Joueur introuvable.' };
        return this.tcgService.rejectContact(cid, contactId);
    }

    @Rpc(RpcServerEvent.PHONE_APP_TCG_REMOVE_CONTACT)
    async removeContact(source: number, contactId: number) {
        const cid = this.getCitizenId(source);
        if (!cid) return { success: false, message: 'Joueur introuvable.' };
        return this.tcgService.removeContact(cid, contactId);
    }

    @Rpc(RpcServerEvent.PHONE_APP_TCG_GET_CONTACT_COLLECTION)
    async getContactCollection(source: number, targetId: string) {
        const cid = this.getCitizenId(source);
        if (!cid) return null;
        return this.tcgService.getContactCollection(cid, targetId);
    }

    // ---- Trade ----

    @Rpc(RpcServerEvent.PHONE_APP_TCG_CREATE_TRADE)
    async createTrade(source: number, input: TcgCreateTradeInput) {
        const cid = this.getCitizenId(source);
        if (!cid) return { success: false, message: 'Joueur introuvable.' };
        return this.tcgService.createTrade(cid, input);
    }

    @Rpc(RpcServerEvent.PHONE_APP_TCG_GET_TRADES)
    async getTrades(source: number) {
        const cid = this.getCitizenId(source);
        if (!cid) return [];
        return this.tcgService.getTrades(cid);
    }

    @Rpc(RpcServerEvent.PHONE_APP_TCG_RESPOND_TRADE)
    async respondTrade(source: number, input: TcgRespondTradeInput) {
        const cid = this.getCitizenId(source);
        if (!cid) return { success: false, message: 'Joueur introuvable.' };
        return this.tcgService.respondTrade(cid, input);
    }

    @Rpc(RpcServerEvent.PHONE_APP_TCG_CANCEL_TRADE)
    async cancelTrade(source: number, tradeId: number) {
        const cid = this.getCitizenId(source);
        if (!cid) return { success: false, message: 'Joueur introuvable.' };
        return this.tcgService.cancelTrade(cid, tradeId);
    }

    // ---- Showcase ----

    @Rpc(RpcServerEvent.PHONE_APP_TCG_GET_SHOWCASE)
    async getShowcase() {
        return this.tcgService.getShowcase();
    }

    @Rpc(RpcServerEvent.PHONE_APP_TCG_ADD_SHOWCASE)
    async addShowcase(source: number, data: { cardId: number; description: string }) {
        const cid = this.getCitizenId(source);
        if (!cid) return { success: false, message: 'Joueur introuvable.' };
        return this.tcgService.addShowcase(cid, data.cardId, data.description);
    }

    @Rpc(RpcServerEvent.PHONE_APP_TCG_REMOVE_SHOWCASE)
    async removeShowcase(source: number, cardId: number) {
        const cid = this.getCitizenId(source);
        if (!cid) return { success: false, message: 'Joueur introuvable.' };
        return this.tcgService.removeShowcase(cid, cardId);
    }
	
	@Rpc(RpcServerEvent.PHONE_APP_TCG_SHOWCASE_RELAX)
    async showcaseRelax(source: number) {
        const cid = this.getCitizenId(source);
        if (!cid) return { success: false };
        return this.tcgService.showcaseRelax(source, cid);
    }

    @Rpc(RpcServerEvent.PHONE_APP_TCG_SET_AVATAR)
    async setAvatar(source: number, avatar: string) {
        const cid = this.getCitizenId(source);
        if (!cid) return { success: false, message: 'Joueur introuvable.' };
        return this.tcgService.setAvatar(cid, avatar);
    }

    @Rpc(RpcServerEvent.PHONE_APP_TCG_REMOVE_AVATAR)
    async removeAvatar(source: number) {
        const cid = this.getCitizenId(source);
        if (!cid) return { success: false, message: 'Joueur introuvable.' };
        return this.tcgService.removeAvatar(cid);
    }

    @Rpc(RpcServerEvent.PHONE_APP_TCG_SET_BORDER)
    async setBorder(source: number, borderId: number | null) {
        const cid = this.getCitizenId(source);
        if (!cid) return { success: false, message: 'Joueur introuvable.' };
        return this.tcgService.setBorder(cid, borderId);
    }

    // ---- Weekly Pack ----

    @Rpc(RpcServerEvent.PHONE_APP_TCG_GET_WEEKLY_PACK_STATUS)
    async getWeeklyPackStatus(source: number) {
        const cid = this.getCitizenId(source);
        if (!cid) return null;
        return this.tcgService.getWeeklyPackStatus(cid);
    }

    @Rpc(RpcServerEvent.PHONE_APP_TCG_BUY_WEEKLY_PACK)
    async buyWeeklyPack(source: number) {
        const cid = this.getCitizenId(source);
        if (!cid) return { success: false, cards: [], message: 'Joueur introuvable.' };
        return this.tcgService.buyWeeklyPack(cid);
    }

    // ---- Market (Cours) ----

    @Rpc(RpcServerEvent.PHONE_APP_TCG_GET_MARKET_PRICES)
    async getMarketPrices() {
        return this.tcgService.getMarketPrices();
    }

    @Rpc(RpcServerEvent.PHONE_APP_TCG_GET_SHOWCASE_CONTACTS)
    async getShowcaseContacts(source: number) {
        const cid = this.getCitizenId(source);
        if (!cid) return [];
        return this.tcgService.getShowcaseContacts(cid);
    }
}
