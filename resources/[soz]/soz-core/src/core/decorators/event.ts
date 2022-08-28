import { ClientEvent, GameEvent, NuiEvent, ServerEvent } from '../../shared/event';
import { Result } from '../../shared/result';
import { addMethodMetadata, setMethodMetadata } from './reflect';

export type EventMetadata = {
    name: string;
    net: boolean;
};

export const EventMetadataKey = 'soz_core.decorator.event';
export const NuiEventMetadataKey = 'soz_core.decorator.nui_event';
export const GameEventMetadataKey = 'soz_core.decorator.game.event';

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

export const OnNuiEvent = <T = any, R = any, E = any>(event: NuiEvent) => {
    return (target, propertyKey, descriptor: TypedPropertyDescriptor<(data?: T) => Promise<Result<R, E>>>) => {
        addMethodMetadata(
            NuiEventMetadataKey,
            {
                name: event.toString(),
                net: false,
            },
            target,
            propertyKey
        );

        return descriptor;
    };
};

export const OnGameEvent = (event: GameEvent): MethodDecorator => {
    return (target, propertyKey) => {
        addMethodMetadata(
            GameEventMetadataKey,
            {
                name: event.toString(),
                net: false,
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
