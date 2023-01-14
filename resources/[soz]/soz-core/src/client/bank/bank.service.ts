import { Injectable } from '@core/decorators/injectable';
import { getLocationHash } from '@public/shared/locationhash';
import { Vector3 } from '@public/shared/polyzone/vector';
import { Err, Ok, Result } from '@public/shared/result';

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

    public getBank() {
        return exports['soz-bank'].GetCurrentBank();
    }

    private twoDigitsFloor(u: number) {
        const base = (Math.floor(u * 100) / 100).toString();
        return base.includes('.') ? base : base + '.0';
    }

    public getAtmName(entity: number, type: string) {
        const coords = GetEntityCoords(entity) as Vector3;
        const coordsHash = getLocationHash(coords);

        return `atm_${type}_${coordsHash}`;
    }

    public removeLiquidityRatio(entity: number, type: string, value: number) {
        const coords = GetEntityCoords(entity);
        TriggerServerEvent(
            'banking:server:RemoveAtmLiquidityRatio',
            { x: coords[0], y: coords[1], z: coords[2] },
            type,
            value
        );
    }
}
