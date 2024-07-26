import { SocietySafeStorage } from '../../config/bank';
import { Once, OnceStep, OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { emitRpc } from '../../core/rpc';
import { BankAccount } from '../../shared/bank';
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
                            const safe = await emitRpc<BankAccount>(RpcServerEvent.BANK_SAFE_GET_ACCOUNT, job);
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
        console.log('onTransferAction', type, safe, moneyType, amount);
        const isDone = await emitRpc<boolean>(RpcServerEvent.BANK_SAFE_TRANSFER_ACTION, type, safe, moneyType, amount);
        return Ok(isDone);
    }
}
