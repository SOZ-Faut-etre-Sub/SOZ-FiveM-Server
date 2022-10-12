import { OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ClientEvent } from '../../shared/event';
import { PlayerService } from '../player/player.service';
import { TargetFactory } from '../target/target.factory';

@Provider()
export class ZEventProvider {
    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(PlayerService)
    private playerService: PlayerService;

    private isWearingTShirt = false;

    private readonly skin: any = {
        [GetHashKey('mp_m_freemode_01')]: {
            Components: {
                [3]: { Drawable: 0, Texture: 0, Palette: 0 },
                [8]: { Drawable: 15, Texture: 0, Palette: 0 },
                [11]: { Drawable: 44, Texture: 1, Palette: 0 },
            },
        },
        [GetHashKey('mp_f_freemode_01')]: {
            Components: {
                [3]: { Drawable: 14, Texture: 0, Palette: 0 },
                [8]: { Drawable: 2, Texture: 0, Palette: 0 },
                [11]: { Drawable: 335, Texture: 19, Palette: 0 },
            },
        },
    };

    @OnEvent(ClientEvent.ZEVENT_TOGGLE_TSHIRT)
    public onToggleTShirt() {
        const player = this.playerService.getPlayer();
        if (this.isWearingTShirt) {
            player.metadata.isWearingItem = null;
            this.playerService.setTempClothes(null);
        } else {
            player.metadata.isWearingItem = 'zevent2022_tshirt';
            this.playerService.setTempClothes(this.skin[player.skin.Model.Hash]);
        }
        this.isWearingTShirt = !this.isWearingTShirt;
    }
}
