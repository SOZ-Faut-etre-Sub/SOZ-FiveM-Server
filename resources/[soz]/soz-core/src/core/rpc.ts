import { SOZ_CORE_IS_SERVER } from '../globals';
import { RpcEvent } from '../shared/rpc';
import { uuidv4 } from './utils';

export const emitRpcTimeout = async <R>(name: RpcEvent, timeout: number, ...args: any[]): Promise<R> => {
    let rpcTry = 0;

    while (rpcTry < 3) {
        try {
            return await doEmitRpc<R>(name, timeout, ...args);
        } catch (e) {
            console.error(`RPC ${name} failed`, e);
            rpcTry++;

            if (rpcTry === 3) {
                throw e;
            }
        }
    }

    throw new Error(`RPC ${name} failed`);
};

export const emitRpc = async <R>(name: RpcEvent, ...args: any[]): Promise<R> => {
    return emitRpcTimeout(name, 3000, ...args);
};

const doEmitRpc = async <R>(name: RpcEvent, timeout: number, ...args: any[]): Promise<R> => {
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
            }, timeout);
        });

        TriggerServerEvent(name, eventResponseName, ...args);

        return promise;
    }
};

export const emitQBRpc = async <R>(name: string, ...args: any[]): Promise<R> => {
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
                rejectCallback(new Error('QB RPC timeout'));
            }, 3000);
        });

        TriggerServerEvent('QBCore:Server:TriggerRpc', name, eventResponseName, ...args);

        return promise;
    }
};
