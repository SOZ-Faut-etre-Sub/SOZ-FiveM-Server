import { useEffect } from 'react';

import { useSetAppGetBack } from '../apps.atom';

export const useAppTitleGetBackUpdater = (callback: () => void, label = 'Retour') => {
    const setAppGetBack = useSetAppGetBack();

    useEffect(() => {
        setAppGetBack({ display: true, label, onClick: callback });

        return () => {
            setAppGetBack({ display: false, label, onClick: () => {} });
        };
    }, []);
};
