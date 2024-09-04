import { Once, OnceStep, OnEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ClientEvent } from '../../../shared/event/client';
import { ServerEvent } from '../../../shared/event/server';
import { JobPermission, JobType } from '../../../shared/job';
import { PositiveNumberValidator } from '../../../shared/nui/input';
import { createRadarZone, RADAR_ID_PREFIX } from '../../../shared/vehicle/radar';
import { InputService } from '../../nui/input.service';
import { ObjectEditorProvider } from '../../object/object.editor.provider';
import { ObjectProvider } from '../../object/object.provider';
import { PlayerService } from '../../player/player.service';
import { RadarRepository } from '../../repository/radar.repository';
import { TargetFactory } from '../../target/target.factory';
import { JobService } from '../job.service';

const RADAR_MODEL = GetHashKey('soz_prop_radar_2');

@Provider()
export class GouvRadarProvider {
    @Inject(ObjectEditorProvider)
    private readonly objectEditorProvider: ObjectEditorProvider;

    @Inject(TargetFactory)
    private readonly targetFactory: TargetFactory;

    @Inject(PlayerService)
    private readonly playerService: PlayerService;

    @Inject(InputService)
    private readonly inputService: InputService;

    @Inject(ObjectProvider)
    private readonly objectProvider: ObjectProvider;

    @Inject(RadarRepository)
    private readonly radarRepository: RadarRepository;

    @Inject(JobService)
    private readonly jobService: JobService;

    @Once(OnceStep.PlayerLoaded)
    public setupGouvRadar() {
        this.targetFactory.createForModel(RADAR_MODEL, [
            {
                label: 'Définir la vitesse',
                icon: 'fas fa-bolt',
                job: JobType.Gouv,
                blackoutJob: JobType.Gouv,
                blackoutGlobal: true,
                category: 'society',
                canInteract: entity =>
                    this.jobService.hasPermission(JobType.Gouv, JobPermission.GouvManageRadar) &&
                    this.getRadarId(entity) !== null,
                action: this.setRadarSpeed.bind(this),
            },
            {
                label: 'Désactiver le radar',
                icon: 'fas fa-toggle-off',
                job: JobType.Gouv,
                blackoutJob: JobType.Gouv,
                blackoutGlobal: true,
                category: 'society',
                canInteract: entity => {
                    if (!this.jobService.hasPermission(JobType.Gouv, JobPermission.GouvManageRadar)) {
                        return false;
                    }

                    const radarId = this.getRadarId(entity);

                    if (radarId === null) {
                        return false;
                    }

                    const radar = this.radarRepository.find(radarId);

                    if (!radar) {
                        return false;
                    }

                    return radar.enabled;
                },
                action: entity => {
                    this.setRadarDisabled(entity, true);
                },
            },
            {
                label: 'Activer le radar',
                icon: 'fas fa-toggle-on',
                job: JobType.Gouv,
                blackoutJob: JobType.Gouv,
                blackoutGlobal: true,
                category: 'society',
                canInteract: entity => {
                    if (!this.jobService.hasPermission(JobType.Gouv, JobPermission.GouvManageRadar)) {
                        return false;
                    }

                    const radarId = this.getRadarId(entity);

                    if (radarId === null) {
                        return false;
                    }

                    const radar = this.radarRepository.find(radarId);

                    if (!radar) {
                        return false;
                    }

                    return !radar.enabled;
                },
                action: entity => {
                    this.setRadarDisabled(entity, false);
                },
            },
            {
                label: 'Supprimer',
                icon: 'fas fa-trash',
                job: JobType.Gouv,
                blackoutJob: JobType.Gouv,
                blackoutGlobal: true,
                category: 'society',
                canInteract: entity => {
                    if (!this.jobService.hasPermission(JobType.Gouv, JobPermission.GouvManageRadar)) {
                        return false;
                    }

                    return this.getRadarId(entity) !== null;
                },
                action: this.removeRadar.bind(this),
            },
        ]);
    }

    @OnEvent(ClientEvent.ITEM_RADAR_USE)
    public async onRadarUse() {
        const object = await this.objectEditorProvider.createOrUpdateObject(RADAR_MODEL, {
            onDrawCallback: object => {
                if (!object) {
                    return;
                }

                const zone = createRadarZone(object.position);
                zone.draw([200, 200, 0, 100]);
            },
            snapToGround: true,
            collision: true,
            context: JobType.Gouv,
        });

        if (!object) {
            return;
        }

        TriggerServerEvent(ServerEvent.GOUV_RADAR_ADD, object.position);
    }

    private async setRadarSpeed(entity: number) {
        const radarId = this.getRadarId(entity);

        if (radarId === null) {
            return;
        }

        const speed = await this.inputService.askInput(
            {
                title: 'Vitesse du radar',
                maxCharacters: 3,
            },
            PositiveNumberValidator
        );

        if (speed === null) {
            return;
        }

        TriggerServerEvent(ServerEvent.GOUV_RADAR_SET_SPEED, radarId, speed);
    }

    private removeRadar(entity: number) {
        const radarId = this.getRadarId(entity);

        if (radarId === null) {
            return;
        }

        TriggerServerEvent(ServerEvent.GOUV_RADAR_REMOVE, radarId);
    }

    private setRadarDisabled(entity: number, disabled: boolean) {
        const radarId = this.getRadarId(entity);

        if (radarId === null) {
            return;
        }

        TriggerServerEvent(ServerEvent.GOUV_RADAR_SET_DISABLED, radarId, disabled);
    }

    private getRadarId(entity: number) {
        const id = this.objectProvider.getIdFromEntity(entity);

        if (!id) {
            return null;
        }

        const radarId = Number(id.replace(RADAR_ID_PREFIX, ''));

        if (isNaN(radarId)) {
            return null;
        }

        return radarId;
    }
}
