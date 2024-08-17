import { Inject, Injectable } from '@core/decorators/injectable';
import { AnimationService } from '@public/client/animation/animation.service';
import { ClientEvent } from '@public/shared/event/client';
import { ServerEvent } from '@public/shared/event/server';
import { Apartment } from '@public/shared/housing/housing';
import { getLocationHash } from '@public/shared/locationhash';
import { MenuType } from '@public/shared/nui/menu';
import { Vector3 } from '@public/shared/polyzone/vector';

@Injectable()
export class BankService {
    @Inject(AnimationService)
    private animationService: AnimationService;

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

    public async triggerAtmAnimation(type: 'enter' | 'exit' = 'enter') {
        return this.animationService.playAnimation({
            base: {
                dictionary: `anim@mp_atm@${type}`,
                name: type,
                blendInSpeed: 8.0,
                blendOutSpeed: -8.0,
                duration: 3000,
                options: {
                    onlyUpperBody: true,
                },
                playbackRate: 0,
                lockX: false,
                lockY: false,
                lockZ: false,
            },
        });
    }

    public async openGangSafe(gangId: number) {
        const safeId = 'gang_' + gangId;
        const [isAllowed, money, black_money] = await emitQBRpc<any>('banking:server:openSafeStorage', safeId);
        if (!isAllowed) {
            this.notifier.error("Vous n'avez pas accès à ce coffre");
            return;
        }

        this.nuiMenu.openMenu(
            MenuType.SafeStorage,
            {
                id: safeId,
                banner: 'menu_inventory',
                money: money,
                marked_money: black_money,
                showMoney: false,
            },
            {
                position: {
                    position: GetEntityCoords(PlayerPedId()) as Vector3,
                    distance: 1.0,
                },
                originMenuType: this.nuiMenu.getOpened(),
            }
        );
    }
}
