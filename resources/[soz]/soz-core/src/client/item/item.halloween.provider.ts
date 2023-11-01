import { Prop, Wardrobe } from '@public/shared/cloth';
import { VanillaPropDrawableIndexMaxValue } from '@public/shared/drawable';
import { DeguisementMapping } from '@public/shared/story/halloween2022';

import { OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ClientEvent } from '../../shared/event';
import { Notifier } from '../notifier';
import { PlayerService } from '../player/player.service';
import { SkinService } from '../skin/skin.service';

@Provider()
export class ItemHalloweenProvider {
    @Inject(SkinService)
    private skinService: SkinService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(Notifier)
    private notifier: Notifier;

    private readonly skin: Wardrobe = {
        [GetHashKey('mp_m_freemode_01')]: {
            Components: {},
            Props: {
                [Prop.Hat]: {
                    Drawable: VanillaPropDrawableIndexMaxValue[GetHashKey('mp_m_freemode_01')][Prop.Hat] + 8,
                    Texture: 0,
                    Palette: 0,
                },
            },
        },
        [GetHashKey('mp_f_freemode_01')]: {
            Components: {},
            Props: {
                [Prop.Hat]: {
                    Drawable: VanillaPropDrawableIndexMaxValue[GetHashKey('mp_f_freemode_01')][Prop.Hat] + 8,
                    Texture: 0,
                    Palette: 0,
                },
            },
        },
    };
    private isWearingHat = false;

    @OnEvent(ClientEvent.HALLOWEEN_HAT_TOOGLE)
    public async onToggleHat() {
        const player = this.playerService.getPlayer();
        if (this.isWearingHat) {
            this.playerService.setTempClothes(null);
        } else {
            const ear = this.skin[player.skin.Model.Hash];
            this.playerService.setTempClothes(ear);
        }
        this.isWearingHat = !this.isWearingHat;
    }

    @OnEvent(ClientEvent.HALLOWEEN_DEGUISEMENT_USE)
    public async onUseDeguisement(name: string) {
        const pedmodel = DeguisementMapping[name];
        if (!pedmodel) {
            return;
        }

        this.skinService.setModel(pedmodel);
        this.playerService.setDeguisement(true);
    }

    @OnEvent(ClientEvent.HALLOWEEN_DEMON_ANALISYS)
    public async onUseDemonAnalysis() {
        this.notifier.notify('Un point a été ajouté sur votre GPS');
        SetNewWaypoint(5046.58, -5819.29);
    }
}
