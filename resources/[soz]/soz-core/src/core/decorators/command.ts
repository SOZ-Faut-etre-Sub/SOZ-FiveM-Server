import { SozRole } from '../permissions';
import { setMethodMetadata } from './reflect';

export type CommandMetadata = {
    name: string;
    description: string;
    role: SozRole[] | SozRole | null;
    keys: CommandKey[];
};

export type CommandKey = {
    mapper: 'keyboard' | 'mouse';
    key: string;
};

export const CommandMetadataKey = 'soz_core.decorator.command';

export const Command = (name: string, options: Partial<Omit<CommandMetadata, 'name'>> = {}): MethodDecorator => {
    return (target, propertyKey) => {
        setMethodMetadata(
            CommandMetadataKey,
            {
                name,
                description: options.description || null,
                role: options.role || null,
                keys: options.keys || [],
            },
            target,
            propertyKey
        );
    };
};
