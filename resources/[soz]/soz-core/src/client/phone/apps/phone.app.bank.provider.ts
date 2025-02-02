import { PlayerService } from '@public/client/player/player.service';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { ClientEvent } from '@public/shared/event/client';

import { Once, OnceStep, OnEvent, OnNuiEvent } from '../../../core/decorators/event';
import { emitRpc } from '../../../core/rpc';
import { NuiEvent } from '../../../shared/event/nui';
import { RpcServerEvent } from '../../../shared/rpc';
import { NuiDispatch } from '../../nui/nui.dispatch';

@Provider()
export class PhoneAppBankProvider {
    @Inject(PlayerService)
    private readonly playerService: PlayerService;

    @Inject(NuiDispatch)
    private readonly nuiDispatch: NuiDispatch;

    @Once(OnceStep.NuiLoaded)
    @OnEvent(ClientEvent.ADMIN_SWITCH_CHARACTER)
    async onNuiLoaded() {
        await this.updateBankBalance();
    }

    @OnNuiEvent(NuiEvent.PhoneAppBankPayInvoice)
    async onPayInvoice(invoiceId: string) {
        await emitRpc(RpcServerEvent.BANK_PAY_INVOICE, invoiceId);
        await this.updateBankBalance();
    }

    @OnNuiEvent(NuiEvent.PhoneAppBankRejectInvoice)
    async onRejectInvoice(invoiceId: string) {
        await emitRpc(RpcServerEvent.BANK_REJECT_INVOICE, invoiceId);
        await this.updateBankBalance();
    }

    @OnEvent(ClientEvent.PHONE_APP_BANK_UPDATE_BALANCE)
    protected async updateBankBalance() {
        const player = this.playerService.getPlayer();
        if (!player) {
            return;
        }

        const money = await emitRpc<number>(RpcServerEvent.BANK_GET_ACCOUNT_MONEY, player.charinfo.account);

        this.nuiDispatch.dispatch('phone', 'AppBankSetData', {
            name: `${player.charinfo.firstname} ${player.charinfo.lastname}`,
            account: player.charinfo.account,
            balance: money,
        });
    }
}
