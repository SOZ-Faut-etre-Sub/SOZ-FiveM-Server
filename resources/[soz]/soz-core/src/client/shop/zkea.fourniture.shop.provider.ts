import { AnimationService } from '@public/client/animation/animation.service';
import { InventoryManager } from '@public/client/inventory/inventory.manager';
import { CircularCameraProvider } from '@public/client/object/circular.camera.provider';
import { ObjectService } from '@public/client/object/object.service';
import { PlayerPositionProvider } from '@public/client/player/player.position.provider';
import { ResourceLoader } from '@public/client/repository/resource.loader';
import { ShopBrand } from '@public/config/shops';
import { Once, OnceStep, OnNuiEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { NuiEvent, ServerEvent } from '@public/shared/event';
import { MenuType } from '@public/shared/nui/menu';
import { WorldObject } from '@public/shared/object';
import { getDistance, Vector3, Vector4 } from '@public/shared/polyzone/vector';
import { getRandomItem } from '@public/shared/random';
import {
    ZkeaFournitureItem,
    ZkeaGaragePlace,
    zkeaGarageSpacePlace,
    ZkeaGarageStartingPlace,
    ZkeaRentVehicleType,
    ZkeaShopZoneEnter,
    ZkeaShopZoneExit,
} from '@public/shared/shop/zkea_fourniture';

import { Notifier } from '../notifier';
import { NuiMenu } from '../nui/nui.menu';
import { PlayerService } from '../player/player.service';

@Provider()
export class ZkeaFournitureShopProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @Inject(CircularCameraProvider)
    private circularCamera: CircularCameraProvider;

    @Inject(ObjectService)
    private objectService: ObjectService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(PlayerPositionProvider)
    private playerPositionProvider: PlayerPositionProvider;

    @Inject(ResourceLoader)
    private resourceLoader: ResourceLoader;

    @Inject(AnimationService)
    private animationService: AnimationService;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    private fournitures: { entity: number; object: WorldObject }[] = [];

    //meteor
    private fourniturePosition = [-83.61, 6502.33, 20.17] as Vector3;
    private fournitureHeading = 133.6;

    @Once(OnceStep.PlayerLoaded)
    public async onPlayerLoaded() {
        const coords = GetEntityCoords(PlayerPedId());
        if (GetInteriorAtCoordsWithType(coords[0], coords[1], coords[2], 'ex_int_warehouse_l_dlc')) {
            await this.playerPositionProvider.teleportPlayerToPosition(ZkeaShopZoneExit);
        }
    }

    public async openShop() {
        await this.setupShop();
        this.nuiMenu.openMenu(MenuType.ZkeaFournitureMenu);
    }

    public async setupShop() {
        const ped = PlayerPedId();
        await this.playerPositionProvider.teleportPlayerToPosition(ZkeaShopZoneEnter);
        FreezeEntityPosition(PlayerPedId(), true);

        const animDict = 'anim@heists@heist_corona@team_idles@male_c';
        this.resourceLoader.loadAnimationDictionary(animDict);
        TaskPlayAnim(ped, animDict, 'idle', 1.0, 1.0, -1, 1, 1, false, false, false);

        this.playerService.updateState({ isInventoryBusy: true });

        this.circularCamera.createCamera(this.fourniturePosition, 5.0);
    }

    @OnNuiEvent<{ menuType: MenuType }>(NuiEvent.MenuClosed)
    public async onMenuClose({ menuType }) {
        if (menuType !== MenuType.ZkeaFournitureMenu) {
            return;
        }

        await this.deleteFouniture();
        this.circularCamera.deleteCamera();

        const ped = PlayerPedId();
        await this.animationService.clearShopAnimations(ped);
        FreezeEntityPosition(ped, false);

        await this.playerPositionProvider.teleportPlayerToPosition(ZkeaShopZoneExit);

        this.playerService.updateState({ isInventoryBusy: false });

        if (this.inventoryManager.hasEnoughItem('zkea_crate', 1)) {
            this.notifier.notify(`Tu as fait des achats ? Loue-moi un camion pour les ramener chez toi.`, 'info');
        }
    }

    @OnNuiEvent(NuiEvent.ZkeaFournitureShow)
    public async showFourniture(model: string): Promise<void> {
        this.deleteFouniture();

        const fourniture = {
            entity: null,
            object: {
                id: `zkea_fourniture_${model}`,
                model: GetHashKey(model),
                position: [...this.fourniturePosition, this.fournitureHeading] as Vector4,
                placeOnGround: true,
            },
        };
        fourniture.entity = await this.objectService.createObject(fourniture.object);
        this.fournitures.push(fourniture);
    }

    @OnNuiEvent(NuiEvent.ZkeaFourniturePurchase)
    public async purchaseFourniture(product: ZkeaFournitureItem): Promise<void> {
        TriggerServerEvent(ServerEvent.SHOP_BUY, product, ShopBrand.Zkea);
    }

    deleteFouniture() {
        while (this.fournitures.length !== 0) {
            const fourntiure = this.fournitures.pop();
            if (fourntiure?.entity) {
                this.objectService.deleteObject(fourntiure.entity, fourntiure.object);
            }
        }
    }

    getGaragePlace: () => Vector4 = () => {
        const garageWithFreePlaces: Vector4[] = [];

        for (let i = 0; i <= ZkeaGaragePlace; i++) {
            const place: Vector4 = [
                ZkeaGarageStartingPlace[0] - zkeaGarageSpacePlace[0] * i,
                ZkeaGarageStartingPlace[1] - zkeaGarageSpacePlace[1] * i,
                ZkeaGarageStartingPlace[2] - zkeaGarageSpacePlace[2] * i,
                ZkeaGarageStartingPlace[3] - zkeaGarageSpacePlace[3] * i,
            ];
            if (!IsPositionOccupied(place[0], place[1], place[2], 0.2, false, true, true, false, false, 0, false)) {
                garageWithFreePlaces.push(place);
            }
        }

        return getRandomItem(garageWithFreePlaces);
    };

    @OnNuiEvent(NuiEvent.MuleRent)
    public async rentMule() {
        if (!this.inventoryManager.hasEnoughItem('zkea_crate', 1)) {
            this.notifier.notify('Je ne te louerai un camion que si tu as fait des achats.', 'error');
            return;
        }

        const garage = this.getGaragePlace();

        if (!garage) {
            this.notifier.notify("Il n'y a plus de place disponible.", 'error');
            return;
        }

        this.nuiMenu.closeAll();
        TriggerServerEvent(ServerEvent.ZKEA_RENT_MULE, garage);
    }

    @OnNuiEvent(NuiEvent.MuleReturn)
    public async returnMule() {
        const DISTANCE_STORE_THRESHOLD = 40.0;
        const vehicle = GetPlayersLastVehicle();

        if (!vehicle) {
            this.notifier.notify(
                'Vous devez monter dans votre camion de déménagement avant de pouvoir le ranger.',
                'error'
            );
            return;
        }

        if (!IsVehicleModel(vehicle, GetHashKey(ZkeaRentVehicleType))) {
            this.notifier.notify("Vous ne pouvez pas ranger autre chose qu'un camion de déménagement", 'error');
            return;
        }

        if (
            getDistance(
                GetEntityCoords(vehicle, true) as Vector3,
                [
                    ZkeaGarageStartingPlace[0] - zkeaGarageSpacePlace[0] * ((ZkeaGaragePlace - 1) / 2),
                    ZkeaGarageStartingPlace[1] - zkeaGarageSpacePlace[1] * ((ZkeaGaragePlace - 1) / 2),
                    ZkeaGarageStartingPlace[2] - zkeaGarageSpacePlace[2] * ((ZkeaGaragePlace - 1) / 2),
                ] as Vector3
            ) > DISTANCE_STORE_THRESHOLD
        ) {
            this.notifier.notify(
                'Gare ton camion sur le parking avant de me rendre les clés. Je ne vais pas le faire à ta place.',
                'error'
            );
            return;
        }

        const networkId = NetworkGetNetworkIdFromEntity(vehicle);
        TriggerServerEvent(ServerEvent.ZKEA_RETURN_MULE, networkId);

        this.nuiMenu.closeMenu();
    }
}
