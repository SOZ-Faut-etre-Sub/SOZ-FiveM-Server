import { Prisma } from '@prisma/client';

import { PacificBankZone } from '../../config/bank';
import { Command } from '../../core/decorators/command';
import { On } from '../../core/decorators/event';
import { Exportable } from '../../core/decorators/exports';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { BankContact, BankMoneyType, BankStatement, BankUiData } from '../../shared/bank';
import { JobPermission } from '../../shared/job';
import { PlayerData } from '../../shared/player';
import { Vector3 } from '../../shared/polyzone/vector';
import { RpcServerEvent } from '../../shared/rpc';
import { PrismaService } from '../database/prisma.service';
import { JobService } from '../job.service';
import { Notifier } from '../notifier';
import { PlayerService } from '../player/player.service';
import { BankAccountRepository } from '../repository/bank.account.repository';
import { BankService } from './bank.service';

@Provider()
export class BankProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(JobService)
    private jobService: JobService;

    @Inject(BankService)
    private bankService: BankService;

    @Inject(PrismaService)
    private prismaService: PrismaService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(BankAccountRepository)
    private bankAccountRepository: BankAccountRepository;

    @Command('transfermoney', {
        description: 'Transfer money between two accounts',
        role: 'admin',
    })
    public async transferMoneyCommand(source: number, accountSource: string, accountTarget: string, amount: number) {
        await this.bankService.transferBankMoney(accountSource, accountTarget, 'money', amount, false);
    }

    @On('QBCore:Server:PlayerLoaded', false)
    async onPlayerLoaded(data: any) {
        const player = data.PlayerData as PlayerData;

        const account = await this.bankAccountRepository.find(player.charinfo.account);
        if (account) return;

        await this.bankAccountRepository.create(player.charinfo.account, 'player');
    }

    @Rpc(RpcServerEvent.BANK_GET_ACCOUNT_UI)
    public async getAccountUiData(source: number): Promise<BankUiData> {
        const position = GetEntityCoords(GetPlayerPed(source), false) as Vector3;

        const player = this.playerService.getPlayer(source);
        if (!player) {
            return;
        }

        const contacts = await this.prismaService.$queryRaw<BankContact[]>(
            Prisma.sql`SELECT c.id, c.citizenid, c.label, c.accountid, pp.avatar
                       FROM bank_contacts c
                                LEFT JOIN player u ON json_value(u.charinfo, '$.account') = c.accountid
                                LEFT JOIN phone_profile pp ON json_value(u.charinfo, '$.phone') = pp.number
                       WHERE c.citizenid = ${player.citizenid}`
        );

        const accountPayload: BankUiData = {
            accounts: {
                personal: await this.bankAccountRepository.find(player.charinfo.account),
            },
            contacts,
            history: {
                personal: await this.getAccountHistory(player.charinfo.account),
            },
        };

        const hasAccessToEnterpriseAccount = await this.jobService.hasTargetJobPermission(
            player.job.id,
            player.job.id,
            Number(player.job.grade),
            JobPermission.SocietyBankAccount
        );

        if (player.job.onduty && hasAccessToEnterpriseAccount && PacificBankZone.isPointInside(position)) {
            accountPayload.accounts.enterprise = await this.bankAccountRepository.find(player.job.id);
            accountPayload.accounts.offshore = await this.bankAccountRepository.find(`offshore_${player.job.id}`);

            accountPayload.history.enterprise = await this.getAccountHistory(player.job.id);
            accountPayload.history.offshore = await this.getAccountHistory(`offshore_${player.job.id}`);
        }

        return accountPayload;
    }

    @Rpc(RpcServerEvent.BANK_GET_ACCOUNT_MONEY)
    public async getAccountMoney(source: number, accountId: string, type: BankMoneyType = 'money'): Promise<number> {
        return this.bankService.getAccountMoney(accountId, type);
    }

    @Rpc(RpcServerEvent.BANK_TRANSFER_ACTION)
    public async transferMoney(
        source: number,
        accountSource: string,
        accountTarget: string,
        moneyType: BankMoneyType,
        amount: number,
        reason: string
    ): Promise<boolean> {
        const transfer = this.bankService.transferBankMoney(
            accountSource,
            accountTarget,
            moneyType,
            amount,
            false,
            reason
        );
        if (!transfer) {
            this.notifier.error(source, "Impossible de transférer de l'argent.");
            return transfer;
        }

        this.notifier.advancedNotify(
            source,
            'Maze Banque',
            `Transfert: ~r~$${amount}`,
            "Vous avez transféré de l'argent",
            'CHAR_BANK_MAZE'
        );

        const targetPlayer = this.playerService.getPlayerByBankAccount(accountTarget);
        if (targetPlayer) {
            this.notifier.advancedNotify(
                targetPlayer.source,
                'Maze Banque',
                `Transfert: ~g~$${amount}`,
                "Vous avez reçu de l'argent",
                'CHAR_BANK_MAZE'
            );
        }

        return transfer;
    }

    @Exportable('TransferFarmMoney')
    public async transferFarmMoney(
        source: number,
        farm: string,
        safe: string,
        amount: number = 0,
        moneyType: BankMoneyType = 'money'
    ) {
        return this.bankService.transferFarmMoney(source, farm, safe, amount, moneyType);
    }

    @Exportable('GetPlayerAccount')
    public async getPlayerAccount(source: number) {
        const player = this.playerService.getPlayer(source);
        if (!player) {
            return;
        }

        const account = await this.bankAccountRepository.find(player.charinfo.account);
        if (!account) return;

        return {
            name: `${player.charinfo.firstname} ${player.charinfo.lastname}`,
            account: account.id,
            balance: account.money,
        };
    }

    protected async getAccountHistory(accountId: string): Promise<BankStatement[]> {
        const history = [];

        const rawHistory = await this.prismaService.bank_statements.findMany({
            where: {
                OR: [{ source_accountid: accountId }, { target_accountid: accountId }],
            },
            orderBy: {
                date: 'desc',
            },
            take: 50,
        });

        for (const statement of rawHistory) {
            const source = await this.bankAccountRepository.find(statement.source_accountid);
            const target = await this.bankAccountRepository.find(statement.target_accountid);

            history.push({
                ...statement,
                id: Number(statement.id),
                date: statement.date.getTime(),
                source_label: source?.label,
                target_label: target?.label,
            });
        }

        return history;
    }
}
