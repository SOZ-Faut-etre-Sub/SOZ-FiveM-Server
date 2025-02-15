import { useEffect } from 'react';

import { useSetAppTitle } from '../apps.atom';

export const useAppTitleUpdater = (shouldBeDisplayed: boolean, title: string, subtitle?: string) => {
    const setAppTitle = useSetAppTitle();

    useEffect(() => {
        setAppTitle(prev => ({ ...prev, title, subtitle }));

        return () => {
            setAppTitle({ display: false, title: '', subtitle: undefined });
        };
    }, [title, subtitle]);

    useEffect(() => {
        setAppTitle(prev => ({ ...prev, display: shouldBeDisplayed }));
    }, [shouldBeDisplayed, title, subtitle]);
};
