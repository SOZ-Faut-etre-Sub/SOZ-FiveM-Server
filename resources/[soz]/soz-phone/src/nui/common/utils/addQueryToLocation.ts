import url from 'parse-url';
import qs from 'qs';

interface IRouterLocation {
    pathname: string;
    search: string;
}

export const addQueryToLocation = ({ pathname = '', search = '' }: IRouterLocation, key = '', value = '') => {
    const { query } = url(pathname + search);
    return `${pathname}?${qs.stringify({
        ...query,
        [key]: value,
    })}`;
};
