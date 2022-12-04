import { Once, OnceStep, OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { wait } from '../../core/utils';
import { ClientEvent } from '../../shared/event';
import { InventoryItem } from '../../shared/item';
import { PlayerData } from '../../shared/player';
import { WeaponDrawPosition, Weapons } from '../../shared/weapons/weapon';
import { ResourceLoader } from '../resources/resource.loader';
import { WeaponService } from './weapon.service';

@Provider()
export class WeaponDrawingProvider {
    private shouldDrawWeapon = true;
    private weaponsToDraw: WeaponDrawPosition[] = [];
    private weaponAttached: Record<string, number> = {};

    @Inject(ResourceLoader)
    private resourceLoader: ResourceLoader;

    @Inject(WeaponService)
    private weaponService: WeaponService;

    private async updateWeaponDrawList(playerItem: Record<string, InventoryItem> | InventoryItem[]) {
        const weaponToDraw = Object.values(playerItem)
            .filter(
                item =>
                    item.type === 'weapon' &&
                    Weapons[item.name.toUpperCase()] &&
                    Weapons[item.name.toUpperCase()].drawPosition
            )
            .map(item => Weapons[item.name.toUpperCase()].drawPosition);

        if (weaponToDraw.map(w => w.model).join('') !== this.weaponsToDraw.map(w => w.model).join('')) {
            await this.undrawWeapon();
            this.weaponsToDraw = weaponToDraw;
            await this.drawWeapon();
        }
    }

    private async drawWeapon() {
        for (const weapon of this.weaponsToDraw) {
            if (this.weaponAttached[weapon.model]) {
                continue;
            }

            await this.resourceLoader.loadModel(weapon.model);

            const object = CreateObject(weapon.model, 1, 1, 1, true, true, false);
            SetEntityAsMissionEntity(object, true, true);
            SetEntityCollision(object, false, false);
            SetNetworkIdCanMigrate(ObjToNet(object), false);
            AttachEntityToEntity(
                object,
                PlayerPedId(),
                GetPedBoneIndex(PlayerPedId(), 24816),
                weapon.position[0],
                weapon.position[1],
                weapon.position[2],
                weapon.rotation[0],
                weapon.rotation[1],
                weapon.rotation[2],
                true,
                true,
                false,
                false,
                2,
                true
            );

            const playerWeapon = this.weaponService.getCurrentWeapon();
            if (playerWeapon) {
                const weaponModel = Weapons[playerWeapon.name.toUpperCase()].drawPosition?.model;
                if (weaponModel) {
                    SetEntityVisible(object, false, false);
                }
            }

            this.weaponAttached[weapon.model] = object;
        }
    }

    private async undrawWeapon() {
        Object.values(this.weaponAttached).forEach(weapon => {
            DeleteObject(weapon);
        });
        this.weaponAttached = {};
    }

    @Once(OnceStep.PlayerLoaded)
    async onPlayerLoaded(player: PlayerData) {
        this.shouldDrawWeapon = true;
        await this.updateWeaponDrawList(player.items);
    }

    @OnEvent(ClientEvent.PLAYER_UPDATE)
    async onPlayerUpdate(player: PlayerData) {
        await this.updateWeaponDrawList(player.items);

        if (!this.shouldDrawWeapon) {
            return;
        }

        const weapon = this.weaponService.getCurrentWeapon();

        if (weapon) {
            if (
                !Object.values(player.items)
                    .map(i => i.name)
                    .includes(weapon.name)
            ) {
                await this.weaponService.clear();
            }
        }
    }

    @OnEvent(ClientEvent.BASE_ENTERED_VEHICLE)
    @OnEvent(ClientEvent.ADMIN_NOCLIP_ENABLED)
    async undrawWeapons() {
        this.shouldDrawWeapon = false;
        await this.undrawWeapon();
    }

    @OnEvent(ClientEvent.BASE_LEFT_VEHICLE)
    @OnEvent(ClientEvent.ADMIN_NOCLIP_DISABLED)
    async drawWeapons() {
        this.shouldDrawWeapon = true;
        await this.drawWeapon();
    }

    @OnEvent(ClientEvent.WEAPON_USE_WEAPON)
    async onUseWeapon(usedWeapon: InventoryItem | null) {
        if (!this.shouldDrawWeapon) {
            return;
        }

        await wait(500);

        Object.values(this.weaponAttached).forEach(weapon => {
            SetEntityVisible(weapon, true, false);
        });

        const weapon = this.weaponService.getCurrentWeapon();
        const weaponModel = Weapons[usedWeapon.name.toUpperCase()]?.drawPosition?.model;
        if (weaponModel) {
            if (this.weaponAttached[weaponModel]) {
                SetEntityVisible(this.weaponAttached[weaponModel], !weapon, false);
            }
        }
    }

    @Once(OnceStep.Stop)
    async stop() {
        this.shouldDrawWeapon = false;
        await this.undrawWeapon();
    }
}
