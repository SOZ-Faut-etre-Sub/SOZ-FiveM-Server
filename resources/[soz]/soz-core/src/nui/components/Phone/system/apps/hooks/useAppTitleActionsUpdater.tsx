import { useEffect } from 'react';

import { AppActionState, useSetAppActions } from '../apps.atom';

export const useAppTitleActionsUpdater = (actions: AppActionState[]) => {
    const setAppActions = useSetAppActions();

    useEffect(() => {
        setAppActions(actions);

        return () => {
            setAppActions([]);
        };
    }, [actions]);
};
