import { Once, OnceStep } from '@core/decorators/event';
import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { AnimationService } from '@public/client/animation/animation.service';
import { PlayerService } from '@public/client/player/player.service';
import { ProgressService } from '@public/client/progress.service';
import { emitRpc } from '@public/core/rpc';
import { wait } from '@public/core/utils';
import { ServerEvent } from '@public/shared/event';
import { JobType } from '@public/shared/job';
import { canTreeBeHarvest, canTreeBeWater, FDFTreeField, TreeStatus } from '@public/shared/job/fdf';
import { getLocationHash } from '@public/shared/locationhash';
import { Vector3 } from '@public/shared/polyzone/vector';
import { RpcServerEvent } from '@public/shared/rpc';

import { TargetFactory } from '../../target/target.factory';

@Provider()
export class FDFTreeProvider {
    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(AnimationService)
    private animationService: AnimationService;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    private cachedtree: TreeStatus;
    private cachedId: number;
    private updateTime = 0;

    @Once(OnceStep.PlayerLoaded)
    public setupFDFTree() {
        this.targetFactory.createForModel(
            ['soz_prop_veg_crop_orange'],
            [
                {
                    label: 'Tailler',
                    color: JobType.FDF,
                    icon: 'c:fdf/shear.png',
                    blackoutJob: JobType.FDF,
                    blackoutGlobal: true,
                    job: JobType.FDF,
                    canInteract: async entity => {
                        if (!this.playerService.isOnDuty()) {
                            return false;
                        }

                        const [field, id] = this.getFieldId(entity);
                        if (!field) {
                            return false;
                        }

                        const tree = await this.getTreeStatus(id);
                        return !tree;
                    },
                    action: async entity => {
                        const [field, id] = this.getFieldId(entity);

                        const { completed } = await this.progressService.progress(
                            'fdf_cut_tree',
                            'Taillage en cours...',
                            10000,
                            {
                                name: 'goggles_down',
                                dictionary: 'veh@bike@sport@front@base',
                                options: {
                                    enablePlayerControl: false,
                                    repeat: true,
                                    onlyUpperBody: true,
                                },
                            },
                            {
                                useAnimationService: true,
                            }
                        );

                        if (!completed) {
                            return;
                        }

                        TriggerServerEvent(ServerEvent.FDF_TREE_CUT, id, field);
                    },
                },
                {
                    label: 'Arroser',
                    color: JobType.FDF,
                    icon: 'c:crimi/water.png',
                    blackoutJob: JobType.FDF,
                    blackoutGlobal: true,
                    job: JobType.FDF,
                    canInteract: async entity => {
                        if (!this.playerService.isOnDuty()) {
                            return false;
                        }

                        const [field, id] = this.getFieldId(entity);
                        if (!field) {
                            return false;
                        }

                        const tree = await this.getTreeStatus(id);
                        return canTreeBeWater(tree);
                    },
                    action: async entity => {
                        const [, id] = this.getFieldId(entity);

                        const { completed } = await this.progressService.progress(
                            'fdf_water_tree',
                            'Arrosage en cours...',
                            60000,
                            {
                                name: 'fire',
                                dictionary: 'weapon@w_sp_jerrycan',
                                options: {
                                    enablePlayerControl: false,
                                    repeat: true,
                                    onlyUpperBody: true,
                                },
                                props: [
                                    {
                                        model: 'prop_wateringcan',
                                        bone: 28422,
                                        position: [0.4, 0.1, 0.0],
                                        rotation: [90.0, 180.0, 0.0],
                                        fx: {
                                            dictionary: 'core',
                                            name: 'ent_sht_water',
                                            position: [0.35, 0.0, 0.25],
                                            rotation: [0.0, 0.0, 0.0],
                                            scale: 2.0,
                                        },
                                    },
                                ],
                            },
                            {
                                useAnimationService: true,
                            }
                        );

                        if (!completed) {
                            return;
                        }

                        TriggerServerEvent(ServerEvent.FDF_TREE_WATER, id);
                    },
                },
                {
                    label: 'Récolter',
                    color: JobType.FDF,
                    icon: 'c:fdf/harvest.png',
                    blackoutJob: JobType.FDF,
                    blackoutGlobal: true,
                    job: JobType.FDF,
                    canInteract: async entity => {
                        if (!this.playerService.isOnDuty()) {
                            return false;
                        }

                        const [field, id] = this.getFieldId(entity);
                        if (!field) {
                            return false;
                        }

                        const tree = await this.getTreeStatus(id);
                        return canTreeBeHarvest(tree);
                    },
                    action: async entity => {
                        const [, id] = this.getFieldId(entity);

                        let cancelled = false;
                        const runner = this.animationService.playAnimation({
                            base: {
                                dictionary: 'anim@amb@waving@male',
                                name: 'ground_wave',
                                options: {
                                    freezeLastFrame: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                    repeat: true,
                                },
                            },
                        });
                        runner.then(() => {
                            cancelled = true;
                        });

                        let remaining = 0;
                        do {
                            await wait(2000);
                            if (cancelled) {
                                break;
                            }
                            remaining = await emitRpc<number>(RpcServerEvent.FDF_TREE_HARVEST, id);
                        } while (remaining > 0);

                        runner.cancel();
                    },
                },
            ]
        );
    }

    private async getTreeStatus(id: number) {
        if (this.cachedtree && this.cachedId == id && this.updateTime + 2000 > Date.now()) {
            return this.cachedtree;
        }

        this.cachedtree = await emitRpc<TreeStatus>(RpcServerEvent.FDF_TREE_GET, id);
        this.cachedId = id;
        this.updateTime = Date.now();

        return this.cachedtree;
    }

    private getFieldId(entity: number): [string, number] {
        const coords = GetEntityCoords(entity) as Vector3;
        const field = Object.entries(FDFTreeField).find(([, field]) => field.isPointInside(coords));
        const id = getLocationHash(coords);

        return [field ? field[0] : null, id];
    }
}
