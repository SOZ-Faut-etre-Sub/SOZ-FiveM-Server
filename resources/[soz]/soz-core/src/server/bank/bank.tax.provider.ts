import { Command } from '@public/core/decorators/command';

import { Cron } from '../../core/decorators/cron';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Logger } from '../../core/logger';
import { JobService } from '../job.service';
import { Monitor } from '../monitor/monitor';
import { ConfigurationRepository } from '../repository/configuration.repository';
import { BankService } from './bank.service';

const NewsTaxPercent = 8;

@Provider()
export class BankTaxProvider {
    @Inject(JobService)
    private jobService: JobService;

    @Inject(BankService)
    private bankService: BankService;

    @Inject(ConfigurationRepository)
    private configurationRepository: ConfigurationRepository;

    @Inject(Logger)
    private logger: Logger;

    @Inject(Monitor)
    private monitor: Monitor;

    @Command('paySocietyTaxes', { role: 'admin' })
    public manualTaxe() {
        this.paySocietyTaxes();
    }

    @Cron(5, 0, 3)
    public async paySocietyTaxes() {
        const jobs = Object.values(this.jobService.getJobs());

        for (const job of jobs) {
            const account = job.taxCollectAccounts || [];

            if (account.length === 0) {
                continue;
            }

            let societyMoney = 0;

            for (const acc of account) {
                societyMoney += await this.bankService.getAccountMoney(acc);
            }

            let percentage = 0;
            const jobTaxTier = await this.configurationRepository.getValue('JobTaxTier');

            if (societyMoney <= jobTaxTier.Tier1) {
                percentage = jobTaxTier.Tier1Percentage / 100;
            } else if (societyMoney <= jobTaxTier.Tier2) {
                percentage = jobTaxTier.Tier2Percentage / 100;
            } else if (societyMoney <= jobTaxTier.Tier3) {
                percentage = jobTaxTier.Tier3Percentage / 100;
            } else if (societyMoney <= jobTaxTier.Tier4) {
                percentage = jobTaxTier.Tier4Percentage / 100;
            } else {
                percentage = jobTaxTier.Tier5Percentage / 100;
            }

            for (const acc of account) {
                const tax = Math.round((await this.bankService.getAccountMoney(acc)) * percentage);

                const newsIncome = Math.round((NewsTaxPercent * tax) / 100);

                for (const jobAccount of ['news', 'you-news']) {
                    const result = await this.bankService.transferBankMoney(acc, jobAccount, 'money', newsIncome);

                    if (result) {
                        this.logger.info(`Paiement du ${jobAccount} pour le compte ${acc} de ${newsIncome}`);
                    } else {
                        this.logger.error(`Paiement impossible du ${jobAccount} pour le compte ${acc}: ${result}`);
                    }

                    this.monitor.traceEvent('news_tax', {
                        source_account: acc,
                        target_account: jobAccount,
                        amount: newsIncome,
                        percentage,
                    });
                }

                const gouvIncome = tax - 2 * newsIncome;
                const result = await this.bankService.transferBankMoney(acc, 'gouv', 'money', gouvIncome);

                if (result) {
                    this.logger.info(`Paiement du gouvernement pour le compte ${acc} de ${gouvIncome}`);
                } else {
                    this.logger.error(`Paiement impossible du gouvernement pour le compte ${acc}: ${result}`);
                }

                this.monitor.traceEvent('gouv_tax', {
                    source_account: acc,
                    target_account: 'gouv',
                    amount: gouvIncome,
                    percentage,
                });
            }
        }
    }
}
