import { bank_statements } from '@prisma/client';
import { PrismaService } from '@public/server/database/prisma.service';
import { BankActionType, BankHistoryFilter, BankStatement } from '@public/shared/bank';
import { ClientEvent } from '@public/shared/event/client';

import { Exportable } from '../../core/decorators/exports';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { PlayerService } from '../player/player.service';
import { BankAccountRepository } from '../repository/bank.account.repository';

@Provider()
export class BankStatementsService {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(PrismaService)
    private prismaService: PrismaService;

    @Inject(BankAccountRepository)
    private bankAccountRepository: BankAccountRepository;

    @Exportable('GetStatementsForPlayer')
    public async getStatementsForPlayer(source: number) {
        const player = this.playerService.getPlayer(source);
        if (!player) return;

        return this.getStatementsForAccount(player.charinfo.account);
    }

    public async getStatementsForAccount(accountId: string, filter: BankHistoryFilter = 'all', limit: number = 50) {
        const history = [];
        let queryFilter = {};

        if (filter === 'all') {
            queryFilter = {
                OR: [{ source_accountid: accountId }, { target_accountid: accountId }],
            };
        } else if (filter === 'withdraw') {
            queryFilter = {
                source_accountid: accountId,
            };
        } else if (filter === 'deposit') {
            queryFilter = {
                target_accountid: accountId,
            };
        } else if (filter === 'transfer') {
            queryFilter = {
                OR: [{ source_accountid: accountId }, { target_accountid: accountId }],
                is_transfer: true,
            };
        }

        const rawHistory = await this.prismaService.bank_statements.findMany({
            where: queryFilter,
            orderBy: {
                date: 'desc',
            },
            take: limit,
        });

        for (const statement of rawHistory) {
            history.push(await this.enrichStatement(statement));
        }

        return history;
    }

    public async createStatement(source: string, target: string, amount: number, reason: string, transferFlag = false) {
        const statement = await this.prismaService.bank_statements.create({
            data: {
                source_accountid: source,
                target_accountid: target,
                amount: amount,
                reason,
                is_transfer: transferFlag,
            },
        });

        const enrichedStatement = await this.enrichStatement(statement);

        const sourcePlayer = this.playerService.getPlayerByBankAccount(source);
        if (sourcePlayer) {
            TriggerClientEvent(ClientEvent.BANK_PHONE_NEW_STATEMENT, sourcePlayer.source, enrichedStatement);
        }

        const targetPlayer = this.playerService.getPlayerByBankAccount(target);
        if (targetPlayer) {
            TriggerClientEvent(ClientEvent.BANK_PHONE_NEW_STATEMENT, targetPlayer.source, enrichedStatement);
        }
    }

    protected async enrichStatement(statement: bank_statements): Promise<BankStatement> {
        const source = await this.bankAccountRepository.find(
            statement.source_accountid.replace(/(offshore|safe)_/, '')
        );
        const target = await this.bankAccountRepository.find(
            statement.target_accountid.replace(/(offshore|safe)_/, '')
        );

        return {
            ...statement,
            id: Number(statement.id),
            date: statement.date.getTime(),
            source_label: source?.label,
            target_label: target?.label,
        };
    }
}
