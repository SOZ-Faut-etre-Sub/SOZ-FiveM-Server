import { useCallback, useState } from 'react';

import { NuiEvent } from '../../../../../../shared/event/nui';
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
    TcgWeeklyPackStatus,
    TcgWeeklyPackResult,
    TcgMarketPrice,
} from '../../../../../../shared/tcg/tcg.types';
import { fetchNui } from '../../../../../fetch';

// ---- Profile ----

export function useTcgProfile() {
    const [profile, setProfile] = useState<TcgProfileResult | null>(null);
    const [loading, setLoading] = useState(false);

    const refresh = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetchNui<void, TcgProfileResult>(NuiEvent.PhoneAppTcgGetProfile);
            setProfile(res);
        } catch (e) {
            console.error('[TCG] getProfile error', e);
        } finally {
            setLoading(false);
        }
    }, []);

    const setUsername = useCallback(async (username: string): Promise<TcgProfileResult | null> => {
        setLoading(true);
        try {
            const res = await fetchNui<{ username: string }, TcgProfileResult>(NuiEvent.PhoneAppTcgSetUsername, { username });
            if (res?.success) setProfile(res);
            return res;
        } catch (e) {
            console.error('[TCG] setUsername error', e);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return { profile, loading, refresh, setUsername };
}

// ---- Profile Page ----

export function useTcgProfilePage() {
    const [profilePage, setProfilePage] = useState<TcgProfilePage | null>(null);
    const [loading, setLoading] = useState(false);

    const fetch = useCallback(async (targetCitizenid: string) => {
        setLoading(true);
        try {
            const res = await fetchNui<{ targetCitizenid: string }, TcgProfilePage | null>(NuiEvent.PhoneAppTcgGetProfilePage, { targetCitizenid });
            setProfilePage(res);
        } catch (e) {
            console.error('[TCG] getProfilePage error', e);
        } finally {
            setLoading(false);
        }
    }, []);

    return { profilePage, loading, fetch };
}

// ---- Set Bio ----

export function useTcgSetBio() {
    const [loading, setLoading] = useState(false);

    const setBio = useCallback(async (bio: string): Promise<{ success: boolean; message?: string } | null> => {
        setLoading(true);
        try {
            return await fetchNui<{ bio: string }, { success: boolean; message?: string }>(NuiEvent.PhoneAppTcgSetBio, { bio });
        } catch (e) {
            console.error('[TCG] setBio error', e);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return { loading, setBio };
}

// ---- Daily status ----

export function useTcgDailyStatus() {
    const [status, setStatus] = useState<TcgDailyStatus | null>(null);
    const [loading, setLoading] = useState(false);

    const refresh = useCallback(async () => {
        setLoading(true);
        try {
            const result = await fetchNui<void, TcgDailyStatus>(NuiEvent.PhoneAppTcgGetDailyStatus);
            setStatus(result);
        } catch (e) {
            console.error('[TCG] getDailyStatus error', e);
        } finally {
            setLoading(false);
        }
    }, []);

    return { status, loading, refresh };
}

// ---- Claim ----

export function useTcgClaim() {
    const [result, setResult] = useState<TcgClaimResult | null>(null);
    const [loading, setLoading] = useState(false);

    const claim = useCallback(async (): Promise<TcgClaimResult | null> => {
        setLoading(true);
        try {
            const res = await fetchNui<void, TcgClaimResult>(NuiEvent.PhoneAppTcgClaimDailyCards);
            setResult(res);
            return res;
        } catch (e) {
            console.error('[TCG] claimDailyCards error', e);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return { result, loading, claim };
}

// ---- Collection ----

export function useTcgCollection() {
    const [collection, setCollection] = useState<TcgCollectionCard[]>([]);
    const [loading, setLoading] = useState(false);

    const refresh = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetchNui<void, TcgCollectionCard[]>(NuiEvent.PhoneAppTcgGetCollection);
            setCollection(res ?? []);
        } catch (e) {
            console.error('[TCG] getCollection error', e);
        } finally {
            setLoading(false);
        }
    }, []);

    return { collection, loading, refresh };
}

// ---- Toggle Protected ----

export function useTcgToggleProtected() {
    const [loading, setLoading] = useState(false);

    const toggle = useCallback(async (cardId: number): Promise<{ success: boolean; isProtected: boolean; message?: string } | null> => {
        setLoading(true);
        try {
            return await fetchNui<{ cardId: number }, { success: boolean; isProtected: boolean; message?: string }>(NuiEvent.PhoneAppTcgToggleProtected, { cardId });
        } catch (e) {
            console.error('[TCG] toggleProtected error', e);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return { loading, toggle };
}

// ---- Sell Set ----

export function useTcgSellSet() {
    const [loading, setLoading] = useState(false);

    const sellSet = useCallback(async (archetype: string): Promise<TcgSellSetResult | null> => {
        setLoading(true);
        try {
            return await fetchNui<{ archetype: string }, TcgSellSetResult>(NuiEvent.PhoneAppTcgSellSet, { archetype });
        } catch (e) {
            console.error('[TCG] sellSet error', e);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return { loading, sellSet };
}

// ---- Contacts ----

export function useTcgContacts() {
    const [contacts, setContacts] = useState<TcgContact[]>([]);
    const [loading, setLoading] = useState(false);

    const refresh = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetchNui<void, TcgContact[]>(NuiEvent.PhoneAppTcgGetContacts);
            setContacts(res ?? []);
        } catch (e) {
            console.error('[TCG] getContacts error', e);
        } finally {
            setLoading(false);
        }
    }, []);

    const sendRequest = useCallback(async (targetUsername: string, message?: string): Promise<TcgContactRequest | null> => {
        try {
            return await fetchNui<{ targetUsername: string; message?: string }, TcgContactRequest>(NuiEvent.PhoneAppTcgSendContactRequest, { targetUsername, message });
        } catch (e) {
            return null;
        }
    }, []);

    const acceptContact = useCallback(async (contactId: number): Promise<TcgContactRequest | null> => {
        try {
            return await fetchNui<{ contactId: number }, TcgContactRequest>(NuiEvent.PhoneAppTcgAcceptContact, { contactId });
        } catch (e) {
            return null;
        }
    }, []);

    const rejectContact = useCallback(async (contactId: number): Promise<TcgContactRequest | null> => {
        try {
            return await fetchNui<{ contactId: number }, TcgContactRequest>(NuiEvent.PhoneAppTcgRejectContact, { contactId });
        } catch (e) {
            return null;
        }
    }, []);

    const removeContact = useCallback(async (contactId: number): Promise<TcgContactRequest | null> => {
        try {
            return await fetchNui<{ contactId: number }, TcgContactRequest>(NuiEvent.PhoneAppTcgRemoveContact, { contactId });
        } catch (e) {
            return null;
        }
    }, []);

    return { contacts, loading, refresh, sendRequest, acceptContact, rejectContact, removeContact };
}

// ---- Contact collection ----

export function useTcgContactCollection() {
    const [collection, setCollection] = useState<TcgContactCollectionCard[]>([]);
    const [loading, setLoading] = useState(false);

    const fetch = useCallback(async (targetId: string) => {
        setLoading(true);
        try {
            const res = await fetchNui<{ targetId: string }, TcgContactCollectionCard[]>(NuiEvent.PhoneAppTcgGetContactCollection, { targetId });
            setCollection(res ?? []);
        } catch (e) {
            console.error('[TCG] getContactCollection error', e);
        } finally {
            setLoading(false);
        }
    }, []);

    return { collection, loading, fetch };
}

// ---- Trade ----

export function useTcgTrades() {
    const [trades, setTrades] = useState<TcgTradeOffer[]>([]);
    const [loading, setLoading] = useState(false);

    const refresh = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetchNui<void, TcgTradeOffer[]>(NuiEvent.PhoneAppTcgGetTrades);
            setTrades(res ?? []);
        } catch (e) {
            console.error('[TCG] getTrades error', e);
        } finally {
            setLoading(false);
        }
    }, []);

    const createTrade = useCallback(async (input: TcgCreateTradeInput): Promise<TcgTradeResult | null> => {
        try {
            return await fetchNui<TcgCreateTradeInput, TcgTradeResult>(NuiEvent.PhoneAppTcgCreateTrade, input);
        } catch (e) {
            return null;
        }
    }, []);

    const respondTrade = useCallback(async (input: TcgRespondTradeInput): Promise<TcgTradeResult | null> => {
        try {
            return await fetchNui<TcgRespondTradeInput, TcgTradeResult>(NuiEvent.PhoneAppTcgRespondTrade, input);
        } catch (e) {
            return null;
        }
    }, []);

    const cancelTrade = useCallback(async (tradeId: number): Promise<TcgTradeResult | null> => {
        try {
            return await fetchNui<{ tradeId: number }, TcgTradeResult>(NuiEvent.PhoneAppTcgCancelTrade, { tradeId });
        } catch (e) {
            return null;
        }
    }, []);

    return { trades, loading, refresh, createTrade, respondTrade, cancelTrade };
}

// ---- Showcase ----

export function useTcgShowcase() {
    const [items, setItems] = useState<TcgShowcaseItem[]>([]);
    const [loading, setLoading] = useState(false);

    const refresh = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetchNui<void, TcgShowcaseItem[]>(NuiEvent.PhoneAppTcgGetShowcase);
            setItems(res ?? []);
        } catch (e) {
            console.error('[TCG] getShowcase error', e);
        } finally {
            setLoading(false);
        }
    }, []);

    const addShowcase = useCallback(async (cardId: number, description: string): Promise<TcgShowcaseResult | null> => {
        try {
            return await fetchNui<{ cardId: number; description: string }, TcgShowcaseResult>(NuiEvent.PhoneAppTcgAddShowcase, { cardId, description });
        } catch (e) {
            return null;
        }
    }, []);

    const removeShowcase = useCallback(async (cardId: number): Promise<TcgShowcaseResult | null> => {
        try {
            return await fetchNui<{ cardId: number }, TcgShowcaseResult>(NuiEvent.PhoneAppTcgRemoveShowcase, { cardId });
        } catch (e) {
            return null;
        }
    }, []);

    return { items, loading, refresh, addShowcase, removeShowcase };
}

// ---- Avatar ----

export function useTcgSetAvatar() {
    const [loading, setLoading] = useState(false);

    const setAvatar = useCallback(async (avatar: string): Promise<{ success: boolean; avatar?: string; message?: string } | null> => {
        setLoading(true);
        try {
            return await fetchNui<{ avatar: string }, { success: boolean; avatar?: string; message?: string }>(NuiEvent.PhoneAppTcgSetAvatar, { avatar });
        } catch (e) {
            console.error('[TCG] setAvatar error', e);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const removeAvatar = useCallback(async (): Promise<{ success: boolean } | null> => {
        setLoading(true);
        try {
            return await fetchNui<void, { success: boolean }>(NuiEvent.PhoneAppTcgRemoveAvatar);
        } catch (e) {
            console.error('[TCG] removeAvatar error', e);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return { loading, setAvatar, removeAvatar };
}

// ---- Border ----

export function useTcgSetBorder() {
    const [loading, setLoading] = useState(false);

    const setBorder = useCallback(async (borderId: number | null): Promise<{ success: boolean; message?: string } | null> => {
        setLoading(true);
        try {
            return await fetchNui<{ borderId: number | null }, { success: boolean; message?: string }>(NuiEvent.PhoneAppTcgSetBorder, { borderId });
        } catch (e) {
            console.error('[TCG] setBorder error', e);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return { loading, setBorder };
}

// ---- Showcase (contacts only) ----

export function useTcgShowcaseContacts() {
    const [items, setItems] = useState<TcgShowcaseItem[]>([]);
    const [loading, setLoading] = useState(false);

    const refresh = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetchNui<void, TcgShowcaseItem[]>(NuiEvent.PhoneAppTcgGetShowcaseContacts);
            setItems(res ?? []);
        } catch (e) {
            console.error('[TCG] getShowcaseContacts error', e);
        } finally {
            setLoading(false);
        }
    }, []);

    return { items, loading, refresh };
}

// ---- Weekly Pack ----

export function useTcgWeeklyPack() {
    const [status, setStatus] = useState<TcgWeeklyPackStatus | null>(null);
    const [loading, setLoading] = useState(false);

    const refresh = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetchNui<void, TcgWeeklyPackStatus>(NuiEvent.PhoneAppTcgGetWeeklyPackStatus);
            setStatus(res);
        } catch (e) {
            console.error('[TCG] getWeeklyPackStatus error', e);
        } finally {
            setLoading(false);
        }
    }, []);

    const buy = useCallback(async (): Promise<TcgWeeklyPackResult | null> => {
        setLoading(true);
        try {
            return await fetchNui<void, TcgWeeklyPackResult>(NuiEvent.PhoneAppTcgBuyWeeklyPack);
        } catch (e) {
            console.error('[TCG] buyWeeklyPack error', e);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return { status, loading, refresh, buy };
}

// ---- Market (Cours) ----

export function useTcgMarket() {
    const [prices, setPrices] = useState<TcgMarketPrice[]>([]);
    const [loading, setLoading] = useState(false);

    const refresh = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetchNui<void, TcgMarketPrice[]>(NuiEvent.PhoneAppTcgGetMarketPrices);
            setPrices(res ?? []);
        } catch (e) {
            console.error('[TCG] getMarketPrices error', e);
        } finally {
            setLoading(false);
        }
    }, []);

    return { prices, loading, refresh };
}
