import { Injectable } from './injectable';

export type ModuleMetadata = {
    name?: string;
    providers?: any[];
};

export const ModuleMetadataKey = 'soz_core.decorator.module';

export const Module = (options: ModuleMetadata): ClassDecorator => {
    return target => {
        options.name ||= target.name;
        Reflect.defineMetadata(ModuleMetadataKey, options, target.prototype);
        Reflect.decorate([Injectable()], target);
    };
};
