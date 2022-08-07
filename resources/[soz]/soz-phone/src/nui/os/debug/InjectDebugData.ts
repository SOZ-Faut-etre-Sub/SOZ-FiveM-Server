import { SOZ_PHONE_IS_PRODUCTION } from '../../../globals';

export interface DebugEvent<P = any> {
    app: string;
    method: string;
    data: P;
}

const InjectDebugData = <P>(events: DebugEvent<P>[], timer = 1000) => {
    if (SOZ_PHONE_IS_PRODUCTION) {
        return;
    }

    for (const event of events) {
        setTimeout(() => {
            window.dispatchEvent(
                new MessageEvent('message', {
                    data: {
                        app: event.app,
                        method: event.method,
                        data: event.data,
                    },
                })
            );
        }, timer);
    }
};

export default InjectDebugData;
