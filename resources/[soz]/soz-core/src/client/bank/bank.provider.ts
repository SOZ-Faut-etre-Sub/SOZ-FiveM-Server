import { Provider } from '../../core/decorators/provider';

@Provider()
export class BankProvider {
    // TODO: Enforce better type for source and target
    public transferBankMoney(source: string, target: string, amount: number): Promise<[boolean, string]> {
        return new Promise(resolve => {
            exports['soz-bank'].TransferMoney(source, target, amount, (success, reason) => {
                resolve([success, reason]);
            });
        });
    }

    // TODO: Enforce better type for source and target
    public transferCashMoney(source: string, target: string, amount: number): Promise<[boolean, string]> {
        return new Promise(resolve => {
            exports['soz-bank'].TransferMoney(source, target, amount, (success, reason) => {
                resolve([success, reason]);
            });
        });
    }
}
