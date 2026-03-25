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
    TcgProfileResult,
    TcgRespondTradeInput,
    TcgShowcaseItem,
    TcgShowcaseResult,
    TcgTradeOffer,
    TcgTradeResult,
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
