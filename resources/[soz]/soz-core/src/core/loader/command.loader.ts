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

            RegisterCommand(commandMetadata.name, commandMethod, commandMetadata.role !== null);
            this.commands.push(commandMetadata);

            if (commandMetadata.role !== null) {
                this.permissions.allowCommandForRole(commandMetadata.name, commandMetadata.role);
            }
        }
    }

    public unload(): void {
        this.commands = [];
    }
}
