import { PacificBankZone } from '../../config/bank';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { BankUiData } from '../../shared/bank';
import { JobPermission } from '../../shared/job';
import { Vector3 } from '../../shared/polyzone/vector';
import { RpcServerEvent } from '../../shared/rpc';
import { JobService } from '../job.service';
import { PlayerService } from '../player/player.service';
import { BankAccountRepository } from '../repository/bank.account.repository';

@Provider()
export class BankProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(JobService)
    private jobService: JobService;

    @Inject(BankAccountRepository)
    private bankAccountRepository: BankAccountRepository;

    @Rpc(RpcServerEvent.BANK_GET_ACCOUNT_UI)
    public async getSafeAccount(source: number): Promise<BankUiData> {
        const position = GetEntityCoords(GetPlayerPed(source), false) as Vector3;

        const player = this.playerService.getPlayer(source);
        if (!player) {
            return;
        }

        const accountPayload: BankUiData = {
            accounts: {
                personal: await this.bankAccountRepository.find(player.charinfo.account),
                enterprise: await this.bankAccountRepository.find(player.job.id),
                offshore: await this.bankAccountRepository.find(`offshore_${player.job.id}`),
            },
        };

        const hasAccessToEnterpriseAccount = await this.jobService.hasTargetJobPermission(
            player.job.id,
            player.job.id,
            Number(player.job.grade),
            JobPermission.SocietyBankAccount
        );

        if (!player.job.onduty || !hasAccessToEnterpriseAccount || !PacificBankZone.isPointInside(position)) {
            accountPayload.accounts.enterprise = null;
            accountPayload.accounts.offshore = null;
        }

        return accountPayload;
    }
}
