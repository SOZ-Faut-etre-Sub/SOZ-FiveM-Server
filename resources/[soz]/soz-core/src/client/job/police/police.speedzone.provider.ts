import { ObjectProvider } from '@public/client/object/object.provider';
import { getProperGroundPositionForObject } from '@public/client/object/object.utils';
import { PlayerService } from '@public/client/player/player.service';
import { ProgressService } from '@public/client/progress.service';
import { Once, OnceStep, OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { BlipType } from '@public/shared/blip';
import { ClientEvent, ServerEvent } from '@public/shared/event';
import { FDO, JobType } from '@public/shared/job';
import { Vector3, Vector4 } from '@public/shared/polyzone/vector';

import { BlipFactory } from '../../blip';
import { InteractionOffsetProvider } from '../../quick-interaction/interaction.offset.provider';
import { InteractionProvider } from '../../quick-interaction/interaction.provider';

const jobsTarget = { [JobType.BCSO]: 0, [JobType.FBI]: 0, [JobType.SASP]: 0, [JobType.LSPD]: 0, [JobType.LSCS]: 0 };
const roadSignModel = GetHashKey('prop_trafficdiv_02');

@Provider()
export class PoliceSpeedZoneProvider {
    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(ObjectProvider)
    private objectProvider: ObjectProvider;

    @Inject(BlipFactory)
    private blipFactory: BlipFactory;

    @Inject(InteractionProvider)
    private interactionProvider: InteractionProvider;

    @Inject(InteractionOffsetProvider)
    private interactionOffsetProvider: InteractionOffsetProvider;

    private speedZone: { [id: string]: { position: Vector4; radius: number; speed: number; zoneId: number } } = {};

    @Once(OnceStep.Start)
    public async onStart() {
        this.interactionProvider.createInteractionForModels(roadSignModel, {
            label: 'Démonter',
            action: async (entity: number) => {
                const id = this.objectProvider.getIdFromEntity(entity);
                const { completed } = await this.progressService.progress(
                    'remove_object',
                    'Démontage du panneau',
                    2500,
                    {
                        dictionary: 'weapons@first_person@aim_rng@generic@projectile@thermal_charge@',
                        name: 'plant_floor',
                        options: {
                            onlyUpperBody: true,
                        },
                    },
                    {
                        useWhileDead: false,
                        canCancel: true,
                        disableMovement: true,
                        disableCarMovement: true,
                        disableMouse: false,
                        disableCombat: true,
                    }
                );
                if (!completed) {
                    return;
                }

                TriggerServerEvent(ServerEvent.POLICE_REMOVE_SPEEDZONE, id);
            },
            job: jobsTarget,
        });
        this.interactionOffsetProvider.setModelOffset(roadSignModel, [0, 0, 1.0]);

        TriggerServerEvent(ServerEvent.POLICE_INIT_SPEEDZONE);
    }

    @OnEvent(ClientEvent.POLICE_REQUEST_ADD_SPEEDZONE)
    public async onAddSpeedZone(radius: number, speed: number) {
        const ped = PlayerPedId();
        const entityCoords = GetOffsetFromEntityInWorldCoords(ped, 0.0, 0.5, 0.0) as Vector3;
        const entityHeading = GetEntityHeading(ped);

        const { completed } = await this.progressService.progress(
            'spawn_object',
            'Installation du panneau en cours',
            2500,
            {
                dictionary: 'anim@narcotics@trash',
                name: 'drop_front',
                options: {
                    onlyUpperBody: true,
                },
            },
            {
                disableMovement: true,
                useWhileDead: false,
                canCancel: true,
                disableCarMovement: true,
                disableMouse: false,
                disableCombat: true,
            }
        );
        if (!completed) {
            return;
        }
        TriggerServerEvent(
            ServerEvent.POLICE_ADD_SPEEDZONE,
            getProperGroundPositionForObject(roadSignModel, entityCoords, entityHeading),
            radius,
            speed
        );
    }

    @OnEvent(ClientEvent.POLICE_SYNC_SPEEDZONE)
    public async syncSpeedZone(zones: { [id: string]: { position: Vector4; radius: number; speed: number } }) {
        const shouldDisplayBlip = this.shouldDisplayBlip();
        Object.keys(zones).map(k => {
            if (!this.speedZone[k]) {
                const zoneId = AddSpeedZoneForCoord(
                    zones[k].position[0],
                    zones[k].position[1],
                    zones[k].position[2],
                    zones[k].radius,
                    zones[k].speed / 3.6,
                    false
                );
                this.speedZone[k] = {
                    ...zones[k],
                    zoneId,
                };
                this.blipFactory.create(
                    k,
                    {
                        name: k,
                        coords: {
                            x: zones[k].position[0],
                            y: zones[k].position[1],
                            z: zones[k].position[2],
                        },
                        radius: zones[k].radius,
                        color: 1,
                        sprite: 4,
                        type: BlipType.Radius,
                    },
                    shouldDisplayBlip
                );
            }
        });

        Object.keys(this.speedZone).map(k => {
            if (!zones[k]) {
                RemoveSpeedZone(this.speedZone[k].zoneId);
                this.blipFactory.remove(k);
                delete this.speedZone[k];
            }
        });
    }

    shouldDisplayBlip() {
        const player = this.playerService.getPlayer();
        if (!player) {
            return false;
        }

        return FDO.includes(player.job?.id) && player.job?.onduty;
    }

    @OnEvent(ClientEvent.JOB_DUTY_CHANGE)
    public onDutyChange(duty: boolean) {
        const job = this.playerService.getPlayer().job.id;
        if (!FDO.includes(job)) {
            return;
        }

        Object.keys(this.speedZone).map(k => {
            this.blipFactory.hide(k, !duty);
        });
    }
}
