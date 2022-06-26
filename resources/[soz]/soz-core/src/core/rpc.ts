import { v4 as uuidv4 } from 'uuid';

import { SOZ_CORE_IS_SERVER } from '../globals';

export const emitRpc = async (name: string, ...args: any[]): Promise<any> => {
    if (SOZ_CORE_IS_SERVER) {
        console.error("Can't emit RPC on server");
    } else {
        const eventResponseName = `${name}_${uuidv4()}`;
        const promise = new Promise<any>((resolve, reject) => {
            const resultCallback = result => {
                resolve(result);
                removeEventListener(eventResponseName, resultCallback);
            };

            const rejectCallback = error => {
                reject(error);
                removeEventListener(eventResponseName, resultCallback);
            };

            addEventListener(eventResponseName, resultCallback);
            setTimeout(() => {
                rejectCallback(new Error('RPC timeout'));
            }, 1000);
        });

        TriggerServerEvent(name, eventResponseName, ...args);

        return promise;
    }
};
