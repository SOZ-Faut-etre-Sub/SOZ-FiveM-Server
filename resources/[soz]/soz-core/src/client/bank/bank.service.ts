import { Injectable } from '@core/decorators/injectable';
import { ClientEvent } from '@public/shared/event/client';
import { ServerEvent } from '@public/shared/event/server';
import { Apartment } from '@public/shared/housing/housing';
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

    public getAtmName(entity: number, type: string) {
        const coords = GetEntityCoords(entity) as Vector3;
        const coordsHash = getLocationHash(coords);

        return `atm_${type}_${coordsHash}`;
    }

    public removeLiquidityRatio(entity: number, type: string, value: number) {
        const coords = GetEntityCoords(entity);
        TriggerServerEvent(ServerEvent.BANK_REMOVE_ATM_LIQUIDITY_RATIO, coords, type, value);
    }

    public openHouseSafe(apartment: Apartment) {
        TriggerEvent(ClientEvent.BANK_SAFE_HOUSE_OPEN_UI, apartment.identifier);
    }
}
