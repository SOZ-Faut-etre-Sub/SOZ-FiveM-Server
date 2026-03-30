import { Provider } from '@public/core/decorators/provider';

import { OnNuiEvent } from '../../../core/decorators/event';
import { emitRpc } from '../../../core/rpc';
import { NuiEvent } from '../../../shared/event/nui';
import { RpcServerEvent } from '../../../shared/rpc';
import {
    TcgClaimResult,
    TcgCollectionCard,
    TcgContact,
    TcgContactCollectionCard,
    TcgContactRequest,
    TcgCreateTradeInput,
    TcgDailyStatus,
    TcgProfilePage,
    TcgProfileResult,
    TcgRespondTradeInput,
    TcgSellSetResult,
    TcgShowcaseItem,
    TcgShowcaseResult,
    TcgTradeOffer,
    TcgTradeResult,
    TcgWeeklyPackResult,
    TcgWeeklyPackStatus,
    TcgMarketPrice,
} from '../../../shared/tcg/tcg.types';

@Provider()
export class PhoneAppTcgProvider {
    // ---- Profile ----

    @OnNuiEvent(NuiEvent.PhoneAppTcgGetProfile)
    async getProfile(): Promise<TcgProfileResult> {
        return await emitRpc<TcgProfileResult>(RpcServerEvent.PHONE_APP_TCG_GET_PROFILE);
    }

    @OnNuiEvent(NuiEvent.PhoneAppTcgSetUsername)
    async setUsername({ username }: { username: string }): Promise<TcgProfileResult> {
        return await emitRpc<TcgProfileResult>(RpcServerEvent.PHONE_APP_TCG_SET_USERNAME, username);
    }

    @OnNuiEvent(NuiEvent.PhoneAppTcgSetBio)
    async setBio({ bio }: { bio: string }): Promise<{ success: boolean; message?: string }> {
        return await emitRpc<{ success: boolean; message?: string }>(RpcServerEvent.PHONE_APP_TCG_SET_BIO, bio);
    }

    // ---- Profile Page ----

    @OnNuiEvent(NuiEvent.PhoneAppTcgGetProfilePage)
    async getProfilePage({ targetCitizenid }: { targetCitizenid: string }): Promise<TcgProfilePage | null> {
        return await emitRpc<TcgProfilePage | null>(RpcServerEvent.PHONE_APP_TCG_GET_PROFILE_PAGE, targetCitizenid);
    }

    // ---- Cards ----

    @OnNuiEvent(NuiEvent.PhoneAppTcgGetDailyStatus)
    async getDailyStatus(): Promise<TcgDailyStatus> {
        return await emitRpc<TcgDailyStatus>(RpcServerEvent.PHONE_APP_TCG_GET_DAILY_STATUS);
    }

    @OnNuiEvent(NuiEvent.PhoneAppTcgClaimDailyCards)
    async claimDailyCards(): Promise<TcgClaimResult> {
        return await emitRpc<TcgClaimResult>(RpcServerEvent.PHONE_APP_TCG_CLAIM_DAILY_CARDS);
    }

    @OnNuiEvent(NuiEvent.PhoneAppTcgGetCollection)
    async getCollection(): Promise<TcgCollectionCard[]> {
        return await emitRpc<TcgCollectionCard[]>(RpcServerEvent.PHONE_APP_TCG_GET_COLLECTION);
    }

    // ---- Protected ----

    @OnNuiEvent(NuiEvent.PhoneAppTcgToggleProtected)
    async toggleProtected({ cardId }: { cardId: number }): Promise<{ success: boolean; isProtected: boolean; message?: string }> {
        return await emitRpc<{ success: boolean; isProtected: boolean; message?: string }>(RpcServerEvent.PHONE_APP_TCG_TOGGLE_PROTECTED, cardId);
    }

    // ---- Sell Set ----

    @OnNuiEvent(NuiEvent.PhoneAppTcgSellSet)
    async sellSet({ archetype }: { archetype: string }): Promise<TcgSellSetResult> {
        return await emitRpc<TcgSellSetResult>(RpcServerEvent.PHONE_APP_TCG_SELL_SET, archetype);
    }

    // ---- Contacts ----

    @OnNuiEvent(NuiEvent.PhoneAppTcgGetContacts)
    async getContacts(): Promise<TcgContact[]> {
        return await emitRpc<TcgContact[]>(RpcServerEvent.PHONE_APP_TCG_GET_CONTACTS);
    }

    @OnNuiEvent(NuiEvent.PhoneAppTcgSendContactRequest)
    async sendContactRequest({ targetUsername, message }: { targetUsername: string; message?: string }): Promise<TcgContactRequest> {
        return await emitRpc<TcgContactRequest>(RpcServerEvent.PHONE_APP_TCG_SEND_CONTACT_REQUEST, targetUsername, message);
    }

    @OnNuiEvent(NuiEvent.PhoneAppTcgAcceptContact)
    async acceptContact({ contactId }: { contactId: number }): Promise<TcgContactRequest> {
        return await emitRpc<TcgContactRequest>(RpcServerEvent.PHONE_APP_TCG_ACCEPT_CONTACT, contactId);
    }

    @OnNuiEvent(NuiEvent.PhoneAppTcgRejectContact)
    async rejectContact({ contactId }: { contactId: number }): Promise<TcgContactRequest> {
        return await emitRpc<TcgContactRequest>(RpcServerEvent.PHONE_APP_TCG_REJECT_CONTACT, contactId);
    }

    @OnNuiEvent(NuiEvent.PhoneAppTcgRemoveContact)
    async removeContact({ contactId }: { contactId: number }): Promise<TcgContactRequest> {
        return await emitRpc<TcgContactRequest>(RpcServerEvent.PHONE_APP_TCG_REMOVE_CONTACT, contactId);
    }

    @OnNuiEvent(NuiEvent.PhoneAppTcgGetContactCollection)
    async getContactCollection({ targetId }: { targetId: string }): Promise<TcgContactCollectionCard[]> {
        return await emitRpc<TcgContactCollectionCard[]>(RpcServerEvent.PHONE_APP_TCG_GET_CONTACT_COLLECTION, targetId);
    }

    // ---- Trade ----

    @OnNuiEvent(NuiEvent.PhoneAppTcgCreateTrade)
    async createTrade(input: TcgCreateTradeInput): Promise<TcgTradeResult> {
        return await emitRpc<TcgTradeResult>(RpcServerEvent.PHONE_APP_TCG_CREATE_TRADE, input);
    }

    @OnNuiEvent(NuiEvent.PhoneAppTcgGetTrades)
    async getTrades(): Promise<TcgTradeOffer[]> {
        return await emitRpc<TcgTradeOffer[]>(RpcServerEvent.PHONE_APP_TCG_GET_TRADES);
    }

    @OnNuiEvent(NuiEvent.PhoneAppTcgRespondTrade)
    async respondTrade(input: TcgRespondTradeInput): Promise<TcgTradeResult> {
        return await emitRpc<TcgTradeResult>(RpcServerEvent.PHONE_APP_TCG_RESPOND_TRADE, input);
    }

    @OnNuiEvent(NuiEvent.PhoneAppTcgCancelTrade)
    async cancelTrade({ tradeId }: { tradeId: number }): Promise<TcgTradeResult> {
        return await emitRpc<TcgTradeResult>(RpcServerEvent.PHONE_APP_TCG_CANCEL_TRADE, tradeId);
    }

    // ---- Showcase ----

    @OnNuiEvent(NuiEvent.PhoneAppTcgGetShowcase)
    async getShowcase(): Promise<TcgShowcaseItem[]> {
        return await emitRpc<TcgShowcaseItem[]>(RpcServerEvent.PHONE_APP_TCG_GET_SHOWCASE);
    }

    @OnNuiEvent(NuiEvent.PhoneAppTcgAddShowcase)
    async addShowcase(data: { cardId: number; description: string }): Promise<TcgShowcaseResult> {
        return await emitRpc<TcgShowcaseResult>(RpcServerEvent.PHONE_APP_TCG_ADD_SHOWCASE, data);
    }

    @OnNuiEvent(NuiEvent.PhoneAppTcgRemoveShowcase)
    async removeShowcase({ cardId }: { cardId: number }): Promise<TcgShowcaseResult> {
        return await emitRpc<TcgShowcaseResult>(RpcServerEvent.PHONE_APP_TCG_REMOVE_SHOWCASE, cardId);
    }
	
	@OnNuiEvent(NuiEvent.PhoneAppTcgShowcaseRelax)
    async showcaseRelax(): Promise<void> {
        await emitRpc(RpcServerEvent.PHONE_APP_TCG_SHOWCASE_RELAX);
    }

    // ---- Avatar & Border ----

    @OnNuiEvent(NuiEvent.PhoneAppTcgSetAvatar)
    async setAvatar({ avatar }: { avatar: string }): Promise<{ success: boolean; avatar?: string; message?: string }> {
        return await emitRpc<{ success: boolean; avatar?: string; message?: string }>(RpcServerEvent.PHONE_APP_TCG_SET_AVATAR, avatar);
    }

    @OnNuiEvent(NuiEvent.PhoneAppTcgRemoveAvatar)
    async removeAvatar(): Promise<{ success: boolean }> {
        return await emitRpc<{ success: boolean }>(RpcServerEvent.PHONE_APP_TCG_REMOVE_AVATAR);
    }

    @OnNuiEvent(NuiEvent.PhoneAppTcgSetBorder)
    async setBorder({ borderId }: { borderId: number | null }): Promise<{ success: boolean; message?: string }> {
        return await emitRpc<{ success: boolean; message?: string }>(RpcServerEvent.PHONE_APP_TCG_SET_BORDER, borderId);
    }

    // ---- Weekly Pack ----

    @OnNuiEvent(NuiEvent.PhoneAppTcgGetWeeklyPackStatus)
    async getWeeklyPackStatus(): Promise<TcgWeeklyPackStatus> {
        return await emitRpc<TcgWeeklyPackStatus>(RpcServerEvent.PHONE_APP_TCG_GET_WEEKLY_PACK_STATUS);
    }

    @OnNuiEvent(NuiEvent.PhoneAppTcgBuyWeeklyPack)
    async buyWeeklyPack(): Promise<TcgWeeklyPackResult> {
        return await emitRpc<TcgWeeklyPackResult>(RpcServerEvent.PHONE_APP_TCG_BUY_WEEKLY_PACK);
    }

    // ---- Market (Cours) ----

    @OnNuiEvent(NuiEvent.PhoneAppTcgGetMarketPrices)
    async getMarketPrices(): Promise<TcgMarketPrice[]> {
        return await emitRpc<TcgMarketPrice[]>(RpcServerEvent.PHONE_APP_TCG_GET_MARKET_PRICES);
    }

    @OnNuiEvent(NuiEvent.PhoneAppTcgGetShowcaseContacts)
    async getShowcaseContacts(): Promise<TcgShowcaseItem[]> {
        return await emitRpc<TcgShowcaseItem[]>(RpcServerEvent.PHONE_APP_TCG_GET_SHOWCASE_CONTACTS);
    }
}
