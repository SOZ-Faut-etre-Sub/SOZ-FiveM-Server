import { Injectable } from '../../core/decorators/injectable';
import { Err, Ok, Result } from '../../shared/result';

@Injectable()
export class BankService {
    public transferBankMoney(source: string, target: string, amount: number): Promise<Result<boolean, string>> {
        return new Promise(resolve => {
            exports['soz-bank'].TransferMoney(source, target, amount, (success, reason) => {
                if (success) {
                    resolve(Ok(true));
                } else {
                    resolve(Err(reason));
                }
            });
        });
    }
}
