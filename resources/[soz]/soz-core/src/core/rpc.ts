import { SOZ_CORE_IS_SERVER } from '../globals';
import { RpcEvent } from '../shared/rpc';
import { uuidv4 } from './utils';

export const emitRpc = async <R>(name: RpcEvent, ...args: any[]): Promise<R> => {
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

            addEventListener(eventResponseName, resultCallback, true);
            setTimeout(() => {
                rejectCallback(new Error('RPC timeout'));
            }, 1000);
        });

        TriggerServerEvent(name, eventResponseName, ...args);

        return promise;
    }
};
