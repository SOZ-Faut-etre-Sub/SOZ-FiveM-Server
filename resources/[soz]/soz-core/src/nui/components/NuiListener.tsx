import { FunctionComponent, PropsWithChildren, useEffect } from 'react';

import { eventNameFactory, NuiMethodMap } from '../../shared/nui';

export const NuiListener: FunctionComponent<PropsWithChildren> = ({ children }): JSX.Element => {
    const eventListener = <App extends keyof NuiMethodMap, Method extends keyof NuiMethodMap[App]>(event: {
        data: { app: App; method: Method; data: NuiMethodMap[App][Method] };
    }) => {
        const { app, method, data } = event.data;
        if (app && method) {
            window.dispatchEvent(
                new MessageEvent(eventNameFactory(app, method), {
                    data,
                })
            );
        }
    };

    useEffect(() => {
        window.addEventListener('message', eventListener);
        return () => window.removeEventListener('message', eventListener);
    }, []);

    return <>{children}</>;
};
