import { Command } from '@public/core/decorators/command';
import { PlayerService } from '@public/server/player/player.service';
import { ApartmentRentTaxeRepository } from '@public/server/repository/apartment.rent.taxe';
import { HousingRepository } from '@public/server/repository/housing.repository';
import { TaxType } from '@public/shared/tax';

import { Cron } from '../../core/decorators/cron';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Logger } from '../../core/logger';
import { HousingProvider } from '../housing/housing.provider';
import { JobService } from '../job.service';
import { Monitor } from '../monitor/monitor';
import { ConfigurationRepository } from '../repository/configuration.repository';
import { BankService } from './bank.service';
import { BankStatementsService } from './bank.statements.service';
import { PriceService } from './price.service';

const NewsTaxPercent = 8;
const MAIN_APARTMENT_RENT_TAXE = 0.01;
const SECONDARY_APARTMENT_RENT_TAXE = 0.005;

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

    @Inject(HousingRepository)
    private housingRepository: HousingRepository;

    @Inject(HousingProvider)
    private housingProvider: HousingProvider;

    @Inject(ApartmentRentTaxeRepository)
    private apartmentRentTaxeRepository: ApartmentRentTaxeRepository;

    @Inject(BankStatementsService)
    private bankStatementsService: BankStatementsService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(PriceService)
    private priceService: PriceService;

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

    @Cron(4, 30)
    public async saveApartmentRentTaxes() {
        const apartments = await this.housingRepository.getAllOwnedPlayerApartmentForTaxes();

        const ownerAndTaxes = {};
        for (const apartment of apartments) {
            ownerAndTaxes[apartment.owner] ??= {
                citizenid: apartment.owner,
                value: 0,
            };

            const rent_taxe =
                apartment.owner === apartment.tenant ? SECONDARY_APARTMENT_RENT_TAXE : MAIN_APARTMENT_RENT_TAXE;
            const price = await this.priceService.getPrice(apartment.price, TaxType.HOUSING);

            ownerAndTaxes[apartment.owner].value += Math.round(price * rent_taxe);
        }

        await this.apartmentRentTaxeRepository.createTaxeEntryies(Object.values(ownerAndTaxes));
    }

    @Cron(5, 0, 3)
    public async payApartmentRentTaxes() {
        const taxes = await this.apartmentRentTaxeRepository.getWeeklyTaxes();

        const playerTaxes: Record<number, number[]> = {};

        for (const taxe of taxes) {
            playerTaxes[taxe.citizenid] ??= [];
            playerTaxes[taxe.citizenid].push(taxe.value);
        }

        for (const [citizenId, taxeAmounts] of Object.entries(playerTaxes)) {
            try {
                const amountToPay = Math.round(
                    taxeAmounts.reduce((acc, current) => acc + current, 0) / Math.max(7, taxeAmounts.length)
                );

                const account = await this.playerService.getBankAccountFromCitizenId(citizenId);
                if (!account) {
                    continue;
                }

                if (!(await this.bankService.removeAccountMoney(account, amountToPay))) {
                    const dbApartments = await this.housingRepository.getAllApartmentForCitizenId(citizenId);
                    for (const dbApartment of dbApartments) {
                        const [property, apartment] = await this.housingRepository.getApartment(
                            dbApartment.propertyId,
                            dbApartment.id
                        );

                        if (!property || !apartment || !apartment.housing_taxe_enabled) {
                            continue;
                        }

                        this.housingProvider.clearApartment(property, apartment);

                        this.monitor.traceEvent('house_taxe_clean', {
                            citizen_id: citizenId,
                            house_id: dbApartment.identifier,
                        });
                    }
                    await this.bankStatementsService.createStatement(
                        '',
                        account,
                        0,
                        'Taxe immobilière - Fond insuffisant'
                    );
                    continue;
                }

                await this.bankStatementsService.createStatement(account, '', amountToPay, 'Taxe immobilière');
            } catch (error) {
                continue;
            }
        }

        await this.apartmentRentTaxeRepository.deletePreviousTaxes();
    }

    @Command('save-taxes', {
        role: ['admin'],
    })
    public async triggerSaveTaxeCommand() {
        await this.saveApartmentRentTaxes();
    }

    @Command('pay-taxes', {
        role: ['admin'],
        description: 'Manual trigger for house taxes. DO NOT RUN ON PRODUCTION',
    })
    public async triggerPayTaxeCommand() {
        await this.payApartmentRentTaxes();
    }

    @Command('clear-taxes', {
        role: ['admin'],
        description: 'Manual trigger delete all house taxes. DO NOT RUN ON PRODUCTION',
    })
    public async triggerClearTaxeCommand() {
        await this.apartmentRentTaxeRepository.deleteAllTaxes();
    }
}
