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
}
