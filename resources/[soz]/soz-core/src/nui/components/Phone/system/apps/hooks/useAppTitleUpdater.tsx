import { useEffect } from 'react';

import { useSetAppTitle } from '../apps.atom';

export const useAppTitleUpdater = (shouldBeDisplayed: boolean, title: string) => {
    const setAppTitle = useSetAppTitle();

    useEffect(() => {
        setAppTitle(prev => ({ ...prev, title }));

        return () => {
            setAppTitle({ display: false, title: '' });
        };
    }, []);

    useEffect(() => {
        setAppTitle(prev => ({ ...prev, display: shouldBeDisplayed }));
    }, [shouldBeDisplayed]);
};
