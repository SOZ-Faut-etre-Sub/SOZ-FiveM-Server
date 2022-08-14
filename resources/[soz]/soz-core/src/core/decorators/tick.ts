import { setMethodMetadata } from './reflect';

export const TickMetadataKey = 'soz_core.decorator.on_tick';

export enum TickInterval {
    EVERY_FRAME = 0,
    EVERY_SECOND = 1000,
    EVERY_MINUTE = 60000,
    EVERY_5_MINUTE = 300000,
    EVERY_10_MINUTE = 600000,
    EVERY_15_MINUTE = 900000,
    EVERY_30_MINUTE = 1800000,
    EVERY_HOUR = 3600000,
}

export const Tick = (interval = 0): MethodDecorator => {
    return (target, propertyKey) => {
        setMethodMetadata(TickMetadataKey, interval, target, propertyKey);
    };
};
