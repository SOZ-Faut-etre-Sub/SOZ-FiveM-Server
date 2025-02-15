import { Prisma } from '@prisma/client';

import { PacificBankZone } from '../../config/bank';
import { Command } from '../../core/decorators/command';
import { On } from '../../core/decorators/event';
import { Exportable } from '../../core/decorators/exports';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { BankContact, BankHistoryFilter, BankMoneyType, BankUiData } from '../../shared/bank';
import { ServerEvent } from '../../shared/event/server';
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
import { BankStatementsService } from './bank.statements.service';

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

    @Inject(BankStatementsService)
    private bankStatementsService: BankStatementsService;

    @Command('removemoney', {
        description: 'Remove money of a account',
        role: 'admin',
    })
    public async removeMoneyCommand(source: number, account: string, amount: number) {
        const success = await this.bankService.removeAccountMoney(account, amount, 'money');
        if (success) {
            this.notifier.notify(source, `Suppression de ~r~${amount}$~s~ du compte ~b~${account}~s~.`, 'success');
        } else {
            this.notifier.error(source, `~r~Echec~s~ de la suppression d'argent.`);
        }
    }

    @Command('transfermoney', {
        description: 'Transfer money between two accounts',
        role: 'admin',
    })
    public async transferMoneyCommand(source: number, accountSource: string, accountTarget: string, amount: number) {
        await this.bankService.transferBankMoney(accountSource, accountTarget, 'money', amount, false);
    }

    @Command('accountinfo', {
        description: 'Get account info',
        role: 'admin',
    })
    public async getAccountInfo(source: number, accountId: string) {
        const accountMoney = await this.bankService.getAccountMoney(accountId, 'money');
        const accountMarkedMoney = await this.bankService.getAccountMoney(accountId, 'marked_money');

        this.notifier.advancedNotify(
            source,
            'Bank Account',
            accountId,
            `Money: ${accountMoney?.toLocaleString()}~n~Marked Money: ${accountMarkedMoney?.toLocaleString()}`,
            'CHAR_BANK_MAZE'
        );
    }

    @On(ServerEvent.BANK_REFRESH_ACCOUNT)
    public async refreshAccount(source: number, accountId: string) {
        await this.bankAccountRepository.refreshAccount(accountId);
    }

    @On('QBCore:Server:PlayerLoaded', false)
    async onPlayerLoaded(data: any) {
        const player = data.PlayerData as PlayerData;

        const account = await this.bankAccountRepository.find(player.charinfo.account);
        if (account) return;

        await this.bankAccountRepository.create(player.charinfo.account, 'player');
    }

    @Rpc(RpcServerEvent.BANK_GET_ACCOUNT_UI)
    public async getAccountUiData(source: number, historyFilter?: BankHistoryFilter): Promise<BankUiData> {
        const position = GetEntityCoords(GetPlayerPed(source), false) as Vector3;

        const player = this.playerService.getPlayer(source);
        if (!player) {
            return;
        }

        const accountPayload: BankUiData = {
            accounts: {
                personal: await this.bankAccountRepository.find(player.charinfo.account),
            },
            contacts: await this.getBankContacts(player.citizenid),
            history: {
                personal: await this.bankStatementsService.getStatementsForAccount(
                    player.charinfo.account,
                    historyFilter
                ),
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

            accountPayload.history.enterprise = await this.bankStatementsService.getStatementsForAccount(
                player.job.id,
                historyFilter
            );
            accountPayload.history.offshore = await this.bankStatementsService.getStatementsForAccount(
                `offshore_${player.job.id}`,
                historyFilter
            );
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
        const transfer = await this.bankService.transferBankMoney(
            accountSource,
            accountTarget,
            moneyType,
            amount,
            false,
            reason,
            true
        );
        if (!transfer) {
            this.notifier.error(source, "Impossible de transférer de l'argent.");
            return transfer;
        }

        this.notifier.advancedNotify(
            source,
            'Fleeca Banque',
            `Transfert: ~r~$${amount}`,
            "Vous avez transféré de l'argent.",
            'CHAR_BANK_MAZE'
        );

        const targetPlayer = this.playerService.getPlayerByBankAccount(accountTarget);
        if (targetPlayer) {
            this.notifier.advancedNotify(
                targetPlayer.source,
                'Fleeca Banque',
                `Transfert: ~g~$${amount}`,
                "Vous avez reçu de l'argent.",
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

    @Rpc(RpcServerEvent.BANK_GET_CONTACTS)
    public async getPlayerBankContacts(source: number) {
        const player = this.playerService.getPlayer(source);
        if (!player) {
            return;
        }

        return this.getBankContacts(player.citizenid);
    }

    protected async getBankContacts(citizenId: string) {
        return this.prismaService.$queryRaw<BankContact[]>(
            Prisma.sql`SELECT c.id, c.citizenid, c.label, c.accountid, pp.avatar
                       FROM bank_contacts c
                                LEFT JOIN player u ON json_value(u.charinfo, '$.account') = c.accountid
                                LEFT JOIN phone_profile pp ON json_value(u.charinfo, '$.phone') = pp.number
                       WHERE c.citizenid = ${citizenId}`
        );
    }

    public async payTaxe(citizenId: string, money: number, reason: string): Promise<[boolean, string]> {
        const player = this.playerService.getPlayerByCitizenId(citizenId);
        if (!player) {
            return [false, 'Joueur inconnu ou pas connecté'];
        }

        const success = await this.bankService.transferBankMoney(
            player.charinfo.account,
            'gouv',
            'money',
            money,
            true,
            reason
        );

        if (!success) {
            return [false, 'Echec du paiement'];
        }

        this.notifier.advancedNotify(player.source, 'Fleeca Banque', `~r~$${money}~s~`, reason, 'CHAR_BANK_MAZE');

        return [true, null];
    }

    public async transfertBetweenPlayers(
        sourceCitizenId: string,
        destCitizenId: string,
        money: number,
        reason: string
    ): Promise<[boolean, string]> {
        const sourcePlayer = this.playerService.getPlayerByCitizenId(sourceCitizenId);
        if (!sourcePlayer) {
            return [false, 'Joueur source inconnu ou pas connecté'];
        }

        const destPlayer = this.playerService.getPlayerByCitizenId(destCitizenId);
        if (!destPlayer) {
            return [false, 'Joueur destinataire inconnu ou pas connecté'];
        }

        const success = await this.bankService.transferBankMoney(
            sourcePlayer.charinfo.account,
            destPlayer.charinfo.account,
            'money',
            money,
            true,
            reason
        );

        if (!success) {
            return [false, 'Echec du paiement'];
        }

        this.notifier.advancedNotify(sourcePlayer.source, 'Fleeca Banque', `~r~$${money}~s~`, reason, 'CHAR_BANK_MAZE');
        this.notifier.advancedNotify(destPlayer.source, 'Fleeca Banque', `~g~$${money}~s~`, reason, 'CHAR_BANK_MAZE');

        return [true, null];
    }
}
