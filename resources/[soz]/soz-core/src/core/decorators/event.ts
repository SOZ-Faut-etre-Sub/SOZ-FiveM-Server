import { ClientEvent, ServerEvent } from '../../shared/event';
import { addMethodMetadata, setMethodMetadata } from './reflect';

export type EventMetadata = {
    name: string;
    net: boolean;
};

export const EventMetadataKey = 'soz_core.decorator.event';

export const OnEvent = (event: ServerEvent | ClientEvent, net = true): MethodDecorator => {
    return On(event.toString(), net);
};

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

export enum OnceStep {
    Start = 'start',
    DatabaseConnected = 'databaseConnected',
    PlayerLoaded = 'playerLoaded',
    Stop = 'stop',
}

export const OnceMetadataKey = 'soz_core.decorator.once';

export const Once = (step: OnceStep = OnceStep.Start): MethodDecorator => {
    return (target, propertyKey) => {
        setMethodMetadata(OnceMetadataKey, step, target, propertyKey);
    };
};
