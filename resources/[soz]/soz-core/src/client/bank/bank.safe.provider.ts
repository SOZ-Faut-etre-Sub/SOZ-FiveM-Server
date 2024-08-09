import { SocietySafeStorage } from '../../config/bank';
import { Once, OnceStep, OnEvent, OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { emitRpc } from '../../core/rpc';
import { BankAccount, BankActionType, BankMoneyType, BankUiData } from '../../shared/bank';
import { ClientEvent } from '../../shared/event/client';
import { NuiEvent } from '../../shared/event/nui';
import { BoxZone } from '../../shared/polyzone/box.zone';
import { RpcServerEvent } from '../../shared/rpc';
import { NuiDispatch } from '../nui/nui.dispatch';
import { TargetFactory } from '../target/target.factory';

@Provider()
export class BankSafeProvider {
    @Inject(NuiDispatch)
    private nuiDispatch: NuiDispatch;

    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Once(OnceStep.PlayerLoaded)
    public async init() {
        Object.entries(SocietySafeStorage).forEach(([job, safe]) => {
            this.targetFactory.createForBoxZone(
                `bank:safe:${job}`,
                BoxZone.fromZone(safe.zone),
                [
                    {
                        label: 'Ouvrir',
                        icon: 'c:bank/compte_safe.png',
                        action: async () => {
                            const safe = await emitRpc<BankAccount>(RpcServerEvent.BANK_GET_ACCOUNT, `safe_${job}`);
                            if (!safe) return;

                            this.nuiDispatch.dispatch('bank_safe', 'ShowSafe', safe);
                        },
                        job,
                    },
                ],
                2.5
            );
        });
    }

    @OnNuiEvent(NuiEvent.BankSafeTransferAction)
    public async onTransferAction({
        type,
        safe,
        moneyType,
        amount = 0,
        refreshNui,
    }: {
        type: BankActionType;
        safe: string;
        moneyType: BankMoneyType;
        amount: number;
        refreshNui: 'bank';
    }) {
        const result = await emitRpc<boolean>(RpcServerEvent.BANK_CASH_TRANSFER_ACTION, type, safe, moneyType, amount);
        if (!result) return;

        if (refreshNui !== 'bank') return;

        const accountUiData = await emitRpc<BankUiData>(RpcServerEvent.BANK_GET_ACCOUNT_UI);
        this.nuiDispatch.dispatch('bank', 'UpdateAccountData', accountUiData);
    }

    @OnEvent(ClientEvent.BANK_SAFE_HOUSE_OPEN_UI)
    public async onHouseOpenUI(identifier: string) {
        const safe = await emitRpc<BankAccount>(RpcServerEvent.BANK_GET_ACCOUNT, identifier);
        if (!safe) return;

        this.nuiDispatch.dispatch('bank_safe', 'ShowSafe', safe);
    }
}
