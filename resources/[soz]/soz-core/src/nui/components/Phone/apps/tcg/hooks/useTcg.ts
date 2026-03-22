import { useCallback, useState } from 'react';

import { NuiEvent } from '../../../../../../shared/event/nui';
import { TcgClaimResult, TcgCollectionCard, TcgDailyStatus } from '../../../../../../shared/tcg/tcg.types';
import { fetchNui } from '../../../../../fetch';

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
