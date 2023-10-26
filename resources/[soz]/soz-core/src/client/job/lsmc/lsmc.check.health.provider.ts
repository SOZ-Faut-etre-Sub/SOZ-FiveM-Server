import { Once, OnNuiEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { NuiEvent, ServerEvent } from '../../../shared/event';
import { Feature, isFeatureEnabled } from '../../../shared/features';
import { HealthBookLabel, HealthBookMinMax } from '../../../shared/health';
import { MenuType } from '../../../shared/nui/menu';
import { PlayerHealthBook } from '../../../shared/player';
import { Vector3 } from '../../../shared/polyzone/vector';
import { Err, Ok } from '../../../shared/result';
import { InputService } from '../../nui/input.service';
import { NuiDispatch } from '../../nui/nui.dispatch';
import { NuiMenu } from '../../nui/nui.menu';
import { PlayerService } from '../../player/player.service';
import { ProgressService } from '../../progress.service';
import { TargetFactory } from '../../target/target.factory';

@Provider()
export class LSMCCheckHealthProvider {
    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @Inject(NuiDispatch)
    private nuiDispatch: NuiDispatch;

    @Inject(InputService)
    private inputService: InputService;

    public doBloodCheck(entity: number) {
        const target = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity));

        TriggerServerEvent(ServerEvent.LSMC_BLOOD_FILL_FLASK, target);
    }

    public async doHealthCheck(entity: number) {
        const target = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity));
        const { completed } = await this.progressService.progress(
            'lsmc_health_check',
            "Vous étudiez l'état de santé du patient...",
            5000,
            {
                task: 'CODE_HUMAN_MEDIC_TEND_TO_DEAD',
            }
        );

        if (!completed) {
            return;
        }

        TriggerServerEvent(ServerEvent.LSMC_HEALTH_CHECK, target);
    }

    @OnNuiEvent(NuiEvent.PlayerSetHealthBookField)
    async setPlayerHealthBookField({ source, field }: { source: number; field: keyof PlayerHealthBook }) {
        const value = await this.inputService.askInput(
            {
                title: `Carte de santé: ${HealthBookLabel[field]}`,
                defaultValue: '',
                maxCharacters: 3,
            },
            value => {
                const number = Number(value);
                if (isNaN(number)) {
                    return Err('Valeur incorrecte');
                }

                if (
                    HealthBookMinMax[field].max &&
                    (number < HealthBookMinMax[field].min || number > HealthBookMinMax[field].max)
                ) {
                    return Err(
                        `Valeur incorrecte, doit être entre ${HealthBookMinMax[field].min} et ${HealthBookMinMax[field].max}`
                    );
                } else if (!HealthBookMinMax[field].max && number < HealthBookMinMax[field].min) {
                    return Err(`Valeur incorrecte, doit être supérieure à ${HealthBookMinMax[field].min}`);
                }

                return Ok(true);
            }
        );

        if (value === null) {
            return Ok(true);
        }

        TriggerServerEvent(ServerEvent.LSMC_SET_HEALTH_BOOK, source, field, Number(value));

        return Ok(true);
    }

    @Once()
    public onStart() {
        if (!isFeatureEnabled(Feature.MyBodySummer)) {
            return;
        }

        this.targetFactory.createForAllPlayer([
            {
                label: 'Prise de sang pour test',
                color: 'lsmc',
                icon: 'c:ems/take_blood.png',
                job: 'lsmc',
                canInteract: () => {
                    return this.playerService.isOnDuty();
                },
                action: this.doBloodCheck.bind(this),
                item: 'flask_blood_empty',
            },
            {
                label: 'Etat de santé',
                icon: 'c:ems/health_state.png',
                color: 'lsmc',
                job: 'lsmc',
                canInteract: () => {
                    return this.playerService.isOnDuty();
                },
                action: this.doHealthCheck.bind(this),
            },
            {
                label: 'Modifier la carte de santé',
                icon: 'c:ems/health_card.png',
                color: 'lsmc',
                job: 'lsmc',
                canInteract: () => {
                    return this.playerService.isOnDuty();
                },
                action: entity => {
                    const target = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity));
                    this.nuiMenu.openMenu(MenuType.SetHealthState, target, {
                        position: {
                            position: () => {
                                return GetEntityCoords(entity) as Vector3;
                            },
                            distance: 3,
                        },
                    });
                },
            },
        ]);

        this.targetFactory.createForBoxZone(
            'lsmc_analyze',
            {
                center: [371.7, -1434.45, 32.51],
                length: 1.8,
                width: 0.8,
                minZ: 31.51,
                maxZ: 34.51,
                heading: 320,
            },
            [
                {
                    label: 'Analyse urinaire',
                    icon: 'c:ems/urine_test.png',
                    color: 'lsmc',
                    job: 'lsmc',
                    canInteract: () => {
                        return this.playerService.isOnDuty();
                    },
                    event: ServerEvent.LSMC_PEE_ANALYZE,
                    action: () => {
                        TriggerServerEvent(ServerEvent.LSMC_PEE_ANALYZE);
                    },
                    item: 'flask_pee_full',
                },
                {
                    label: 'Analyse de sang',
                    icon: 'c:ems/blood_test.png',
                    color: 'lsmc',
                    job: 'lsmc',
                    canInteract: () => {
                        return this.playerService.isOnDuty();
                    },
                    action: () => {
                        TriggerServerEvent(ServerEvent.LSMC_BLOOD_ANALYZE);
                    },
                    item: 'flask_blood_full',
                },
            ]
        );
    }
}
