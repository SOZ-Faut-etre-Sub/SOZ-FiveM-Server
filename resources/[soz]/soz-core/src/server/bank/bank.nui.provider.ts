import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { RpcServerEvent } from '../../shared/rpc';
import { PrismaService } from '../database/prisma.service';
import { PlayerService } from '../player/player.service';

@Provider()
export class BankNuiProvider {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Rpc(RpcServerEvent.BANK_CONTACT_ADD)
    public async addContact(source: number, label: string, iban: string): Promise<boolean> {
        const player = this.playerService.getPlayer(source);
        if (!player) {
            return;
        }

        await this.prismaService.bank_contacts.create({
            data: {
                citizenid: player.citizenid,
                label,
                accountid: iban,
            },
        });
        return true;
    }

    @Rpc(RpcServerEvent.BANK_CONTACT_REMOVE)
    public async removeContact(source: number, id: number): Promise<boolean> {
        const player = this.playerService.getPlayer(source);
        if (!player) {
            return;
        }

        await this.prismaService.bank_contacts.delete({
            where: {
                id,
                citizenid: player.citizenid,
            },
        });
        return true;
    }
}
