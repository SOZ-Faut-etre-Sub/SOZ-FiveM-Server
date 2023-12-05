import { RpcClientEvent, RpcServerEvent } from '../../shared/rpc';
import { setMethodMetadata } from './reflect';

export const RpcMetadataKey = 'soz_core.decorator.rpc';

export const Rpc = (name: RpcServerEvent | RpcClientEvent): MethodDecorator => {
    return (target, propertyKey) => {
        setMethodMetadata(RpcMetadataKey, name || propertyKey.toString(), target, propertyKey);
    };
};
