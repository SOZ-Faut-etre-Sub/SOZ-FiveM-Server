import { SOZ_CORE_IS_CLIENT, SOZ_CORE_IS_SERVER } from '../globals';
import { RpcClientEvent, RpcServerEvent } from '../shared/rpc';
import { uuidv4 } from './utils';

export type RpcConfig = {
    timeout: number;
    retries: number;
};

type CacheRpcInfo = {
    last: number;
    value: any;
};

const RpcCache = new Map<RpcServerEvent, Map<number, CacheRpcInfo>>();

export const emitRpcTimeout = async <R>(name: RpcServerEvent, timeout: number, ...args: any[]): Promise<R> => {
    let rpcTry = 0;

    while (rpcTry < 3) {
        try {
            return await doEmitRpc<R>(name, timeout, ...args);
        } catch (e) {
            rpcTry++;

            if (rpcTry === 3) {
                throw e;
            }
        }
    }

    throw new Error(`RPC ${name} failed`);
};

export const emitRpcCache = async <R>(name: RpcServerEvent, id: number): Promise<R> => {
    let cacheForEvent = RpcCache.get(name);
    if (cacheForEvent) {
        const cacheInfo = cacheForEvent.get(id);
        if (cacheInfo && cacheInfo.last + 2000 > Date.now()) {
            return cacheInfo.value;
        }
    } else {
        cacheForEvent = new Map();
        RpcCache.set(name, cacheForEvent);
    }

    const value = await emitRpcTimeout<R>(name, 3000, id);
    cacheForEvent.set(id, {
        last: Date.now(),
        value: value,
    });

    return value;
};

export const emitRpc = async <R>(name: RpcServerEvent, ...args: any[]): Promise<R> => {
    return emitRpcTimeout(name, 3000, ...args);
};

export const emitClientRpcConfig = async <R>(
    name: RpcClientEvent,
    source: number,
    config: RpcConfig,
    ...args: any[]
): Promise<R> => {
    let rpcTry = 0;

    while (rpcTry <= config.retries) {
        try {
            return await doEmitClientRpc<R>(name, source, config.timeout, ...args);
        } catch (e) {
            rpcTry++;

            if (rpcTry === 3) {
                throw e;
            }
        }
    }

    throw new Error(`RPC ${name} failed`);
};
export const emitClientRpc = async <R>(name: RpcClientEvent, source: number, ...args: any[]): Promise<R> => {
    return emitClientRpcConfig(
        name,
        source,
        {
            timeout: 3000,
            retries: 2,
        },
        ...args
    );
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
            rejectCallback(new Error('RPC timeout for event ' + eventResponseName));
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
