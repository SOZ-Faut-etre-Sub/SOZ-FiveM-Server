import { BarberShopItems, PositionInBarberShop } from '@public/config/barber';
import { ShopBrand } from '@public/config/shops';
import { Once, OnceStep, OnNuiEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { NuiEvent, ServerEvent } from '@public/shared/event';
import { MenuType } from '@public/shared/nui/menu';
import { PlayerPedHash, Skin } from '@public/shared/player';
import { Vector3 } from '@public/shared/polyzone/vector';
import { BarberConfiguration, BarberShopColors, BarberShopItem, BarberShopLabels } from '@public/shared/shop';

import { AnimationService } from '../animation/animation.service';
import { CameraService } from '../camera';
import { NuiMenu } from '../nui/nui.menu';
import { PlayerService } from '../player/player.service';
import { ResourceLoader } from '../repository/resource.loader';

@Provider()
export class BarberShopProvider {
    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(CameraService)
    private cameraService: CameraService;

    @Inject(ResourceLoader)
    private resourceLoader: ResourceLoader;

    @Inject(AnimationService)
    private animationService: AnimationService;

    private barberShopLabels: BarberShopLabels;
    private barberShopColors: BarberShopColors;

    private barberShopContent = BarberShopItems;

    @Once(OnceStep.PlayerLoaded)
    public async setupBarberShop() {
        this.barberShopLabels = exports['soz-character'].GetLabels() as BarberShopLabels;

        const numHairColors = GetNumHairColors();
        const numMakeupColors = GetNumMakeupColors();

        this.barberShopColors = {
            Hair: [],
            Makeup: [],
        };

        for (let i = 0; i < numHairColors; i++) {
            const [r, g, b] = GetHairRgbColor(i);
            this.barberShopColors.Hair.push({
                value: i,
                label: 'HAIR_COLOR_' + i,
                r: r,
                g: g,
                b: b,
            });
        }
        for (let i = 0; i < numMakeupColors; i++) {
            const [r, g, b] = GetMakeupRgbColor(i);
            this.barberShopColors.Makeup.push({
                value: i,
                label: 'MAKEUP_COLOR_' + i,
                r: r,
                g: g,
                b: b,
            });
        }

        this.barberShopContent[PlayerPedHash.Male][0].items = this.barberShopLabels.HairMale;
        this.barberShopContent[PlayerPedHash.Male][1].items = this.barberShopLabels.BeardMale;
        this.barberShopContent[PlayerPedHash.Male][2].items = this.barberShopLabels.Makeup;
        this.barberShopContent[PlayerPedHash.Female][0].items = this.barberShopLabels.HairFemale;
        this.barberShopContent[PlayerPedHash.Female][1].items = this.barberShopLabels.Blush;
        this.barberShopContent[PlayerPedHash.Female][2].items = this.barberShopLabels.Lipstick;
        this.barberShopContent[PlayerPedHash.Female][3].items = this.barberShopLabels.Makeup;
    }

    public async openShop() {
        const shop_content = this.barberShopContent;
        const shop_colors = this.barberShopColors;
        const player_data = this.playerService.getPlayer();

        this.setupShop();

        this.nuiMenu.openMenu(MenuType.BarberShop, {
            shop_content,
            shop_colors,
            player_data,
        });
    }

    @OnNuiEvent(NuiEvent.BarberShopPreview)
    public async onBarberPreview(config: BarberConfiguration) {
        const player = this.playerService.getPlayer();
        const temporarySkin: Skin = {
            ...player.skin,
            Hair: {
                ...player.skin.Hair,
                ...config.Hair,
            },
            Makeup: {
                ...player.skin.Makeup,
                ...config.Makeup,
            },
        };
        TriggerEvent('soz-character:Client:ApplyTemporarySkin', temporarySkin);
    }

    @OnNuiEvent(NuiEvent.BarberShopBuy)
    public async onBarberBuy({ configuration, price, overlay }) {
        TriggerServerEvent(
            ServerEvent.SHOP_BUY,
            {
                config: configuration,
                price: price,
                overlay: overlay,
            } as BarberShopItem,
            ShopBrand.Barber
        );
    }

    public async setupShop() {
        const ped = PlayerPedId();
        SetEntityHeading(ped, PositionInBarberShop.PLAYER_HEADING);
        FreezeEntityPosition(ped, true);

        // Setup cam
        const [x, y, z] = GetEntityCoords(ped);
        await this.cameraService.setupCamera(
            [
                x + PositionInBarberShop.CAMERA_OFFSET_X,
                y + PositionInBarberShop.CAMERA_OFFSET_Y,
                z + PositionInBarberShop.CAMERA_OFFSET_Z,
            ] as Vector3,
            [x, y, z + PositionInBarberShop.CAMERA_TARGET_Z] as Vector3
        );

        // Play idle animation
        const animDict = 'anim@heists@heist_corona@team_idles@male_c';
        this.resourceLoader.loadAnimationDictionary(animDict);

        ClearPedTasksImmediately(ped);
        TaskPlayAnim(ped, animDict, 'idle', 1.0, 1.0, -1, 1, 1, false, false, false);
    }

    @OnNuiEvent<{ menuType: MenuType }>(NuiEvent.MenuClosed)
    public async onMenuClose({ menuType }) {
        if (menuType !== MenuType.BarberShop) {
            return;
        }
        TriggerEvent('soz-character:Client:ApplyCurrentSkin');
        await this.cameraService.deleteCamera();
        await this.animationService.clearShopAnimations(PlayerPedId());
        FreezeEntityPosition(PlayerPedId(), false);
    }
}
