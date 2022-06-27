import { setMethodMetadata } from './reflect';

export const TickMetadataKey = 'soz_core.decorator.on_tick';

export const Tick = (interval = 0): MethodDecorator => {
    return (target, propertyKey) => {
        setMethodMetadata(TickMetadataKey, interval, target, propertyKey);
    };
};
