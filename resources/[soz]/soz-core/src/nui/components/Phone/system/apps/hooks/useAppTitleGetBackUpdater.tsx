import { useEffect } from 'react';

import { useSetAppGetBack } from '../apps.atom';

export const useAppTitleGetBackUpdater = (callback: () => void, label = 'Retour', className?: string) => {
    const setAppGetBack = useSetAppGetBack();

    useEffect(() => {
        setAppGetBack({ display: true, label, className, onClick: callback });

        return () => {
            setAppGetBack({
                display: false,
                label,
                className: null,
                onClick: () => {},
            });
        };
    }, [callback, label, className]);
};
