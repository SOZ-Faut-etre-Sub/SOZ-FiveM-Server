import { OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { wait } from '../../core/utils';
import { ServerEvent } from '../../shared/event';
import { PlayerCharInfo } from '../../shared/player';
import { RpcEvent } from '../../shared/rpc';
import { PrismaService } from '../database/prisma.service';
import { QBCore } from '../qbcore';

@Provider()
export class AdminMenuGameProvider {
    @Inject(QBCore)
    private QBCore: QBCore;

    @Inject(PrismaService)
    private database: PrismaService;

    @OnEvent(ServerEvent.ADMIN_CREATE_CHARACTER)
    public async createCharacter(source: number, firstname: string, lastname: string): Promise<void> {
        this.QBCore.logout(source);

        await wait(1000);

        TriggerClientEvent('soz-character:client:create-new-character', source, 'spawn1', firstname, lastname);
    }

    @OnEvent(ServerEvent.ADMIN_SWITCH_CHARACTER)
    public async switchCharacter(source: number, citizenId: string): Promise<void> {
        this.QBCore.logout(source);

        await wait(1000);

        const player = await this.database.player.findUnique({
            where: {
                citizenid: citizenId,
            },
        });

        TriggerClientEvent('soz-character:client:login-character', source, player);
    }

    @Rpc(RpcEvent.ADMIN_GET_CHARACTERS)
    public async getCharacters(source: number): Promise<Record<string, PlayerCharInfo>> {
        try {
            const steam = this.QBCore.getSteamIdentifier(source);
            const players = await this.database.player.findMany({
                where: {
                    license: steam,
                },
            });

            const characters = {};

            for (const player of players) {
                characters[player.citizenid] = JSON.parse(player.charinfo);
            }

            return characters;
        } catch (e) {
            console.trace(e);
            return {};
        }
    }
}
