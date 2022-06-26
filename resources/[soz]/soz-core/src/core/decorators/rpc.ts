import { setMethodMetadata } from './reflect';

export const RpcMetadataKey = 'soz_core.decorator.event';

export const Rpc = (name?: string): MethodDecorator => {
    return (target, propertyKey) => {
        setMethodMetadata(RpcMetadataKey, name || propertyKey.toString(), target, propertyKey);
    };
};
