import { Once, OnceStep, OnEvent, OnNuiEvent } from '@core/decorators/event';
import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { InputService } from '@public/client/nui/input.service';
import { uuidv4 } from '@public/core/utils';
import { ClientEvent, NuiEvent, ServerEvent } from '@public/shared/event';
import { MenuType } from '@public/shared/nui/menu';

import { TaxType } from '../../../shared/bank';
import { JobTaxTier } from '../../../shared/configuration';
import { JobType } from '../../../shared/job';
import { Err, Ok } from '../../../shared/result';
import { BlipFactory } from '../../blip';
import { NuiMenu } from '../../nui/nui.menu';
import { PlayerListStateService } from '../../player/player.list.state.service';
import { PlayerService } from '../../player/player.service';
import { ConfigurationRepository } from '../../repository/configuration.repository';
import { TargetFactory } from '../../target/target.factory';
import { VehicleRadarProvider } from '../../vehicle/vehicle.radar.provider';

@Provider()
export class GouvProvider {
    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(BlipFactory)
    private blipFactory: BlipFactory;

    @Inject(InputService)
    private inputService: InputService;

    @Inject(ConfigurationRepository)
    private configurationRepository: ConfigurationRepository;

    @Inject(VehicleRadarProvider)
    private vehicleRadarProvider: VehicleRadarProvider;

    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(PlayerListStateService)
    private playerListStateService: PlayerListStateService;

    @Once(OnceStep.PlayerLoaded)
    public setupMdrJob() {
        this.createBlips();

        this.targetFactory.createForAllPlayer([
            {
                label: "Valider l'identité",
                job: JobType.Gouv,
                icon: 'gouv/identity',
                category: 'society',
                canInteract: entity => {
                    const targetSource = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity));

                    return !this.playerListStateService.isValidated(targetSource);
                },
                action: entity => {
                    const targetSource = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity));

                    TriggerServerEvent(ServerEvent.GOUV_VALIDATE_IDENTITY, targetSource);
                },
            },
        ]);
    }

    @OnEvent(ClientEvent.JOBS_GOUV_OPEN_SOCIETY_MENU)
    public onOpenSocietyMenu() {
        if (this.nuiMenu.getOpened() === MenuType.GouvJobMenu) {
            this.nuiMenu.closeMenu();
            return;
        }

        this.nuiMenu.openMenu(MenuType.GouvJobMenu, {
            displayRadar: this.vehicleRadarProvider.displayRadar,
        });
    }

    private createBlips() {
        this.blipFactory.create('jobs:gouv', {
            name: 'Gouvernement',
            coords: { x: -555.66, y: -599.36, z: 34.68 },
            sprite: 76,
            scale: 1.1,
        });
    }

    @OnNuiEvent(NuiEvent.GouvSetJobTaxTier)
    public async setJobTaxTier({ tier }: { tier: keyof JobTaxTier }) {
        const configuration = this.configurationRepository.getValue('JobTaxTier');

        const value = await this.inputService.askInput(
            {
                title: 'Nouveau seuil des impôts',
                maxCharacters: 20,
                defaultValue: configuration[tier].toString(),
            },
            input => {
                const inputNumber = Number(input);

                if (isNaN(inputNumber) || inputNumber < 0) {
                    return Err('Veuillez entrer un nombre positif');
                }

                return Ok(inputNumber);
            }
        );

        if (!value) {
            return;
        }

        const valueNumber = Number(value);

        TriggerServerEvent(ServerEvent.GOUV_UPDATE_JOB_TIER_TAX, tier, valueNumber);
    }

    @OnNuiEvent(NuiEvent.GouvSetJobTaxTierPercentage)
    public async setJobTaxTierPercentage({ tier }: { tier: keyof JobTaxTier }) {
        const configuration = this.configurationRepository.getValue('JobTaxTier');

        const value = await this.inputService.askInput(
            {
                title: 'Nouveau pourcentage des impôts',
                maxCharacters: 20,
                defaultValue: configuration[tier].toString(),
            },
            input => {
                const inputNumber = Number(input);

                if (isNaN(inputNumber) || inputNumber < 0 || inputNumber > 100) {
                    return Err('Veuillez entrer un nombre positif et inférieur à 100');
                }

                return Ok(inputNumber);
            }
        );

        if (!value) {
            return;
        }

        const valueNumber = Number(value);

        TriggerServerEvent(ServerEvent.GOUV_UPDATE_JOB_TIER_TAX_PERCENTAGE, tier, valueNumber);
    }

    @OnNuiEvent(NuiEvent.GouvSetTax)
    public async setTax({ type }: { type: TaxType }) {
        const value = await this.inputService.askInput(
            {
                title: 'Pourcentage de taxe',
                maxCharacters: 3,
                defaultValue: '',
            },
            input => {
                const inputNumber = Number(input);

                if (isNaN(inputNumber) || inputNumber < 0 || inputNumber > 40) {
                    return Err('Veuillez entrer un nombre entre 0 et 40');
                }

                return Ok(inputNumber);
            }
        );

        if (value === null) {
            return;
        }

        const valueNumber = Number(value);

        TriggerServerEvent(ServerEvent.GOUV_UPDATE_TAX, type, valueNumber);
    }

    @OnNuiEvent(NuiEvent.GouvAnnoncement)
    public async annoncement() {
        const msg = await this.inputService.askInput({
            title: 'Message de la communication',
            maxCharacters: 235,
            defaultValue: '',
        });

        const player = this.playerService.getPlayer();

        if (msg) {
            TriggerServerEvent(
                ServerEvent.PHONE_APP_NEWS_CREATE_BROADCAST,
                'phone:app:news:createNewsBroadcast:' + uuidv4(),
                {
                    type: player.job.id,
                    message: msg,
                    reporter: player.charinfo.firstname + ' ' + player.charinfo.lastname,
                    reporterId: player.citizenid,
                    job: player.job.id,
                }
            );
        }
    }
}
