import { BankService } from '@public/server/bank/bank.service';
import { TaxRepository } from '@public/server/repository/tax.repository';
import { BankMoneyType, TaxType } from '@public/shared/bank';

import { Inject, Injectable } from '../../core/decorators/injectable';
import { QBCore } from '../qbcore';

@Injectable()
export class PlayerMoneyService {
    @Inject(QBCore)
    private QBCore: QBCore;

    @Inject(TaxRepository)
    private taxRepository: TaxRepository;

    @Inject(BankService)
    private bankService: BankService;

    public add(source: number, money: number, type: BankMoneyType = 'money'): boolean {
        if (isNaN(money)) {
            return;
        }
        return this.QBCore.getPlayer(source).Functions.AddMoney(type, money);
    }

    /**
     * Buy something without the Tax percentage
     *
     * All prices should be transferred without Tax, the tax will be added automatically and only the display can be changed to display it
     */
    public async buy(source: number, money: number, tax: TaxType, type: BankMoneyType = 'money') {
        if (isNaN(money)) {
            return false;
        }

        if (tax === null) {
            return this.QBCore.getPlayer(source).Functions.RemoveMoney(type, money);
        }

        const taxValue = (await this.taxRepository.getTaxValue(tax)) / 100;
        const taxMoney = Math.round(money * taxValue);
        const realMoney = money + taxMoney;

        const moneyRemoved = this.QBCore.getPlayer(source).Functions.RemoveMoney(type, realMoney);

        if (taxMoney > 0 && moneyRemoved) {
            await this.bankService.addAccountMoney('safe_gouv', taxMoney, type, true);
        }

        return moneyRemoved;
    }

    public remove(source: number, money: number, type: BankMoneyType = 'money'): boolean {
        if (isNaN(money)) {
            return;
        }
        return this.QBCore.getPlayer(source).Functions.RemoveMoney(type, money);
    }

    public get(source: number, type: BankMoneyType = 'money'): number {
        return this.QBCore.getPlayer(source).Functions.GetMoney(type);
    }
}
