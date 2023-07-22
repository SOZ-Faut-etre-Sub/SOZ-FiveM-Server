import { Once, OnceStep, OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ClientEvent } from '../../shared/event';
import { AnimationService } from '../animation/animation.service';
import { NuiDispatch } from '../nui/nui.dispatch';
import { PlayerWalkstyleProvider } from '../player/player.walkstyle.provider';
import { ItemService } from './item.service';

@Provider()
export class ItemProvider {
    @Inject(ItemService)
    private item: ItemService;

    @Inject(NuiDispatch)
    private nuiDispatch: NuiDispatch;

    @Inject(AnimationService)
    private animationService: AnimationService;

    @Inject(PlayerWalkstyleProvider)
    private playerWalkstyleProvider: PlayerWalkstyleProvider;

    private hasWalkStick = {
        enable: false,
        object: null,
    };

    @Once(OnceStep.NuiLoaded)
    async onStart(): Promise<void> {
        this.nuiDispatch.dispatch('item', 'SetItems', this.item.getItems());
    }

    @OnEvent(ClientEvent.ITEM_PROTEST_SIGN_TOGGLE)
    async onProtestSignToggle(): Promise<void> {
        this.animationService.toggleAnimation({
            base: {
                dictionary: 'amb@world_human_drinking@coffee@male@base',
                name: 'base',
                options: {
                    repeat: true,
                    freezeLastFrame: true,
                    onlyUpperBody: true,
                    enablePlayerControl: true,
                },
            },
            props: [
                {
                    bone: 57005,
                    model: 'prop_cs_protest_sign_nothappy',
                    position: [0.2, 0.3, 0.03],
                    rotation: [280.0, 10.0, 350.0],
                },
            ],
        });
    }

    @OnEvent(ClientEvent.ITEM_UMBRELLA_TOGGLE)
    async onUmbrellaToggle(): Promise<void> {
        this.animationService.toggleAnimation({
            base: {
                dictionary: 'amb@world_human_drinking@coffee@male@base',
                name: 'base',
                options: {
                    repeat: true,
                    freezeLastFrame: true,
                    onlyUpperBody: true,
                    enablePlayerControl: true,
                },
            },
            props: [
                {
                    bone: 57005,
                    model: 'p_amb_brolly_01',
                    position: [0.12, 0.005, 0.0],
                    rotation: [280.0, 10.0, 350.0],
                },
            ],
        });
    }

    @OnEvent(ClientEvent.ITEM_WALK_STICK_TOGGLE)
    async onWalkStickToggle(): Promise<void> {
        this.hasWalkStick.enable = !this.hasWalkStick.enable;

        if (this.hasWalkStick.object) {
            DetachEntity(this.hasWalkStick.object, false, false);
            DeleteEntity(this.hasWalkStick.object);
        }

        if (this.hasWalkStick.enable) {
            const ped = PlayerPedId();
            const object = CreateObject(GetHashKey('prop_cs_walking_stick'), 0, 0, 0, true, true, true);

            AttachEntityToEntity(
                object,
                ped,
                GetPedBoneIndex(ped, 57005),
                0.16,
                0.06,
                0.0,
                335.0,
                300.0,
                120.0,
                true,
                true,
                false,
                true,
                5,
                true
            );

            this.hasWalkStick.object = object;

            await this.playerWalkstyleProvider.updateWalkStyle('item', 'move_heist_lester');
        } else {
            await this.playerWalkstyleProvider.updateWalkStyle('item', null);
        }
    }
}
