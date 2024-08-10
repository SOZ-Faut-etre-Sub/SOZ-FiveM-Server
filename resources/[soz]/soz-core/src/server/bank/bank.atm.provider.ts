import { AtmLocations } from '../../config/atm';
import { BankPedLocations } from '../../config/bank';
import { OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { AtmType, AtmUiData, BankAccount } from '../../shared/bank';
import { ServerEvent } from '../../shared/event/server';
import { getLocationHash } from '../../shared/locationhash';
import { getDistance, Vector3 } from '../../shared/polyzone/vector';
import { RpcServerEvent } from '../../shared/rpc';
import { PlayerService } from '../player/player.service';
import { BankAccountRepository } from '../repository/bank.account.repository';

@Provider()
export class BankAtmProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;
    @Inject(BankAccountRepository)
    private bankAccountRepository: BankAccountRepository;

    @Rpc(RpcServerEvent.BANK_ATM_REMOVE_LIQUIDITY)
    public async removeAtmLiquidity(source: number, accountId: string, amount: number): Promise<boolean> {
        return this.bankAccountRepository.removeMoney(accountId, amount);
    }

    @Rpc(RpcServerEvent.BANK_ATM_GET_ACCOUNT_UI)
    public async getAtmUiData(source: number, type: AtmType, coords: Vector3): Promise<AtmUiData> {
        const player = this.playerService.getPlayer(source);
        if (!player) {
            return;
        }

        return {
            account: await this.bankAccountRepository.find(player.charinfo.account),
            atm: await this.getAtmAccount(source, type, coords),
            atmType: type,
            atmAccountId: this.atmIdentifier(type, coords),
        };
    }

    @Rpc(RpcServerEvent.BANK_ATM_GET_ACCOUNT)
    public async getAtmAccount(source: number, type: AtmType, coords: Vector3): Promise<BankAccount> {
        const atmAccountId = await this.atmAccountId(type, coords);

        let account = await this.bankAccountRepository.find(atmAccountId);
        if (!account) {
            account = await this.bankAccountRepository.create(atmAccountId, 'bank_atm', type, coords);
        }

        return account;
    }

    @Rpc(RpcServerEvent.BANK_ATM_GET_MONEY)
    public async getAtmMoney(source: number, type: AtmType, coords: Vector3): Promise<number> {
        const atmAccount = await this.getAtmAccount(source, type, coords);
        return atmAccount.money;
    }

    @OnEvent(ServerEvent.BANK_REMOVE_ATM_LIQUIDITY_RATIO)
    public async removeAtmLiquidityRatio({ coords, type, ratio }: { coords: Vector3; type: AtmType; ratio: number }) {
        const atmIdentifier = await this.atmAccountId(type, coords);
        await this.bankAccountRepository.removeMoneyRatio(atmIdentifier, ratio);
    }

    protected async atmAccountId(type: AtmType, coords: Vector3): Promise<string> {
        const atmIdentifier = this.atmIdentifier(type, coords);

        if (type === AtmType.ENTERPRISE) {
            return atmIdentifier;
        }

        if (AtmLocations[atmIdentifier]?.accountId) {
            return AtmLocations[atmIdentifier].accountId;
        }

        const atm = await this.bankAccountRepository.find(atmIdentifier);
        if (atm) {
            return atm.id;
        }

        if (!coords) {
            return null;
        }

        return `bank_${this.getClosestFleeca(coords)}`;
    }

    protected atmIdentifier(type: AtmType, coords: Vector3): string {
        return `atm_${type}_${getLocationHash(coords)}`;
    }

    protected getClosestFleeca(coords: Vector3): string {
        return Object.entries(BankPedLocations)
            .filter(([name]) => name.includes('fleeca'))
            .sort(([, a], [, b]) => getDistance(a, coords) - getDistance(b, coords))
            .map(([name]) => name)
            .pop();
    }
}
