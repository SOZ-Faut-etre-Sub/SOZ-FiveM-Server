import { Exportable } from '@public/core/decorators/exports';
import { ScubaOutfit } from '@public/shared/cloth';
import { InventoryItem } from '@public/shared/item';
import { PlayerData } from '@public/shared/player';

import { Once, OnceStep, OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ClientEvent, ServerEvent } from '../../shared/event';
import { AnimationService } from '../animation/animation.service';
import { NuiDispatch } from '../nui/nui.dispatch';
import { AttachedObjectService } from '../object/attached.object.service';
import { PlayerService } from '../player/player.service';
import { PlayerWalkstyleProvider } from '../player/player.walkstyle.provider';
import { PlayerWardrobe } from '../player/player.wardrobe';
import { ItemService } from './item.service';

@Provider()
export class ItemProvider {
    @Inject(PlayerService)
    public playerService: PlayerService;

    @Inject(ItemService)
    private item: ItemService;

    @Inject(NuiDispatch)
    private nuiDispatch: NuiDispatch;

    @Inject(AnimationService)
    private animationService: AnimationService;

    @Inject(PlayerWalkstyleProvider)
    private playerWalkstyleProvider: PlayerWalkstyleProvider;

    @Inject(PlayerWardrobe)
    public playerWardrobe: PlayerWardrobe;

    @Inject(ItemService)
    private itemService: ItemService;

    @Inject(AttachedObjectService)
    private attachedObjectService: AttachedObjectService;

    private hasWalkStick = {
        enable: false,
        object: null,
    };

    @Once(OnceStep.NuiLoaded)
    async onStart(): Promise<void> {
        this.nuiDispatch.dispatch('item', 'SetItems', this.item.getItems());
    }

    @Once(OnceStep.PlayerLoaded)
    public onPLayerLoaded(player: PlayerData) {
        if (player.metadata?.scuba) {
            const ped = PlayerPedId();
            SetEnableScuba(ped, true);
            SetPedMaxTimeUnderwater(ped, 86400.0);
        }
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

        if (!this.hasWalkStick.enable && this.hasWalkStick.object) {
            this.attachedObjectService.detachObjectToPlayer(this.hasWalkStick.object);
            this.hasWalkStick.object = null;
        }

        if (this.hasWalkStick.enable) {
            await this.createWalkStick();

            await this.playerWalkstyleProvider.updateWalkStyle('item', 'move_heist_lester');
        } else {
            await this.playerWalkstyleProvider.updateWalkStyle('item', null);
        }
    }

    private async createWalkStick() {
        const object = await this.attachedObjectService.attachObjectToPlayer({
            bone: 57005,
            model: 'prop_cs_walking_stick',
            position: [0.16, 0.06, 0.0],
            rotation: [335.0, 300.0, 120.0],
            rotationOrder: 5,
        });

        this.hasWalkStick.object = object;
    }

    async onWalkStickRefresh(): Promise<void> {
        if (this.hasWalkStick.enable && !DoesEntityExist(this.hasWalkStick.object)) {
            await this.createWalkStick();
        }
    }

    @OnEvent(ClientEvent.ITEM_SCUBA_TOOGLE)
    public async onScubaToogle(scuba: boolean) {
        const player = this.playerService.getPlayer();

        const skin = ScubaOutfit;

        const { completed } = await this.playerWardrobe.waitProgress(false);
        if (!completed) {
            return;
        }

        if (scuba) {
            SetEnableScuba(PlayerPedId(), true);
            SetPedMaxTimeUnderwater(PlayerPedId(), 86400.0);
        } else {
            SetEnableScuba(PlayerPedId(), false);
            SetPedMaxTimeUnderwater(PlayerPedId(), 15.0);
        }
        TriggerServerEvent(ServerEvent.CHARACTER_SET_JOB_CLOTHES, scuba ? skin[player.skin.Model.Hash] : null, false);
    }

    @Exportable('ItemIsExpired')
    public itemIsExpired(item: InventoryItem) {
        return this.itemService.isExpired(item);
    }
}
