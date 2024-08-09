import { Command } from '@public/core/decorators/command';

import { OffShoreMaxWashAmount } from '../../config/bank';
import { Cron } from '../../core/decorators/cron';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Logger } from '../../core/logger';
import { PrismaService } from '../database/prisma.service';
import { BankAccountRepository } from '../repository/bank.account.repository';

@Provider()
export class BankWashMoneyProvider {
    @Inject(BankAccountRepository)
    private bankAccountRepository: BankAccountRepository;

    @Inject(PrismaService)
    private prismaService: PrismaService;

    @Inject(Logger)
    private logger: Logger;

    @Command('launchWashMoney', { role: 'admin' })
    public async manualWash() {
        await this.launchWashMoney();
    }

    @Cron(2)
    public async launchWashMoney() {
        const accounts = await this.bankAccountRepository.get(
            bank => bank.type === 'offshore' && bank.marked_money > 0
        );
        const maxWashMoney = Math.ceil(OffShoreMaxWashAmount / accounts.length);

        for (const account of accounts) {
            this.logger.info(`[BankWashMoneyProvider] Washing money for ${account.id}`);

            const targetAccount = await this.bankAccountRepository.find(account.id.replace('offshore_', ''));
            if (!targetAccount) {
                this.logger.error(`[BankWashMoneyProvider] Standard account for ${account.id} not found`);
                continue;
            }

            let toWash = maxWashMoney;
            if (account.marked_money < toWash) {
                toWash = account.marked_money;
            }

            const markedTransfer = await this.bankAccountRepository.removeMoney(account.id, toWash, 'marked_money');
            if (markedTransfer) {
                await this.bankAccountRepository.addMoney(targetAccount.id, toWash, 'money');
                this.logger.info(
                    `[BankWashMoneyProvider] Transferred ${toWash} from ${account.id} to ${targetAccount.id}`
                );
            }

            await this.prismaService.bank_statements.create({
                data: {
                    source_accountid: account.id,
                    target_accountid: targetAccount.id,
                    amount: toWash,
                    reason: 'La lessive est faite',
                },
            });

            this.logger.info(`[BankWashMoneyProvider] Finished washing money for ${account.id}`);
        }
    }
}
