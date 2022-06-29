import { addMethodMetadata, setMethodMetadata } from './reflect';

export type StateBagHandlerMetadata = {
    key: string;
    bag: string;
};

export const StateBagHandlerMetadataKey = 'soz_core.decorator.state_bag_handler';

export const StateBagHandler = (key: string, bag: string): MethodDecorator => {
    return (target, propertyKey) => {
        addMethodMetadata(
            StateBagHandlerMetadataKey,
            {
                key,
                bag,
            },
            target,
            propertyKey
        );
    };
};
