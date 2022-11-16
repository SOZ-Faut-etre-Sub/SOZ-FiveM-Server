import { SOZ_CORE_IS_CLIENT } from '../../globals';
import { CommandMetadata, CommandMetadataKey } from '../decorators/command';
import { Inject, Injectable } from '../decorators/injectable';
import { getMethodMetadata } from '../decorators/reflect';
import { Permissions } from '../permissions';

@Injectable()
export class CommandLoader {
    private commands: CommandMetadata[] = [];

    @Inject(Permissions)
    private permissions: Permissions;

    public load(provider): void {
        const commandMethodList = getMethodMetadata<CommandMetadata>(CommandMetadataKey, provider);

        for (const methodName of Object.keys(commandMethodList)) {
            const commandMetadata = commandMethodList[methodName];
            const method = provider[methodName].bind(provider);
            const commandMethod = (source: number, args: string[]): void => {
                method(source, ...args);
            };

            if (SOZ_CORE_IS_CLIENT) {
                if (commandMetadata.keys) {
                    for (const key of commandMetadata.keys) {
                        RegisterKeyMapping(
                            commandMetadata.name,
                            commandMetadata.description || '',
                            key.mapper,
                            key.key
                        );
                    }
                }
            }

            RegisterCommand(commandMetadata.name, commandMethod, commandMetadata.role !== null);
            this.commands.push(commandMetadata);

            if (commandMetadata.role !== null) {
                if (Array.isArray(commandMetadata.role)) {
                    for (const role of commandMetadata.role) {
                        this.permissions.allowCommandForRole(commandMetadata.name, role);
                    }
                } else {
                    this.permissions.allowCommandForRole(commandMetadata.name, commandMetadata.role);
                }
            }
        }
    }

    public unload(): void {
        this.commands = [];
    }
}
