import { Prop, Wardrobe } from '@public/shared/cloth';
import { VanillaPropDrawableIndexMaxValue } from '@public/shared/drawable';
import { Feature, isFeatureEnabled } from '@public/shared/features';
import { toVector4Object, Vector4 } from '@public/shared/polyzone/vector';
import { getRandomInt } from '@public/shared/random';
import { EasterShopContent } from '@public/shared/shop/easter';

import { Once, OnceStep, OnEvent, OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ClientEvent, NuiEvent, ServerEvent } from '../../shared/event';
import { MenuType } from '../../shared/nui/menu';
import { ShopProduct } from '../../shared/shop';
import { ItemService } from '../item/item.service';
import { NuiMenu } from '../nui/nui.menu';
import { PlayerService } from '../player/player.service';
import { TargetFactory } from '../target/target.factory';

const coords = [-2032.2, 1974.44, 187.88, 292.23] as Vector4;

@Provider()
export class EasterShopProvider {
    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @Inject(ItemService)
    private itemService: ItemService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    private isWearingEar = false;

    public async onOpenMenu(products: ShopProduct[]) {
        const hydratedProducts = products.map(product => ({ ...product, item: this.itemService.getItem(product.id) }));

        this.nuiMenu.openMenu(MenuType.EasterShop, hydratedProducts, {
            position: {
                position: coords,
                distance: 5.0,
            },
        });
    }

    @OnNuiEvent(NuiEvent.EasterShopBuy)
    public async onShopBuy(id: string) {
        TriggerServerEvent(ServerEvent.SHOP_EASTER_BUY, id);
    }

    @Once(OnceStep.Start)
    onPlayerLoaded() {
        if (!isFeatureEnabled(Feature.Easter)) {
            return;
        }

        this.targetFactory.createForPed({
            model: 'A_C_Rabbit_02',
            coords: toVector4Object(coords),
            invincible: true,
            freeze: true,
            blockevents: true,
            width: 3.5,
            length: 3.5,
            animDict: 'creatures@rabbit@move',
            anim: 'idle',
            target: {
                distance: 2.5,
                options: [
                    {
                        label: 'Accéder à la boutique de Pâques',
                        icon: 'fas fa-store',
                        color: 'food',
                        action: () => {
                            this.onOpenMenu(EasterShopContent);
                        },
                    },
                ],
            },
        });
    }

    private readonly skin: Wardrobe = {
        [GetHashKey('mp_m_freemode_01')]: {
            Components: {},
            Props: {
                [Prop.Hat]: {
                    Drawable: VanillaPropDrawableIndexMaxValue[GetHashKey('mp_m_freemode_01')][Prop.Hat] + 5,
                    Texture: 0,
                    Palette: 0,
                },
            },
        },
        [GetHashKey('mp_f_freemode_01')]: {
            Components: {},
            Props: {
                [Prop.Hat]: {
                    Drawable: VanillaPropDrawableIndexMaxValue[GetHashKey('mp_f_freemode_01')][Prop.Hat] + 5,
                    Texture: 0,
                    Palette: 0,
                },
            },
        },
    };

    @OnEvent(ClientEvent.EASTER_EAR_TOGGLE)
    public async onToggleEar() {
        const player = this.playerService.getPlayer();
        if (this.isWearingEar) {
            this.playerService.setTempClothes(null);
        } else {
            const ear = this.skin[player.skin.Model.Hash];
            ear.Props[Prop.Hat].Texture = getRandomInt(0, 3);
            this.playerService.setTempClothes(ear);
        }
        this.isWearingEar = !this.isWearingEar;
    }
}
