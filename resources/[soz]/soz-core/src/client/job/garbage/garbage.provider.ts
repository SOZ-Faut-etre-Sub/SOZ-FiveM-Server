import { PlayerInventoryUpdate } from '@public/core/decorators/player';

import { Once, OnceStep, OnEvent, OnNuiEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { Tick } from '../../../core/decorators/tick';
import { AnimationStopReason } from '../../../shared/animation';
import { ClientEvent, NuiEvent } from '../../../shared/event';
import { BIN_MODELS } from '../../../shared/job/garbage';
import { MenuType } from '../../../shared/nui/menu';
import { AnimationRunner } from '../../animation/animation.factory';
import { AnimationService } from '../../animation/animation.service';
import { BlipFactory } from '../../blip';
import { InventoryManager } from '../../inventory/inventory.manager';
import { NuiMenu } from '../../nui/nui.menu';
import { ObjectProvider } from '../../object/object.provider';

@Provider()
export class GarbageProvider {
    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @Inject(BlipFactory)
    private blipFactory: BlipFactory;

    @Inject(ObjectProvider)
    private objectProvider: ObjectProvider;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(AnimationService)
    private animationService: AnimationService;

    private displayBinBlip = false;

    private hasGarbageBag = false;

    private garbageAnimationProgress: AnimationRunner | null = null;

    @Tick()
    public async handleCurrentBlipSelected() {
        const blip = GetNewSelectedMissionCreatorBlip();

        if (blip) {
            console.log(blip);
        }
    }

    @Once(OnceStep.PlayerLoaded)
    public async onPlayerLoaded() {
        this.blipFactory.create('jobs:garbage:truck', {
            name: 'BlueBird',
            position: [-621.98, -1640.79, 25.97],
            sprite: 318,
            scale: 0.9,
        });
    }

    @OnNuiEvent(NuiEvent.GarbageDisplayBlip)
    public async onDisplayBlip({ value }: { value: boolean }) {
        this.displayBinBlip = value;

        const colorModels: Record<any, number> = {
            [GetHashKey('soz_prop_bb_bin')]: 68,
            [GetHashKey('soz_prop_bb_bin_hs2')]: 70,
            [GetHashKey('soz_prop_bb_bin_hs3')]: 49,
        };

        const bins = this.objectProvider.getObjects(object => BIN_MODELS.includes(object.model));

        for (const bin of bins) {
            if (value) {
                this.blipFactory.create(bin.id, {
                    name: 'Point de collecte',
                    coords: {
                        x: bin.position[0],
                        y: bin.position[1],
                        z: bin.position[2],
                    },
                    sprite: 365,
                    color: colorModels[bin.model],
                });
            } else {
                this.blipFactory.remove(bin.id);
            }
        }
    }

    @Tick()
    public async checkGarbageBag() {
        if (!this.hasGarbageBag) {
            return;
        }

        this.garbageAnimationProgress = this.animationService.playAnimation({
            base: {
                dictionary: 'missfbi4prepp1',
                name: '_idle_garbage_man',
                options: {
                    onlyUpperBody: true,
                    enablePlayerControl: true,
                    repeat: true,
                },
            },
            props: [
                {
                    model: 'prop_cs_rub_binbag_01',
                    bone: 57005,
                    position: [0.12, 0.0, -0.05],
                    rotation: [220.0, 120.0, 0.0],
                },
            ],
        });

        await this.garbageAnimationProgress;

        this.garbageAnimationProgress = null;
    }

    @PlayerInventoryUpdate()
    public onPlayerUpdate() {
        this.hasGarbageBag = this.inventoryManager.hasEnoughItem('garbagebag', 1);

        if (!this.hasGarbageBag && this.garbageAnimationProgress) {
            this.garbageAnimationProgress.cancel(AnimationStopReason.Finished);
        }
    }

    @OnEvent(ClientEvent.JOBS_GARBAGE_OPEN_SOCIETY_MENU)
    public onOpenGarbageSocietyMenu() {
        if (this.nuiMenu.getOpened() === MenuType.GarbageJobMenu) {
            this.nuiMenu.closeMenu();
            return;
        }

        this.nuiMenu.openMenu(MenuType.GarbageJobMenu, {
            displayBinBlip: this.displayBinBlip,
        });
    }
}
