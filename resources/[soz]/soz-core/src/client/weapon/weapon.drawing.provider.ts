import { Once, OnceStep, OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { wait } from '../../core/utils';
import { ClientEvent } from '../../shared/event';
import { InventoryItem } from '../../shared/item';
import { PlayerData } from '../../shared/player';
import { WeaponOnBack, Weapons } from '../../shared/weapon';
import { ResourceLoader } from '../resources/resource.loader';
import { WeaponService } from './weapon.service';

@Provider()
export class WeaponDrawingProvider {
    private shouldDrawWeapon = true;
    private weaponsToDraw: WeaponOnBack[] = [];
    private weaponAttached: Record<string, number> = {};

    @Inject(ResourceLoader)
    private resourceLoader: ResourceLoader;

    @Inject(WeaponService)
    private weaponService: WeaponService;

    private async updateWeaponDrawList(playerItem: Record<string, InventoryItem> | InventoryItem[]) {
        const weaponToDraw = Object.values(playerItem)
            .filter(item => item.type === 'weapon' && Weapons[item.name.toUpperCase()]?.drawOnBack)
            .map(item => Weapons[item.name.toUpperCase()].drawOnBack);

        if (weaponToDraw.map(w => w.model) !== this.weaponsToDraw.map(w => w.model)) {
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

            const object = CreateObject(weapon.model, 1, 1, 1, true, true, true);
            SetEntityAsMissionEntity(object, true, true);
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
                const weaponModel = Weapons[playerWeapon.name.toUpperCase()].drawOnBack?.model;
                if (weaponModel) {
                    SetEntityAlpha(object, 0, false);
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
        if (!this.shouldDrawWeapon) {
            return;
        }

        await this.updateWeaponDrawList(player.items);
    }

    @OnEvent(ClientEvent.BASE_ENTERED_VEHICLE)
    async onEnteredVehicle() {
        this.shouldDrawWeapon = false;
        await this.undrawWeapon();
    }

    @OnEvent(ClientEvent.BASE_LEFT_VEHICLE)
    async onLeftVehicle() {
        this.shouldDrawWeapon = true;
        await this.drawWeapon();
    }

    @OnEvent(ClientEvent.WEAPON_USE_WEAPON)
    async onUseWeapon(usedWeapon: InventoryItem | null) {
        if (!this.shouldDrawWeapon) {
            return;
        }

        await wait(500);

        const weapon = this.weaponService.getCurrentWeapon();
        const weaponModel = Weapons[usedWeapon.name.toUpperCase()].drawOnBack?.model;
        if (weaponModel) {
            if (this.weaponAttached[weaponModel]) {
                SetEntityAlpha(this.weaponAttached[weaponModel], weapon ? 0 : 255, false);
            }
        }
    }

    @Once(OnceStep.Stop)
    async stop() {
        this.shouldDrawWeapon = false;
        await this.undrawWeapon();
    }
}
