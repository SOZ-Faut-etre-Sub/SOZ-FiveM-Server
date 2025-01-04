import parseUrl from 'parse-url';

interface GetLocationFromUrlValue {
    pathname: string;
    search: string;
}

export const getLocationFromUrl = (url: string): GetLocationFromUrlValue => {
    const { search } = parseUrl(url, false);
    const searchStr = '?' + (search || '');
    return { pathname: url, search: searchStr };
};
