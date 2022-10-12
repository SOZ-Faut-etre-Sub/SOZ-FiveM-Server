import { Injectable } from '../../core/decorators/injectable';
import { Err, Ok, Result } from '../../shared/result';

@Injectable()
export class BankService {
    // TODO: Enforce better type for source and target
    public transferBankMoney(source: string, target: string, amount: number): Promise<[boolean, string]> {
        return new Promise(resolve => {
            exports['soz-bank'].TransferMoney(source, target, amount, (success, reason) => {
                resolve([success, reason]);
            });
        });
    }

    // TODO: Enforce better type for source and target
    public transferCashMoney(source: string, target: number, amount: number): Promise<Result<boolean, string>> {
        return new Promise(resolve => {
            exports['soz-bank'].TransferCashMoney(source, target, amount, (success, reason) => {
                if (success) {
                    resolve(Ok(true));
                } else {
                    resolve(Err(reason));
                }
            });
        });
    }
}
