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
    TcgProfileResult,
    TcgRespondTradeInput,
    TcgShowcaseItem,
    TcgShowcaseResult,
    TcgTradeOffer,
    TcgTradeResult,
    TcgWallpaperResult,
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

    // ---- Wallpaper ----

    @OnNuiEvent(NuiEvent.PhoneAppTcgGetWallpaper)
    async getWallpaper(): Promise<TcgWallpaperResult> {
        return await emitRpc<TcgWallpaperResult>(RpcServerEvent.PHONE_APP_TCG_GET_WALLPAPER);
    }

    @OnNuiEvent(NuiEvent.PhoneAppTcgSetWallpaper)
    async setWallpaper({ cardId }: { cardId: number }): Promise<TcgWallpaperResult> {
        return await emitRpc<TcgWallpaperResult>(RpcServerEvent.PHONE_APP_TCG_SET_WALLPAPER, cardId);
    }

    @OnNuiEvent(NuiEvent.PhoneAppTcgRemoveWallpaper)
    async removeWallpaper(): Promise<TcgWallpaperResult> {
        return await emitRpc<TcgWallpaperResult>(RpcServerEvent.PHONE_APP_TCG_REMOVE_WALLPAPER);
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
}

