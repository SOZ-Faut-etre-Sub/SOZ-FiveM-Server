import { ProgressService } from '@public/client/progress.service';
import { RaceProvider } from '@public/client/race/race.provider';
import { Once, OnceStep, OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { Tick, TickInterval } from '@public/core/decorators/tick';
import { ClientEvent, ServerEvent } from '@public/shared/event';
import { ALL_FDO_JOB_TARGETS } from '@public/shared/job';
import { getDistance, Vector3, Vector4 } from '@public/shared/polyzone/vector';

import { ObjectProvider } from '../../object/object.provider';
import { InteractionProvider } from '../../quick-interaction/interaction.provider';

const spikeModel = GetHashKey('p_ld_stinger_s');

@Provider()
export class PoliceSpikeProvider {
    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(RaceProvider)
    private raceProvider: RaceProvider;

    @Inject(ObjectProvider)
    private objectProvider: ObjectProvider;

    @Inject(InteractionProvider)
    private interactionProvider: InteractionProvider;

    private spikes: { [id: string]: Vector4 } = {};
    private closestSpike: string | null = null;

    @Once(OnceStep.Start)
    public async onStart() {
        this.interactionProvider.createInteractionForModels(
            spikeModel,
            {
                label: 'Démonter',
                action: async (entity: number) => {
                    const { completed } = await this.progressService.progress(
                        'remove_object',
                        'Récupération de la herse en cours',
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

                    TriggerServerEvent(ServerEvent.POLICE_REMOVE_SPIKE, ObjToNet(entity));
                },
                job: ALL_FDO_JOB_TARGETS,
            },
            undefined,
            1.1,
            1.4
        );

        [GetHashKey('prop_barrier_work05'), GetHashKey('prop_air_conelight')].map(model => {
            this.interactionProvider.createInteractionForModels(
                model,
                {
                    label: 'Démonter',
                    canInteract: entity => {
                        const id = this.objectProvider.getIdFromEntity(entity);
                        return !!id;
                    },
                    action: async (entity: number) => {
                        const id = this.objectProvider.getIdFromEntity(entity);
                        if (!id) {
                            return;
                        }

                        TriggerServerEvent(ServerEvent.OBJECT_COLLECT, id);
                    },
                    job: ALL_FDO_JOB_TARGETS,
                },
                undefined,
                0.8,
                1.2
            );
        });

        TriggerServerEvent(ServerEvent.POLICE_INIT_SPIKE);
    }

    @OnEvent(ClientEvent.POLICE_REQUEST_ADD_SPIKE)
    public async requestAddSpike() {
        const ped = PlayerPedId();
        const entityCoords = GetOffsetFromEntityInWorldCoords(ped, 0.0, 2.25, 0.0);
        const entityHeading = GetEntityHeading(ped);

        const { completed } = await this.progressService.progress(
            'spawn_object',
            'Lancement de la herse en cours',
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
            ServerEvent.POLICE_ADD_SPIKE,
            this.getProperGroundCoord(spikeModel, entityCoords, entityHeading)
        );
    }

    public getProperGroundCoord(obj: number, position: number[], heading: number): Vector4 {
        const object = CreateObject(obj, position[0], position[1], position[2], false, false, false);
        SetEntityVisible(object, false, false);
        SetEntityHeading(object, heading);
        PlaceObjectOnGroundProperly(object);

        const second_position = GetEntityCoords(object);
        DeleteObject(object);
        return [second_position[0], second_position[1], second_position[2], heading];
    }

    @OnEvent(ClientEvent.POLICE_SYNC_SPIKE)
    public async syncSpikes(spikes: { [id: string]: Vector4 }) {
        this.spikes = spikes;
    }

    @Tick(TickInterval.EVERY_SECOND)
    public async getClosestSpike() {
        if (this.raceProvider.isInRace()) {
            this.closestSpike = null;
        } else {
            const pos = GetEntityCoords(PlayerPedId(), true) as Vector3;
            let current = null;
            let dist = null;

            for (const [id, spike] of Object.entries(this.spikes)) {
                if (current == null) {
                    dist = getDistance(pos, [spike[0], spike[1], spike[2]]);
                    current = id;
                } else {
                    if (getDistance(pos, [spike[0], spike[1], spike[2]]) < dist) {
                        dist = getDistance(pos, [spike[0], spike[1], spike[2]]);
                        current = id;
                    }
                }
            }
            this.closestSpike = current;
        }
    }

    @Tick(TickInterval.EVERY_FRAME)
    public async checkWheels() {
        const ped = PlayerPedId();
        const vehicle = GetVehiclePedIsIn(ped, false);

        if (!vehicle) {
            return;
        }

        const coords = GetEntityCoords(ped) as Vector3;

        if (this.closestSpike && this.spikes[this.closestSpike]) {
            const spikePos = [
                this.spikes[this.closestSpike][0],
                this.spikes[this.closestSpike][1],
                this.spikes[this.closestSpike][2],
            ] as Vector3;
            if (getDistance(spikePos, coords) <= 10) {
                const tires = [
                    { bone: 'wheel_lf', index: 0 },
                    { bone: 'wheel_rf', index: 1 },
                    { bone: 'wheel_lm', index: 2 },
                    { bone: 'wheel_rm', index: 3 },
                    { bone: 'wheel_lr', index: 4 },
                    { bone: 'wheel_rr', index: 5 },
                ];

                for (const tire of tires) {
                    const tirePos = GetWorldPositionOfEntityBone(
                        vehicle,
                        GetEntityBoneIndexByName(vehicle, tire.bone)
                    ) as Vector3;
                    if (getDistance(tirePos, spikePos) < 1.8) {
                        if (
                            !IsVehicleTyreBurst(vehicle, tire.index, true) ||
                            !IsVehicleTyreBurst(vehicle, tire.index, false)
                        ) {
                            SetVehicleTyreBurst(vehicle, tire.index, false, 1000);
                            TriggerServerEvent(ServerEvent.POLICE_REMOVE_SPIKE, parseInt(this.closestSpike));
                        }
                    }
                }
            }
        }
    }
}
