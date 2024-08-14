import { OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { emitRpc } from '../../core/rpc';
import { BankMoneyType, BankUiData } from '../../shared/bank';
import { NuiEvent } from '../../shared/event/nui';
import { RpcServerEvent } from '../../shared/rpc';
import { NuiDispatch } from '../nui/nui.dispatch';
import { BankService } from './bank.service';

@Provider()
export class BankNuiProvider {
    @Inject(NuiDispatch)
    private nuiDispatch: NuiDispatch;

    @Inject(BankService)
    private bankService: BankService;

    @OnNuiEvent(NuiEvent.BankAnimation)
    public async triggerAnimation({ type }: { type: 'enter' | 'exit' }) {
        return this.bankService.triggerAtmAnimation(type);
    }

    @OnNuiEvent(NuiEvent.BankTransferAction)
    public async onTransferAction({
        accountSource,
        accountTarget,
        moneyType,
        amount = 0,
        reason = '',
    }: {
        accountSource: string;
        accountTarget: string;
        moneyType: BankMoneyType;
        amount: number;
        reason: string;
    }) {
        const isTransferred = await emitRpc<boolean>(
            RpcServerEvent.BANK_TRANSFER_ACTION,
            accountSource,
            accountTarget,
            moneyType,
            amount,
            reason
        );
        if (!isTransferred) return;

        const accountUiData = await emitRpc<BankUiData>(RpcServerEvent.BANK_GET_ACCOUNT_UI);
        this.nuiDispatch.dispatch('bank', 'UpdateAccountData', accountUiData);
    }

    @OnNuiEvent(NuiEvent.BankCreateOffshoreAccount)
    public async createOffshoreAccount() {
        const isCreated = await emitRpc<boolean>(RpcServerEvent.BANK_CREATE_OFFSHORE_ACCOUNT);
        if (!isCreated) return;

        const accountUiData = await emitRpc<BankUiData>(RpcServerEvent.BANK_GET_ACCOUNT_UI);
        this.nuiDispatch.dispatch('bank', 'UpdateAccountData', accountUiData);
    }

    @OnNuiEvent(NuiEvent.BankContactAdd)
    public async addContact({ label, iban }: { label: string; iban: string }) {
        const isCreated = await emitRpc(RpcServerEvent.BANK_CONTACT_ADD, label, iban);
        if (!isCreated) return;

        const accountUiData = await emitRpc<BankUiData>(RpcServerEvent.BANK_GET_ACCOUNT_UI);
        this.nuiDispatch.dispatch('bank', 'UpdateAccountData', accountUiData);
    }

    @OnNuiEvent(NuiEvent.BankContactDelete)
    public async deleteContact({ id }: { id: number }) {
        const isDeleted = await emitRpc(RpcServerEvent.BANK_CONTACT_REMOVE, id);
        if (!isDeleted) return;

        const accountUiData = await emitRpc<BankUiData>(RpcServerEvent.BANK_GET_ACCOUNT_UI);
        this.nuiDispatch.dispatch('bank', 'UpdateAccountData', accountUiData);
    }
}
