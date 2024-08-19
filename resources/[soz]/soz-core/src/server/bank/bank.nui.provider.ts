import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { ClientEvent } from '../../shared/event/client';
import { RpcServerEvent } from '../../shared/rpc';
import { PrismaService } from '../database/prisma.service';
import { Notifier } from '../notifier';
import { PlayerService } from '../player/player.service';
import { BankAccountRepository } from '../repository/bank.account.repository';

@Provider()
export class BankNuiProvider {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(BankAccountRepository)
    private bankAccountRepository: BankAccountRepository;

    @Rpc(RpcServerEvent.BANK_CREATE_OFFSHORE_ACCOUNT)
    public async createOffshoreAccount(source: number): Promise<boolean> {
        this.notifier.notify(source, 'Bien essayé !', 'warning');

        // Disable this feature for now
        return true;

        // const player = this.playerService.getPlayer(source);
        // if (!player) {
        //     return;
        // }
        //
        // await this.bankAccountRepository.create(`offshore_${player.job.id}`, 'offshore');
        // return true;
    }

    @Rpc(RpcServerEvent.BANK_CONTACT_ADD)
    public async addContact(source: number, label: string, iban: string): Promise<boolean> {
        const player = this.playerService.getPlayer(source);
        if (!player) {
            return;
        }

        const contact = await this.prismaService.bank_contacts.create({
            data: {
                citizenid: player.citizenid,
                label,
                accountid: iban,
            },
        });
        TriggerClientEvent(ClientEvent.BANK_PHONE_NEW_CONTACT, source, contact);

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
        TriggerClientEvent(ClientEvent.BANK_PHONE_REMOVE_CONTACT, source, id);

        return true;
    }
}
