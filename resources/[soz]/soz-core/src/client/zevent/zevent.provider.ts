import { Once, OnceStep, OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ClientEvent, ServerEvent } from '../../shared/event';
import { PlayerService } from '../player/player.service';
import { TargetFactory } from '../target/target.factory';

@Provider()
export class ZEventProvider {
    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Once(OnceStep.PlayerLoaded)
    public onPlayerLoaded() {
        this.targetFactory.createForBoxZone(
            'zevent_popcorn',
            {
                center: [339.55, 187.84, 103.0],
                length: 0.4,
                width: 0.65,
                minZ: 103.0,
                maxZ: 103.4,
                heading: 340,
            },
            [
                {
                    label: 'Prendre du pop-corn',
                    icon: 'c:/zevent/popcorn.png',
                    action: () => {
                        TriggerServerEvent(ServerEvent.ZEVENT_GET_POPCORN);
                    },
                },
            ]
        );

        const player = this.playerService.getPlayer();

        if (player.metadata.isWearingItem == 'zevent2022_tshirt') {
            this.playerService.setJobClothes(this.skin[player.skin.Model.Hash]);
        }
    }

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
        if (player.metadata.isWearingItem == 'zevent2022_tshirt') {
            player.metadata.isWearingItem = null;
            this.playerService.setJobClothes(null);
        } else {
            player.metadata.isWearingItem = 'zevent2022_tshirt';
            this.playerService.setJobClothes(this.skin[player.skin.Model.Hash]);
        }
    }
}
