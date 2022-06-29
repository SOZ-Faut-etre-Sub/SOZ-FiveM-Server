import { CommandMetadata, CommandMetadataKey } from '../decorators/command';
import { Injectable } from '../decorators/injectable';
import { getMethodMetadata } from '../decorators/reflect';

@Injectable()
export class CommandLoader {
    private commands: CommandMetadata[] = [];

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
                ExecuteCommand(`add_ace "soz_role.${commandMetadata.role}" "command.${commandMetadata.name}" allow`);
            }
        }
    }

    public unload(): void {
        this.commands = [];
    }
}
