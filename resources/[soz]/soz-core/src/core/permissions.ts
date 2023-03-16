import { Injectable } from './decorators/injectable';

export type SozRole = 'admin' | 'staff' | 'gamemaster' | 'helper' | 'user';

@Injectable()
export class Permissions {
    addPlayerRole(source: number, role: SozRole) {
        ExecuteCommand(`add_principal "player.${source}" "soz_role.${role}"`);
    }

    allowCommandForRole(command: string, role: SozRole) {
        ExecuteCommand(`add_ace "soz_role.${role}" "command.${command}" allow`);
    }
}
