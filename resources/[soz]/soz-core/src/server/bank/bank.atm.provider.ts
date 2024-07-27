import { BankPedLocations } from '../../config/bank';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { AtmType, BankAccount } from '../../shared/bank';
import { joaat } from '../../shared/joaat';
import { getDistance, Vector3 } from '../../shared/polyzone/vector';
import { RpcServerEvent } from '../../shared/rpc';
import { BankAccountRepository } from '../repository/bank.account.repository';
import { BankAtmRepository } from '../repository/bank.atm.repository';

@Provider()
export class BankAtmProvider {
    @Inject(BankAtmRepository)
    private bankAtmRepository: BankAtmRepository;

    @Inject(BankAccountRepository)
    private bankAccountRepository: BankAccountRepository;

    @Rpc(RpcServerEvent.BANK_ATM_GET_ACCOUNT)
    public async getAtmAccount(source: number, type: AtmType, coords: Vector3): Promise<BankAccount> {
        const atmAccountId = await this.atmAccountId(type, coords);

        let account = await this.bankAccountRepository.find(atmAccountId);
        if (!account) {
            account = await this.bankAccountRepository.create(atmAccountId, 'bank-atm', type, coords);
        }

        return account;
    }

    @Rpc(RpcServerEvent.BANK_ATM_GET_MONEY)
    public async getAtmMoney(source: number, type: AtmType, coords: Vector3): Promise<number> {
        const atmAccount = await this.getAtmAccount(source, type, coords);

        return atmAccount.money;
    }

    protected async atmAccountId(type: AtmType, coords: Vector3): Promise<string> {
        const atmIdentifier = this.atmIdentifier(type, coords);

        const atm = await this.bankAtmRepository.find(atmIdentifier);
        if ((!atm || !atm.accountId) && coords) {
            return `bank_${this.getClosestFleeca(coords)}`;
        }

        return atm.accountId;
    }

    protected atmHashByCoords(coords: Vector3): number {
        return joaat(coords.map(c => Math.floor(c * 100) / 100).join('_'));
    }

    protected atmIdentifier(type: AtmType, coords: Vector3): string {
        return `atm_${type}_${this.atmHashByCoords(coords)}`;
    }

    protected getClosestFleeca(coords: Vector3): string {
        const orderedFleeca = Object.entries(BankPedLocations)
            .filter(([name]) => name.includes('fleeca'))
            .sort(([, a], [, b]) => getDistance(a, coords) - getDistance(b, coords))
            .map(([name]) => name);

        return orderedFleeca[0];
    }
}
