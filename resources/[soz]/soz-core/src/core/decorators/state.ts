import { addMethodMetadata } from './reflect';

export type StateBagHandlerMetadata = {
    key: string;
    bag: string | null;
};

export const StateBagHandlerMetadataKey = 'soz_core.decorator.state_bag_handler';

export const StateBagHandler = <T>(key: string, bag: string | null) => {
    return (
        target,
        propertyKey,
        descriptor: TypedPropertyDescriptor<
            (bagName?: string, key?: string, value?: T, reserved?: number, replicated?: boolean) => Promise<void>
        >
    ) => {
        addMethodMetadata(
            StateBagHandlerMetadataKey,
            {
                key,
                bag,
            },
            target,
            propertyKey
        );

        return descriptor;
    };
};
