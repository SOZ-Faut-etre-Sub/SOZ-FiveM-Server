import { ShopBrand, ShopsConfig, ShopTattooConfig } from '@public/config/shops';
import { ShopTattooProducts } from '@public/config/tattoos';
import { OnNuiEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { Tick, TickInterval } from '@public/core/decorators/tick';
import { wait } from '@public/core/utils';
import { NuiEvent, ServerEvent } from '@public/shared/event';
import { MenuType } from '@public/shared/nui/menu';
import { PlayerPedHash, Skin } from '@public/shared/player';
import { Vector3 } from '@public/shared/polyzone/vector';
import { Ok } from '@public/shared/result';
import { TattooShopItem } from '@public/shared/shop';

import { AnimationService } from '../animation/animation.service';
import { CameraService } from '../camera';
import { Notifier } from '../notifier';
import { InputService } from '../nui/input.service';
import { NuiMenu } from '../nui/nui.menu';
import { PlayerService } from '../player/player.service';

type ShopTattooState = {
    camera: number;
    cameraCurrentVariation: number;
    currentSelectedCategory: string;
    scaleform: number;
};

@Provider()
export class TattooShopProvider {
    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(CameraService)
    private cameraService: CameraService;

    @Inject(InputService)
    private inputService: InputService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(AnimationService)
    private animationService: AnimationService;

    private state: ShopTattooState = null;

    public async openShop(brand: ShopBrand, shop: string) {
        const categories = ShopTattooConfig;
        const ped = PlayerPedId();
        const overlayField = GetEntityModel(ped) === PlayerPedHash.Male ? 'HashNameMale' : 'HashNameFemale';
        const products = ShopTattooProducts.filter(
            product => product[overlayField] != null && product[overlayField] != ''
        ).map(
            product =>
                ({
                    ...product,
                    Name: product.LocalizedName != null ? product.LocalizedName : GetLabelText(product.Name),
                } as TattooShopItem)
        );

        await this.setupShop(brand, shop);
        this.nuiMenu.openMenu(MenuType.TattooShop, { brand, categories, products });
    }

    @OnNuiEvent(NuiEvent.TattoShopPreview)
    public async onPreviewTattoo(product: TattooShopItem) {
        const player = this.playerService.getPlayer();
        const temporarySkin: Skin = {
            ...player.skin,
            Tattoos: [],
        };
        for (const tattoo of player.skin.Tattoos) {
            temporarySkin.Tattoos.push(tattoo);
        }
        temporarySkin.Tattoos = temporarySkin.Tattoos || [];
        const ped = PlayerPedId();
        const overlayField = GetEntityModel(ped) === GetHashKey('mp_m_freemode_01') ? 'HashNameMale' : 'HashNameFemale';
        temporarySkin.Tattoos.push({
            Collection: GetHashKey(product.Collection),
            Overlay: GetHashKey(product[overlayField]),
        });
        TriggerEvent('soz-character:Client:ApplyTemporarySkin', temporarySkin);
        return Ok(true);
    }

    public async setupShop(brand: ShopBrand, shop: string, skipIntro = false) {
        const [x, y, z] = ShopsConfig[shop].positionInShop;
        if (!skipIntro) {
            await this.animationService.walkToCoordsAvoidObstacles([x, y, z], 5000);
        }

        TriggerEvent('soz-character:Client:SetTemporaryNaked', true);

        this.state = {
            camera: this.cameraService.setupCamera(
                ShopTattooConfig['ZONE_HEAD'].cam[0] as Vector3,
                ShopTattooConfig['ZONE_HEAD'].player as Vector3
            ),
            currentSelectedCategory: 'ZONE_HEAD',
            cameraCurrentVariation: 0,
            scaleform: 0,
        };
        this.state.scaleform = await this.setupScaleForm('instructional_buttons');
        await this.updateCamera('ZONE_HEAD', 0);
    }

    public async updateCamera(category: string, index: number) {
        if (this.state == null) {
            return;
        }
        const [x, y, z] = ShopTattooConfig[category].cam[index];
        const newCamPos = GetOffsetFromEntityInWorldCoords(PlayerPedId(), x, y, z);
        SetCamCoord(this.state.camera, newCamPos[0], newCamPos[1], newCamPos[2]);
        const [xt, yt, zt] = ShopTattooConfig[category].player;
        const [nctx, ncty, nctz] = GetOffsetFromEntityInWorldCoords(PlayerPedId(), xt, yt, zt);
        PointCamAtCoord(this.state.camera, nctx, ncty, nctz);
    }

    public async setupScaleForm(scaleformType: string) {
        const scaleform = RequestScaleformMovie(scaleformType);
        while (!HasScaleformMovieLoaded(scaleform)) {
            await wait(100);
        }
        DrawScaleformMovieFullscreen(scaleform, 255, 255, 255, 0, 0);

        BeginScaleformMovieMethod(scaleform, 'CLEAR_ALL');
        EndScaleformMovieMethod();

        BeginScaleformMovieMethod(scaleform, 'SET_CLEAR_SPACE');
        ScaleformMovieMethodAddParamInt(200);
        EndScaleformMovieMethod();

        BeginScaleformMovieMethod(scaleform, 'SET_DATA_SLOT');
        ScaleformMovieMethodAddParamInt(0);
        ScaleformMovieMethodAddParamPlayerNameString(GetControlInstructionalButton(0, 21, true));
        BeginTextCommandScaleformString('STRING');
        AddTextComponentSubstringKeyboardDisplay('Faire pivoter la caméra');
        EndTextCommandScaleformString();
        EndScaleformMovieMethod();

        BeginScaleformMovieMethod(scaleform, 'DRAW_INSTRUCTIONAL_BUTTONS');
        EndScaleformMovieMethod();

        BeginScaleformMovieMethod(scaleform, 'SET_BACKGROUND_COLOUR');
        ScaleformMovieMethodAddParamInt(0);
        ScaleformMovieMethodAddParamInt(0);
        ScaleformMovieMethodAddParamInt(0);
        ScaleformMovieMethodAddParamInt(80);
        EndScaleformMovieMethod();

        return scaleform;
    }

    @Tick(TickInterval.EVERY_FRAME)
    public async handleCameraControl() {
        if (this.state == null) {
            return;
        }
        DisableControlAction(0, 32, true); // W
        DisableControlAction(0, 34, true); // A
        DisableControlAction(0, 31, true); // S
        DisableControlAction(0, 30, true); // D
        DisableControlAction(0, 22, true); // Jump
        DisableControlAction(0, 44, true); // Cover

        if (IsControlJustPressed(0, 21)) {
            this.state.cameraCurrentVariation =
                (this.state.cameraCurrentVariation + 1) %
                ShopTattooConfig[this.state.currentSelectedCategory].cam.length;
            this.updateCamera(this.state.currentSelectedCategory, this.state.cameraCurrentVariation);
        }

        DrawScaleformMovieFullscreen(this.state.scaleform, 255, 255, 255, 255, 0);
    }

    @OnNuiEvent(NuiEvent.TattooShopResetTattos)
    public async onResetTattoos() {
        const value = await this.inputService.askInput({
            title: 'Voulez-vous vraiment retirer tout vos tatouages ? (Tapez "oui" pour confirmer)',
            maxCharacters: 3,
        });
        if (value && value.toLowerCase() === 'oui') {
            TriggerServerEvent(ServerEvent.SHOP_TATTOO_RESET);
        } else {
            this.notifier.notify('Vous avez annulé votre commande.', 'info');
        }
    }

    @OnNuiEvent(NuiEvent.TattooShopBuy)
    public async onBuyTattoo(product: TattooShopItem) {
        const value = await this.inputService.askInput({
            title: 'Voulez-vous vraiment ce tatouages ? (Tapez "oui" pour confirmer)',
            maxCharacters: 3,
        });
        if (value && value.toLowerCase() === 'oui') {
            TriggerServerEvent(ServerEvent.SHOP_BUY, product, ShopBrand.Tattoo);
        } else {
            this.notifier.notify('Vous avez annulé votre commande.', 'info');
        }
    }

    @OnNuiEvent(NuiEvent.TattooShopSelectCategory)
    public async onSelectCategory(category: string) {
        if (this.state == null) {
            return;
        }
        this.state.cameraCurrentVariation = 0;
        this.state.currentSelectedCategory = category;
        this.updateCamera(category, 0);
        return Ok(true);
    }

    @OnNuiEvent<{ menuType: MenuType }>(NuiEvent.MenuClosed)
    public async onMenuClose({ menuType }) {
        if (menuType !== MenuType.TattooShop) {
            return;
        }
        TriggerEvent('soz-character:Client:ApplyCurrentClothConfig');
        TriggerEvent('soz-character:Client:ApplyCurrentSkin');
        await this.cameraService.deleteCamera();
        this.state = null;
    }
}
