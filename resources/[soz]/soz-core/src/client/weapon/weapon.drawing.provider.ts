import { On, Once, OnceStep, OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { wait } from '../../core/utils';
import { ClientEvent } from '../../shared/event';
import { InventoryItem } from '../../shared/item';
import { PlayerData } from '../../shared/player';
import { VehicleClass } from '../../shared/vehicle/vehicle';
import { WeaponDrawPosition, Weapons } from '../../shared/weapons/weapon';
import { ResourceLoader } from '../resources/resource.loader';
import { WeaponService } from './weapon.service';

@Provider()
export class WeaponDrawingProvider {
    private shouldDrawWeapon = true;
    private shouldAdminDrawWeapon = true;
    private weaponsToDraw: WeaponDrawPosition[] = [];
    private weaponAttached: Record<string, number> = {};
    private playerLoaded = false;

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
        if (!this.shouldDrawWeapon || !this.shouldAdminDrawWeapon || LocalPlayer.state.isWearingPatientOutfit) {
            return;
        }

        for (const weapon of this.weaponsToDraw) {
            if (this.weaponAttached[weapon.model]) continue;
            this.weaponAttached[weapon.model] = -1;

            await this.resourceLoader.loadModel(weapon.model);

            const object = CreateObject(weapon.model, 1, 1, 1, true, true, false);
            this.weaponAttached[weapon.model] = object;

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
        }
    }

    private async undrawWeapon() {
        Object.values(this.weaponAttached).forEach(weapon => {
            SetEntityAsMissionEntity(weapon, true, true);
            DeleteObject(weapon);
        });
        this.weaponAttached = {};
    }

    @Once(OnceStep.PlayerLoaded)
    async onPlayerLoaded(player: PlayerData) {
        this.shouldDrawWeapon = true;
        this.playerLoaded = true;
        await this.updateWeaponDrawList(player.items);
    }

    @OnEvent(ClientEvent.PLAYER_UPDATE)
    async onPlayerUpdate(player: PlayerData) {
        if (!this.playerLoaded) {
            return;
        }

        await this.updateWeaponDrawList(player.items);
        const weapon = this.weaponService.getCurrentWeapon();

        if (weapon) {
            if (
                !Object.values(player.items)
                    .map(i => i.slot)
                    .includes(weapon.slot)
            ) {
                await this.weaponService.clear();
            }
        }

        await this.refreshDrawWeapons();
    }

    @OnEvent(ClientEvent.ADMIN_NOCLIP_ENABLED)
    async undrawAdminWeapons() {
        this.shouldAdminDrawWeapon = false;
        await this.undrawWeapon();
    }

    @OnEvent(ClientEvent.ADMIN_NOCLIP_DISABLED)
    async drawAdminWeapons() {
        this.shouldAdminDrawWeapon = true;
        await this.drawWeapon();
    }

    @OnEvent(ClientEvent.BASE_ENTERED_VEHICLE)
    public async undrawWeapons() {
        const vehicleClass = GetVehicleClass(GetVehiclePedIsIn(PlayerPedId(), false));
        if (vehicleClass === VehicleClass.Motorcycles || vehicleClass === VehicleClass.Cycles) {
            return;
        }

        this.shouldDrawWeapon = false;
        await this.undrawWeapon();
    }

    @OnEvent(ClientEvent.BASE_LEFT_VEHICLE)
    public async drawWeapons() {
        this.shouldDrawWeapon = true;
        await this.drawWeapon();
    }

    async refreshDrawWeapons() {
        Object.values(this.weaponAttached).forEach(weapon => {
            SetEntityVisible(weapon, true, false);
        });

        const weapon = this.weaponService.getCurrentWeapon();
        if (weapon) {
            const weaponModel = Weapons[weapon.name.toUpperCase()]?.drawPosition?.model;
            if (weaponModel) {
                if (this.weaponAttached[weaponModel]) {
                    SetEntityVisible(this.weaponAttached[weaponModel], !weapon, false);
                }
            }
        }
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

    @On('QBCore:Client:OnPlayerUnload')
    async playerUnLoaded() {
        this.shouldDrawWeapon = false;
        this.playerLoaded = false;
        await this.undrawWeapon();
    }
}
