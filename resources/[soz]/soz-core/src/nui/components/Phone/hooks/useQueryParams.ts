import qs, { ParsedQs } from 'qs';
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

export function useQueryParams<T = Record<string, string>>(defaultValues: T = null) {
    const { search } = useLocation();

    return useMemo(() => {
        const query = qs.parse(search, { ignoreQueryPrefix: true });

        if (!defaultValues) {
            return query as T & Partial<ParsedQs>;
        }
        return { ...defaultValues, ...query } as T & Partial<ParsedQs>;
    }, [search, defaultValues]);
}
