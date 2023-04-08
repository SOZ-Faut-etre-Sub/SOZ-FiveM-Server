import { SOZ_CORE_IS_CLIENT, SOZ_CORE_IS_SERVER } from '../globals';
import { RpcClientEvent, RpcServerEvent } from '../shared/rpc';
import { uuidv4 } from './utils';

export const emitRpcTimeout = async <R>(name: RpcServerEvent, timeout: number, ...args: any[]): Promise<R> => {
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

export const emitRpc = async <R>(name: RpcServerEvent, ...args: any[]): Promise<R> => {
    return emitRpcTimeout(name, 3000, ...args);
};

export const emitClientRpcTimeout = async <R>(
    name: RpcClientEvent,
    source: number,
    timeout: number,
    ...args: any[]
): Promise<R> => {
    let rpcTry = 0;

    while (rpcTry < 3) {
        try {
            return await doEmitClientRpc<R>(name, source, timeout, ...args);
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
export const emitClientRpc = async <R>(name: RpcClientEvent, source: number, ...args: any[]): Promise<R> => {
    return emitClientRpcTimeout(name, source, 3000, ...args);
};

const doEmitRpc = async <R>(name: RpcServerEvent, timeout: number, ...args: any[]): Promise<R> => {
    if (SOZ_CORE_IS_SERVER) {
        console.error("Can't emit RPC on server");
    } else {
        const eventResponseName = `${name}_${uuidv4()}`;
        const promise = createRpcPromise<R>(eventResponseName, timeout);

        TriggerServerEvent(name, eventResponseName, ...args);

        return promise;
    }
};

const doEmitClientRpc = async <R>(
    name: RpcClientEvent,
    source: number,
    timeout: number,
    ...args: any[]
): Promise<R> => {
    if (SOZ_CORE_IS_CLIENT) {
        console.error("Can't emit client RPC on client");
    } else {
        const eventResponseName = `${name}_${uuidv4()}`;
        const promise = createRpcPromise<R>(eventResponseName, timeout);

        TriggerClientEvent(name, source, eventResponseName, ...args);

        return promise;
    }
};

const createRpcPromise = <R>(eventResponseName: string, timeout: number): Promise<R> => {
    return new Promise<R>((resolve, reject) => {
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
