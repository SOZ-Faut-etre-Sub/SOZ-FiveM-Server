import { OnEvent } from '../../core/decorators/event';
import { Exportable } from '../../core/decorators/exports';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { Invoice } from '../../shared/bank';
import { ClientEvent } from '../../shared/event/client';
import { ServerEvent } from '../../shared/event/server';
import { getDistance, Vector3 } from '../../shared/polyzone/vector';
import { RpcServerEvent } from '../../shared/rpc';
import { InventoryManager } from '../inventory/inventory.manager';
import { Monitor } from '../monitor/monitor';
import { Notifier } from '../notifier';
import { PlayerService } from '../player/player.service';
import { BankInvoiceRepository } from '../repository/bank.invoice.repository';
import { BankInvoiceService } from './bank.invoice.service';

@Provider()
export class BankInvoiceProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(Monitor)
    private monitor: Monitor;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(BankInvoiceService)
    private bankInvoiceService: BankInvoiceService;

    @Inject(BankInvoiceRepository)
    private bankInvoiceRepository: BankInvoiceRepository;

    @Exportable('GetAllInvoicesForPlayer')
    @Rpc(RpcServerEvent.BANK_GET_INVOICES)
    public async getInvoices(source: number): Promise<Invoice[]> {
        return this.bankInvoiceService.getInvoicesForPlayer(source);
    }

    @Rpc(RpcServerEvent.BANK_CREATE_INVOICE)
    public async createInvoice(
        source: number,
        target: number,
        type: 'personal' | 'society',
        label: string,
        amount: number,
        kind?: string
    ) {
        if (source === target) return false;
        if (amount <= 0) return false;

        const playerSource = this.playerService.getPlayer(source);
        if (!playerSource) return false;

        const playerTarget = this.playerService.getPlayer(target);
        if (!playerTarget) return false;

        const sourcePosition = GetEntityCoords(GetPlayerPed(source)) as Vector3;
        const targetPosition = GetEntityCoords(GetPlayerPed(target)) as Vector3;

        if (getDistance(sourcePosition, targetPosition) > 5) {
            this.notifier.error(source, "Personne n'est à proximité.");
            return false;
        }

        if (!this.inventoryManager.removeItemFromInventory(source, 'paper')) {
            this.notifier.error(source, "Vous n'avez pas de papier sur vous.");
            return false;
        }

        const targetAccount = type === 'society' ? playerTarget.job.id : playerTarget.charinfo.account;

        const invoice = await this.bankInvoiceRepository.create(
            playerSource,
            playerTarget,
            targetAccount,
            label,
            amount,
            kind
        );
        if (!invoice) return false;

        if (await this.bankInvoiceService.playerHasPermission(playerTarget, invoice)) {
            TriggerClientEvent(
                ClientEvent.BANK_PHONE_INVOICE_RECEIVED,
                target,
                invoice.id,
                invoice.label,
                invoice.amount,
                invoice.emitterName
            );
        }

        this.monitor.traceEvent('invoice_emit', {
            player_source: source,
            target_source: target,
            invoice_kind: invoice.kind,
            invoice_job: type === 'society' ? playerTarget.job.id : '',
            position: sourcePosition,
            title: invoice.label,
            id: invoice.id,
            amount: invoice.amount,
            target_account: invoice.targetAccount,
        });

        if (type === 'society') {
            this.notifier.notify(source, `Votre facture ~g~Société~s~ a bien été émise`);
        } else {
            this.notifier.notify(source, `Votre facture a bien été émise`);
        }

        return true;
    }

    @Exportable('PayInvoice')
    @OnEvent(ServerEvent.BANK_INVOICE_PAY)
    public async onInvoicePay(source: number, invoiceId: number, useMarkedMoney = false) {
        return this.bankInvoiceService.payInvoice(source, invoiceId, useMarkedMoney);
    }

    @Exportable('RejectInvoice')
    @OnEvent(ServerEvent.BANK_INVOICE_REJECT)
    public async onInvoiceReject(source: number, invoiceId: number) {
        return this.bankInvoiceService.rejectInvoice(source, invoiceId);
    }
}
