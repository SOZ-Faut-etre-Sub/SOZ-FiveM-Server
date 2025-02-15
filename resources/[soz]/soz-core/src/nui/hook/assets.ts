import { useSelector } from 'react-redux';

import { RootState } from '../store';

export const useAssetPath = () => {
    const publicEndpoint = useSelector((state: RootState) => state.api.publicEndpoint);

    const getPath = (path: string) => {
        return `${publicEndpoint}/static/game/${path}`;
    };

    return {
        getPath,
    };
};
