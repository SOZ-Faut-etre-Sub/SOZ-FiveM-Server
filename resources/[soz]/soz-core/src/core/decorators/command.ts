import { SozRole } from '../permissions';
import { setMethodMetadata } from './reflect';

export type CommandArgument = {
    name: string;
    help: string;
};

export type CommandMetadata = {
    name: string;
    description: string;
    arguments: CommandArgument[];
    role: SozRole[] | SozRole | null;
    keys: CommandKey[];
    passthroughNuiFocus: boolean;
    passthroughPauseMenu: boolean;
    toggle: boolean;
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
                description: options.description || '',
                role: options.role || null,
                keys: options.keys || [],
                arguments: options.arguments || [],
                passthroughNuiFocus: options.passthroughNuiFocus || false,
                passthroughPauseMenu: options.passthroughPauseMenu || false,
                toggle: options.toggle || false,
            },
            target,
            propertyKey
        );
    };
};
