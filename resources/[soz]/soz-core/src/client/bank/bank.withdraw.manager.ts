import { AtmConfig } from '../../config/bank';
import { Inject, Injectable } from '../../core/decorators/injectable';
import { emitRpc } from '../../core/rpc';
import { AtmType, BankAccount } from '../../shared/bank';
import { RpcServerEvent } from '../../shared/rpc';
import { Notifier } from '../notifier';

type BankAtmLastUsage = {
    lastUsage: Date;
    currentWithdraw: number;
};

@Injectable()
export class BankWithdrawManager {
    private lastUsedBank: Record<string, BankAtmLastUsage> = {};

    @Inject(Notifier)
    private notifier: Notifier;

    public async withdraw(identifier: string, bankAccount: string, atmType: AtmType, amount: number): Promise<boolean> {
        const atmAccount = await emitRpc<BankAccount>(RpcServerEvent.BANK_GET_ACCOUNT, bankAccount, 'bank_atm');
        if (!atmAccount) return false;

        const atmConfig = AtmConfig[atmType];

        if (atmConfig.maxWithdrawal) {
            if (amount > atmConfig.maxWithdrawal) {
                this.notifier.notify(
                    `Vous ne pouvez pas retirer plus de ~b~$${atmConfig.maxWithdrawal}~s~ depuis ce terminal`,
                    'error'
                );
                return;
            }

            const lastUse = this.lastUsedBank[identifier];
            if (lastUse) {
                const amountAvailable = atmConfig.maxWithdrawal - lastUse.currentWithdraw;
                const remainingTime = atmConfig.limit + lastUse.lastUsage.getTime() - Date.now();

                if (remainingTime > 0) {
                    if (amountAvailable == 0) {
                        this.notifier.notify(
                            `Limite de retrait atteinte : max. ~b~$${atmConfig.maxWithdrawal}~s~ par tranche de ${atmConfig.limit / 60000} minutes. Revenez dans ~b~${Math.ceil(remainingTime / 60000)} minutes~s~.`,
                            'error'
                        );
                        return;
                    } else if (amount > amountAvailable) {
                        this.notifier.notify(
                            `Limite de retrait atteinte : max. ~b~$${atmConfig.maxWithdrawal}~s~ par tranche de ${atmConfig.limit / 60000} minutes. ~b~$${amountAvailable}~s~ retirables.`,
                            'error'
                        );
                        return;
                    }
                }
            }
        }

        const hasEnoughLiquidity = await emitRpc<boolean>(
            RpcServerEvent.BANK_ATM_REMOVE_LIQUIDITY,
            identifier.startsWith('atm_ent_') ? identifier : bankAccount,
            amount
        );
        if (!hasEnoughLiquidity) {
            this.notifier.notify('Liquidité insuffisante à ce terminal', 'error');
            return;
        }

        this.consumeWithdrawLimit(identifier, amount);
        return true;
    }

    public consumeWithdrawLimit(identifier: string, amount: number): boolean {
        if (!this.lastUsedBank[identifier]) {
            this.lastUsedBank[identifier] = {
                lastUsage: new Date(),
                currentWithdraw: amount,
            };
            return true;
        }

        this.lastUsedBank[identifier].lastUsage = new Date();
        this.lastUsedBank[identifier].currentWithdraw += amount;
        return true;
    }

    public releaseWithdrawLimit(identifier: string, amount: number): boolean {
        if (!this.lastUsedBank[identifier]) {
            return false;
        }

        this.lastUsedBank[identifier].currentWithdraw -= amount;
        return true;
    }
}
