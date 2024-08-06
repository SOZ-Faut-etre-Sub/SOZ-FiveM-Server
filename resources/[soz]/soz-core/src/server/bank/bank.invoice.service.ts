import { BankService } from '@public/server/bank/bank.service';
import { Monitor } from '@public/server/monitor/monitor';
import { Notifier } from '@public/server/notifier';
import { ClientEvent } from '@public/shared/event/client';

import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Invoice } from '../../shared/bank';
import { JobPermission } from '../../shared/job';
import { PlayerData } from '../../shared/player';
import { JobService } from '../job.service';
import { PlayerService } from '../player/player.service';
import { BankInvoiceRepository } from '../repository/bank.invoice.repository';

@Provider()
export class BankInvoiceService {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(JobService)
    private jobService: JobService;

    @Inject(Monitor)
    private monitor: Monitor;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(BankService)
    private bankService: BankService;

    @Inject(BankInvoiceRepository)
    private bankInvoiceRepository: BankInvoiceRepository;

    public async getInvoicesForPlayer(source: number) {
        const player = this.playerService.getPlayer(source);
        if (!player) {
            return;
        }

        return this.bankInvoiceRepository.get(async invoice => {
            return !invoice.payed && !invoice.refused && this.playerHasPermission(player, invoice);
        });
    }

    public async payInvoice(source: number, invoiceId: number, useMarkedMoney = false): Promise<boolean> {
        const player = this.playerService.getPlayer(source);
        if (!player) return false;

        const invoice = await this.bankInvoiceRepository.find(invoiceId);
        if (!invoice) return false;

        if (!(await this.playerHasPermission(player, invoice))) return false;

        const emitter = this.playerService.getPlayerByCitizenId(invoice.emitter);

        if (player.charinfo.account === invoice.targetAccount) {
            if (useMarkedMoney) {
                const money = player.money.money;
                const markedMoney = player.money.marked_money;

                if (money + markedMoney < invoice.amount) {
                    this.notifier.error(source, "Vous n'avez pas assez d'argent");
                    return false;
                }

                let moneyTake = 0;
                let markedMoneyTake = 0;

                if (markedMoney >= invoice.amount) {
                    markedMoneyTake = invoice.amount;
                } else {
                    markedMoneyTake = markedMoney;
                    moneyTake = invoice.amount - markedMoney;
                }

                const moneyTransaction = await this.bankService.transferCashMoney(
                    source,
                    invoice.emitterSafe,
                    'deposit',
                    'money',
                    moneyTake
                );
                if (!moneyTransaction) {
                    this.notifier.error(source, "Le virement n'a pas pu être effectué");
                    return false;
                }

                const markedMoneyTransaction = await this.bankService.transferCashMoney(
                    source,
                    invoice.emitterSafe,
                    'deposit',
                    'marked_money',
                    markedMoneyTake
                );
                if (!markedMoneyTransaction) {
                    this.notifier.error(source, "Le virement n'a pas pu être effectué");
                    return false;
                }
            } else {
                const transaction = await this.bankService.transferCashMoney(
                    source,
                    invoice.emitterSafe,
                    'deposit',
                    'money',
                    invoice.amount
                );

                if (!transaction) {
                    this.notifier.error(source, "Vous n'avez pas assez d'argent");
                    return false;
                }
            }

            if (!(await this.bankInvoiceRepository.setPayed(invoiceId))) return false;

            this.notifier.notify(source, 'Vous avez ~g~payé~s~ votre facture', 'success');

            if (emitter) {
                this.notifier.notify(emitter.source, `Votre facture ~b~${invoice.label}~s~ a été ~g~payée`, 'success');
            }

            this.monitor.traceEvent('invoice_pay', {
                player_source: source,
                invoice_kind: 'invoice',
                invoice_job: '',
                target_source: emitter ? emitter.source : null,
                id: invoice.id,
                amount: invoice.amount,
                target_account: invoice.emitterSafe,
                source_account: invoice.targetAccount,
            });

            TriggerClientEvent(ClientEvent.BANK_PHONE_INVOICE_PAID, player.source, invoice.id);
        } else {
            const transaction = await this.bankService.transferBankMoney(
                invoice.targetAccount,
                invoice.emitterSafe,
                'money',
                invoice.amount
            );
            if (!transaction) {
                this.notifier.error(source, '~r~Echec~s~ du paiement la facture de la société');
                return false;
            }

            if (!(await this.bankInvoiceRepository.setPayed(invoiceId))) return false;

            this.notifier.notify(source, 'Vous avez ~g~payé~s~ la facture de la société', 'success');
            if (emitter) {
                this.notifier.notify(emitter.source, `Votre facture ~b~${invoice.label}~s~ a été ~g~payée`, 'success');
            }

            this.monitor.traceEvent('invoice_pay', {
                player_source: player.source,
                invoice_kind: 'invoice',
                invoice_job: player.job.id,
                target_source: emitter ? emitter.source : null,
                id: invoice.id,
                amount: invoice.amount,
                target_account: invoice.emitterSafe,
                source_account: invoice.targetAccount,
            });

            TriggerClientEvent(ClientEvent.BANK_PHONE_INVOICE_PAID, player.source, invoice.id);
        }

        return true;
    }

    public async rejectInvoice(source: number, invoiceId: number): Promise<boolean> {
        const player = this.playerService.getPlayer(source);
        if (!player) return false;

        const invoice = await this.bankInvoiceRepository.find(invoiceId);
        if (!invoice) return false;

        if (!(await this.playerHasPermission(player, invoice))) return false;

        const emitter = this.playerService.getPlayerByCitizenId(invoice.emitter);

        if (player.charinfo.account === invoice.targetAccount) {
            this.notifier.error(player.source, 'Vous avez ~r~refusé~s~ votre facture');
            if (emitter) {
                this.notifier.error(emitter.source, `Votre facture ~b~${invoice.label}~s~ a été ~r~refusée`);
            }

            this.monitor.traceEvent('invoice_refuse', {
                player_source: player.source,
                invoice_kind: 'invoice',
                invoice_job: '',
                target_source: emitter ? emitter.source : null,
                id: invoice.id,
                amount: invoice.amount,
                target_account: invoice.emitterSafe,
                source_account: invoice.targetAccount,
                title: invoice.label,
            });
        } else {
            this.notifier.error(player.source, 'Vous avez ~r~refusé~s~ la facture de la société');
            if (emitter) {
                this.notifier.error(emitter.source, `Votre facture ~b~${invoice.label}~s~ a été ~r~refusée`);
            }

            this.monitor.traceEvent('invoice_refuse', {
                player_source: player.source,
                invoice_kind: 'invoice',
                invoice_job: player.job.id,
                target_source: emitter ? emitter.source : null,
                id: invoice.id,
                amount: invoice.amount,
                target_account: invoice.emitterSafe,
                source_account: invoice.targetAccount,
                title: invoice.label,
            });
        }

        await this.bankInvoiceRepository.setRejected(invoiceId);
        TriggerClientEvent(ClientEvent.BANK_PHONE_INVOICE_REJECTED, player.source, invoice.id);

        return true;
    }

    public async playerHasPermission(player: PlayerData, invoice: Invoice): Promise<boolean> {
        if (invoice.targetAccount === player.charinfo.account) {
            return true;
        }
        return this.jobService.hasPermission(player, player.job.id, JobPermission.SocietyBankInvoices);
    }
}
