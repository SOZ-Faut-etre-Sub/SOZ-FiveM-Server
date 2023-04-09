import { SOZ_CORE_IS_SERVER } from '../../globals';
import { Inject, Injectable } from '../decorators/injectable';
import { getMethodMetadata } from '../decorators/reflect';
import { RpcMetadataKey } from '../decorators/rpc';
import { Logger } from '../logger';
import { MiddlewareFactory } from '../middleware/middleware';

@Injectable()
export class RpcLoader {
    private rpcList: Record<string, any> = {};

    @Inject('MiddlewareFactory')
    private middlewareFactory: MiddlewareFactory;

    @Inject(Logger)
    private logger: Logger;

    public load(provider): void {
        const rpcMethodList = getMethodMetadata<string>(RpcMetadataKey, provider);

        for (const methodName of Object.keys(rpcMethodList)) {
            const rpcName = rpcMethodList[methodName];
            const method = provider[methodName].bind(provider);

            if (this.rpcList[rpcName]) {
                this.logger.error('RPC already exists', rpcName);

                continue;
            }

            let rpcMethod = null;

            if (SOZ_CORE_IS_SERVER) {
                rpcMethod = async (source: number, responseEventName: string, ...args: any[]): Promise<void> => {
                    const result = await method(source, ...args);
                    TriggerClientEvent(responseEventName, source, result);
                };
            } else {
                rpcMethod = async (responseEventName: string, ...args: any[]): Promise<void> => {
                    const result = await method(...args);
                    TriggerServerEvent(responseEventName, result);
                };
            }

            const methodWithMiddleware = this.middlewareFactory.create(
                {
                    name: rpcName,
                    net: true,
                },
                rpcMethod
            );

            addEventListener(rpcName, methodWithMiddleware, true);
            this.rpcList[rpcName] = methodWithMiddleware;
        }
    }

    public unload(): void {
        for (const name of Object.keys(this.rpcList)) {
            removeEventListener(name, this.rpcList[name]);
        }

        this.rpcList = {};
    }
}
