import url from 'parse-url';
import qs from 'qs';

const fakeBaseUrl = 'http://localhost/';

interface IRouterLocation {
    pathname: string;
    search: any;
}

export const deleteQueryFromLocation = (location: Record<string, unknown> & IRouterLocation, key = '') => {
    const { query } = url(fakeBaseUrl + location.pathname + location.search);
    return `${location.pathname}/?${qs.stringify({
        ...query,
        [key]: undefined,
    })}`;
};
