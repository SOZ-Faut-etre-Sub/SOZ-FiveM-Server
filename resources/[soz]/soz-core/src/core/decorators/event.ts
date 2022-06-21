import { addMethodMetadata } from './reflect';

export type EventMetadata = {
    name?: string;
    net?: boolean;
};

export const EventMetadataKey = 'soz_core.decorator.event';

export const On = (name?: string, net = true): MethodDecorator => {
    return (target, propertyKey) => {
        addMethodMetadata(
            EventMetadataKey,
            {
                name: name || propertyKey.toString(),
                net,
            },
            target,
            propertyKey
        );
    };
};
