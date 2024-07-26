import { SocietySafeStorage } from '../../config/bank';
import { Once, OnceStep, OnEvent, OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { emitRpc } from '../../core/rpc';
import { BankAccount } from '../../shared/bank';
import { ClientEvent } from '../../shared/event/client';
import { NuiEvent } from '../../shared/event/nui';
import { BoxZone } from '../../shared/polyzone/box.zone';
import { Ok } from '../../shared/result';
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
                            const safe = await emitRpc<BankAccount>(
                                RpcServerEvent.BANK_SAFE_GET_ACCOUNT,
                                `safe_${job}`
                            );
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
    }: {
        type: 'deposit' | 'withdraw';
        safe: string;
        moneyType: 'money' | 'marked_money';
        amount: number;
    }) {
        const isDone = await emitRpc<boolean>(RpcServerEvent.BANK_SAFE_TRANSFER_ACTION, type, safe, moneyType, amount);
        return Ok(isDone);
    }

    @OnEvent(ClientEvent.BANK_SAFE_HOUSE_OPEN_UI)
    public async onHouseOpenUI(identifier: string) {
        const safe = await emitRpc<BankAccount>(RpcServerEvent.BANK_SAFE_GET_ACCOUNT, identifier);
        if (!safe) return;

        this.nuiDispatch.dispatch('bank_safe', 'ShowSafe', safe);
    }
}
