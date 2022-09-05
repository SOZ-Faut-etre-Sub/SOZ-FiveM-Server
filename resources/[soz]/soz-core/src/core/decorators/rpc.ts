import { RpcEvent } from '../../shared/rpc';
import { setMethodMetadata } from './reflect';

export const RpcMetadataKey = 'soz_core.decorator.rpc';

export const Rpc = (name: RpcEvent): MethodDecorator => {
    return (target, propertyKey) => {
        setMethodMetadata(RpcMetadataKey, name || propertyKey.toString(), target, propertyKey);
    };
};
