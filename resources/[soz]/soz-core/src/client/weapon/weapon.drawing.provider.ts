import { On, Once, OnceStep, OnEvent } from '@core/decorators/event';
import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { POLICE_SHIELD_MODEL, POLICE_SHIELD_OBJECT } from '@private/shared/police';
import { PlayerService } from '@public/client/player/player.service';
import { PlayerInventoryUpdate, PlayerUpdate } from '@public/core/decorators/player';
import { InventoryItem } from '@public/shared/inventory';

import { ClientEvent } from '../../shared/event';
import {
    DrawPositions,
    DrawPositionsWithShield,
    WeaponConfig,
    WeaponName,
    Weapons,
    WeaponsType,
} from '../../shared/weapons/weapon';
import { AttachedObjectService } from '../object/attached.object.service';
import { WeaponService } from './weapon.service';

@Provider()
export class WeaponDrawingProvider {
    private shouldDrawWeapon = true;
    private shouldAdminDrawWeapon = true;
    private weaponsToDraw: WeaponsType[] = [];
    private weaponAttached: Record<string, number> = {};

    @Inject(AttachedObjectService)
    private attachedObjectService: AttachedObjectService;

    @Inject(WeaponService)
    private weaponService: WeaponService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    currentDrawPosition: string = null;

    private async updateWeaponDrawList(playerItem: Record<number, InventoryItem>) {
        const weaponToDraw: WeaponName[] = Object.values(playerItem)
            .filter(
                item =>
                    (item.type === 'weapon' || item.name === POLICE_SHIELD_OBJECT) &&
                    Weapons[item.name.toUpperCase()] &&
                    Weapons[item.name.toUpperCase()].drawPositionInfo
            )
            .map(item => item.name.toUpperCase() as WeaponName);

        if (weaponToDraw.join('') !== this.weaponsToDraw.join('')) {
            await this.undrawWeapon();
            this.weaponsToDraw = weaponToDraw;
            await this.drawWeapon();
        }
    }

    @PlayerUpdate()
    public async forceRedrawWeapon() {
        const drawPosition = this.playerService.getPlayer().metadata.cloth_type === 'SWAT' ? 'swat' : null;
        if (drawPosition !== this.currentDrawPosition) {
            await this.undrawWeapon();
            await this.drawWeapon();
        }
    }

    private async drawWeapon() {
        if (!this.shouldDrawWeapon || !this.shouldAdminDrawWeapon || this.playerService.getState().isInGameHub) {
            return;
        }

        let drawPosition;
        if (this.playerService.getPlayer().metadata.cloth_type === 'SWAT') {
            drawPosition = DrawPositionsWithShield;
            this.currentDrawPosition = 'swat';
        } else {
            drawPosition = DrawPositions;
            this.currentDrawPosition = null;
        }
        for (const weapon of this.weaponsToDraw) {
            const config: WeaponConfig = Weapons[weapon];
            if (this.weaponAttached[config.drawPositionInfo.model]) continue;
            this.weaponAttached[config.drawPositionInfo.model] = -1;

            const object = await this.attachedObjectService.attachObjectToPlayer({
                bone: 24816,
                model: config.drawPositionInfo.model,
                position: drawPosition[config.drawPositionInfo.type].position,
                rotation: drawPosition[config.drawPositionInfo.type].rotation,
                rotationOrder: 2,
            });

            this.weaponAttached[config.drawPositionInfo.model] = object;

            const playerWeapon = this.weaponService.getCurrentWeapon();
            if (playerWeapon) {
                const weaponModel = Weapons[playerWeapon.name.toUpperCase()].drawPositionInfo?.model;
                if (weaponModel) {
                    SetEntityVisible(object, false, false);
                }
            }

            if (config.extaDraw) {
                for (const extra of config.extaDraw) {
                    const boneIndex = GetEntityBoneIndexByName(object, extra.bone);

                    const extraObject = await this.attachedObjectService.attachObjectToPlayer({
                        bone: boneIndex,
                        model: extra.model,
                        position: [0, 0, 0],
                        rotation: [0, 0, 0],
                        rotationOrder: 2,
                        entity: object,
                    });
                    this.weaponAttached[config.drawPositionInfo.model + extra.model] = extraObject;
                }
            }
        }
    }

    private async undrawWeapon() {
        Object.values(this.weaponAttached).forEach(weapon => {
            this.attachedObjectService.detachObjectToPlayer(weapon);
        });
        this.weaponAttached = {};
    }

    @PlayerInventoryUpdate()
    async setupPlayerWeaponsDraw(items: Record<number, InventoryItem>) {
        await this.updateWeaponDrawList(items);
        const weapon = this.weaponService.getCurrentWeapon();

        if (weapon) {
            const newWeapon = Object.values(items).find(item => item.metadata?.serial == weapon.metadata?.serial);
            if (newWeapon) {
                this.weaponService.updateCurrentWeapon(newWeapon);
            } else {
                await this.weaponService.clear();
            }
        }

        await this.refreshDrawWeapons();
    }

    public async undrawAdminWeapons() {
        this.shouldAdminDrawWeapon = false;
        await this.undrawWeapon();
    }

    public async drawAdminWeapons() {
        this.shouldAdminDrawWeapon = true;
        await this.drawWeapon();
    }

    @OnEvent(ClientEvent.BASE_ENTERED_VEHICLE)
    public async undrawWeapons() {
        if (IsThisModelABike(GetEntityModel(GetVehiclePedIsIn(PlayerPedId(), false)))) {
            return;
        }

        this.shouldDrawWeapon = false;
        await this.undrawWeapon();
    }

    @OnEvent(ClientEvent.BASE_LEFT_VEHICLE)
    public async drawWeapons() {
        if (!this.shouldDrawWeapon) {
            this.shouldDrawWeapon = true;
            await this.drawWeapon();
        }
    }

    async refreshDrawWeapons() {
        Object.values(this.weaponAttached).forEach(weapon => {
            SetEntityVisible(weapon, true, false);
        });

        const weapon = this.weaponService.getCurrentWeapon();
        if (weapon) {
            const weaponModel = Weapons[weapon.name.toUpperCase()]?.drawPositionInfo?.model;
            if (weaponModel) {
                if (this.weaponAttached[weaponModel]) {
                    SetEntityVisible(this.weaponAttached[weaponModel], !weapon, false);
                }
            }
        }
    }

    public async onUseWeapon(usedWeapon: InventoryItem | null) {
        if (!this.shouldDrawWeapon) {
            return;
        }

        Object.values(this.weaponAttached).forEach(weapon => {
            SetEntityVisible(weapon, true, false);
        });

        const weapon = this.weaponService.getCurrentWeapon();
        const weaponModel = Weapons[usedWeapon?.name.toUpperCase() as WeaponName]?.drawPositionInfo?.model;
        if (weaponModel) {
            if (this.weaponAttached[weaponModel]) {
                SetEntityVisible(this.weaponAttached[weaponModel], !weapon, false);
            }
        }
    }

    public getShieldObject() {
        return this.weaponAttached[POLICE_SHIELD_MODEL];
    }

    @Once(OnceStep.Stop)
    async stop() {
        this.shouldDrawWeapon = false;
        await this.undrawWeapon();
    }

    @On('QBCore:Client:OnPlayerUnload')
    async playerUnLoaded() {
        this.shouldDrawWeapon = false;
        await this.undrawWeapon();
    }
}
