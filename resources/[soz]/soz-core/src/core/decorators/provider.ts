import { Injectable } from './injectable';

export type ProviderMetadata = {
    name?: string;
};

export const ProviderMetadataKey = 'soz_core.decorator.provider';

export const Provider = (options?: ProviderMetadata): ClassDecorator => {
    return target => {
        options ||= {};
        options.name ||= target.name;
        Reflect.defineMetadata(ProviderMetadataKey, options, target.prototype);
        Reflect.decorate([Injectable()], target);
    };
};
