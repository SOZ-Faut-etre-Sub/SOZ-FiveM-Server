import { Inject, Injectable } from '../../core/decorators/injectable';
import { QBCore } from '../qbcore';

@Injectable()
export class PlayerMoneyService {
    @Inject(QBCore)
    private QBCore: QBCore;

    public add(source: number, money: number): boolean {
        return this.QBCore.getPlayer(source).Functions.AddMoney('money', money);
    }

    public remove(source: number, money: number): boolean {
        return this.QBCore.getPlayer(source).Functions.RemoveMoney('money', money);
    }

    public async transfer(
        sourceAccount: string,
        targetAccount: string,
        amount: number,
        timeout = 10000
    ): Promise<boolean> {
        const promise = new Promise<boolean>(resolve => {
            TriggerEvent('banking:server:TransferMoney', sourceAccount, targetAccount, amount, (success: boolean) => {
                resolve(success);
            });
        });

        const timeoutPromise = new Promise<never>((_, reject) => {
            setTimeout(() => {
                reject(new Error('Promise timed out'));
            }, timeout);
        });

        return Promise.race([promise, timeoutPromise]);
    }
}
