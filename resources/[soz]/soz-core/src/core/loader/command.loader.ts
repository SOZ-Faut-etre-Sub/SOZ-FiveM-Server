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
            const commandMethod = (source: number, args: any[]): void => {
                if (SOZ_CORE_IS_CLIENT) {
                    if (
                        commandMetadata.keys &&
                        commandMetadata.keys.length > 0 &&
                        !commandMetadata.passthroughNuiFocus &&
                        IsNuiFocused()
                    ) {
                        return;
                    }

                    if (!commandMetadata.passthroughPauseMenu && IsPauseMenuActive()) {
                        return;
                    }
                }

                method(source, ...args);
            };

            if (SOZ_CORE_IS_CLIENT) {
                if (commandMetadata.keys) {
                    let name = commandMetadata.name;

                    if (commandMetadata.toggle) {
                        name = `+${name}`;
                    }

                    for (const key of commandMetadata.keys) {
                        RegisterKeyMapping(name, commandMetadata.description || '', key.mapper, key.key);
                    }
                }
            }

            if (commandMetadata.toggle) {
                const activateCommand = (source: number, args: any[]) => {
                    commandMethod(source, [true, ...args]);
                };
                const deactivateCommand = (source: number, args: any[]) => {
                    commandMethod(source, [false, ...args]);
                };

                RegisterCommand(`+${commandMetadata.name}`, activateCommand, commandMetadata.role !== null);
                RegisterCommand(`-${commandMetadata.name}`, deactivateCommand, commandMetadata.role !== null);
            } else {
                RegisterCommand(commandMetadata.name, commandMethod, commandMetadata.role !== null);
            }

            this.commands.push(commandMetadata);

            if (commandMetadata.role !== null) {
                let name = commandMetadata.name;

                if (commandMetadata.toggle) {
                    name = `+${name}`;
                }

                if (Array.isArray(commandMetadata.role)) {
                    for (const role of commandMetadata.role) {
                        this.permissions.allowCommandForRole(name, role);
                    }
                } else {
                    this.permissions.allowCommandForRole(name, commandMetadata.role);
                }
            }
        }
    }

    public getCommands(): CommandMetadata[] {
        return this.commands;
    }

    public unload(): void {
        this.commands = [];
    }
}
