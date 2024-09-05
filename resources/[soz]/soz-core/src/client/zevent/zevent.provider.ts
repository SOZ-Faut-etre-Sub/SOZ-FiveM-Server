import { Component, WardrobeConfig } from '@public/shared/cloth';
import { VanillaComponentDrawableIndexMaxValue } from '@public/shared/drawable';
import { PlayerPedHash } from '@public/shared/player';

import { OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ClientEvent } from '../../shared/event';
import { PlayerService } from '../player/player.service';

//zevent2022_tshirt
const tshirt: WardrobeConfig = {
    [PlayerPedHash.Male]: {
        zevent2022_tshirt: {
            Components: {
                [3]: { Drawable: 0, Texture: 0, Palette: 0 },
                [8]: { Drawable: 15, Texture: 0, Palette: 0 },
                [11]: { Drawable: 44, Texture: 1, Palette: 0 },
            },
            Props: {},
        },
        zevent2024_tshirt: {
            Components: {
                [3]: { Drawable: 0, Texture: 0, Palette: 0 },
                [8]: { Drawable: 15, Texture: 0, Palette: 0 },
                [11]: {
                    Drawable: VanillaComponentDrawableIndexMaxValue[PlayerPedHash.Male][Component.Tops] + 13,
                    Texture: 0,
                    Palette: 0,
                },
            },
            Props: {},
        },
        zevent2024_tshirt_collector: {
            Components: {
                [3]: { Drawable: 0, Texture: 0, Palette: 0 },
                [8]: { Drawable: 15, Texture: 0, Palette: 0 },
                [11]: {
                    Drawable: VanillaComponentDrawableIndexMaxValue[PlayerPedHash.Male][Component.Tops] + 13,
                    Texture: 2,
                    Palette: 0,
                },
            },
            Props: {},
        },
    },
    [PlayerPedHash.Female]: {
        zevent2022_tshirt: {
            Components: {
                [3]: { Drawable: 14, Texture: 0, Palette: 0 },
                [8]: { Drawable: 14, Texture: 0, Palette: 0 },
                [11]: { Drawable: 335, Texture: 19, Palette: 0 },
            },
            Props: {},
        },
        zevent2024_tshirt: {
            Components: {
                [3]: { Drawable: 14, Texture: 0, Palette: 0 },
                [8]: { Drawable: 14, Texture: 0, Palette: 0 },
                [11]: {
                    Drawable: VanillaComponentDrawableIndexMaxValue[PlayerPedHash.Female][Component.Tops] + 24,
                    Texture: 0,
                    Palette: 0,
                },
            },
            Props: {},
        },
        zevent2024_tshirt_collector: {
            Components: {
                [3]: { Drawable: 14, Texture: 0, Palette: 0 },
                [8]: { Drawable: 14, Texture: 0, Palette: 0 },
                [11]: {
                    Drawable: VanillaComponentDrawableIndexMaxValue[PlayerPedHash.Female][Component.Tops] + 24,
                    Texture: 2,
                    Palette: 0,
                },
            },
            Props: {},
        },
    },
};

@Provider()
export class ZEventProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    private isWearingTShirt = false;

    @OnEvent(ClientEvent.ZEVENT_TOGGLE_TSHIRT)
    public onToggleTShirt(item: string) {
        const player = this.playerService.getPlayer();
        if (this.isWearingTShirt && player.metadata.isWearingItem == item) {
            player.metadata.isWearingItem = null;
            this.playerService.setTempClothes(null);
        } else {
            player.metadata.isWearingItem = item;
            if (tshirt[player.skin.Model.Hash][item]) {
                this.playerService.setTempClothes(tshirt[player.skin.Model.Hash][item]);
            }
        }
        this.isWearingTShirt = !this.isWearingTShirt;
    }
}
