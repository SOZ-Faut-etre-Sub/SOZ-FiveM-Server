import { BoxZone } from '@public/shared/polyzone/box.zone';

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
        const value = await this.inputService.askInput<number>(
            {
                title: `Carte de santé: ${HealthBookLabel[field]}`,
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

                return Ok(number);
            }
        );

        if (value === null) {
            return Ok(true);
        }

        TriggerServerEvent(ServerEvent.LSMC_SET_HEALTH_BOOK, source, field, value);

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
                icon: 'c:ems/take_blood',
                job: 'lsmc',
                category: 'society',
                action: this.doBloodCheck.bind(this),
                item: 'flask_blood_empty',
            },
            {
                label: 'Etat de santé',
                icon: 'c:ems/health_state',
                color: 'lsmc',
                job: 'lsmc',
                category: 'society',
                action: this.doHealthCheck.bind(this),
            },
            {
                label: 'Modifier la carte de santé',
                icon: 'c:ems/health_card',
                color: 'lsmc',
                job: 'lsmc',
                category: 'society',
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

        [
            new BoxZone([1816.41, 3680.58, 33.48], 1.0, 1.0, {
                heading: 310.81,
                minZ: 33.88,
                maxZ: 34.48,
            }),
            new BoxZone([373.02, -1416.34, 32.41], 0.8, 0.6, {
                heading: 231.23,
                minZ: 32.41,
                maxZ: 32.86,
            }),
        ].forEach((zone, index) =>
            this.targetFactory.createForBoxZone('lsmc_analyze_' + index, zone, [
                {
                    label: 'Analyse urinaire',
                    icon: 'c:ems/urine_test',
                    color: 'lsmc',
                    job: 'lsmc',
                    category: 'society',
                    action: () => {
                        TriggerServerEvent(ServerEvent.LSMC_PEE_ANALYZE);
                    },
                    item: 'flask_pee_full',
                },
                {
                    label: 'Analyse de sang',
                    icon: 'c:ems/blood_test',
                    color: 'lsmc',
                    job: 'lsmc',
                    category: 'society',
                    action: () => {
                        TriggerServerEvent(ServerEvent.LSMC_BLOOD_ANALYZE);
                    },
                    item: 'flask_blood_full',
                },
            ])
        );
    }
}
