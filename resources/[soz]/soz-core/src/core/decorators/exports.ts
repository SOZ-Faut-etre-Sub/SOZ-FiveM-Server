import { setMethodMetadata } from './reflect';

export const ExportableMetadataKey = 'soz_core.decorator.exportable';

export const Exportable = (name: string): MethodDecorator => {
    return (target, propertyKey) => {
        setMethodMetadata(ExportableMetadataKey, name, target, propertyKey);
    };
};
