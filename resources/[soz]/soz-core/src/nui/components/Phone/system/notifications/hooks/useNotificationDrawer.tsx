import { useAtom } from 'jotai';

import { drawerOpenAtom } from '../notification.atom';

export const useNotificationDrawer = () => {
    const [drawerOpen, setDrawerOpen] = useAtom(drawerOpenAtom);

    return {
        drawerOpen,
        setDrawerOpen,
    };
};
