import { Once, OnceStep, OnEvent, OnNuiEvent } from '@core/decorators/event';
import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { FeatureProvider } from '@public/client/feature/feature.provider';
import { InputService } from '@public/client/nui/input.service';
import { ClientEvent, NuiEvent, ServerEvent } from '@public/shared/event';
import { Feature } from '@public/shared/features';
import { PositiveNumberValidator } from '@public/shared/nui/input';
import { MenuType } from '@public/shared/nui/menu';
import { TaxType } from '@public/shared/tax';

import { emitRpc } from '../../../core/rpc';
import { JobTaxTier } from '../../../shared/configuration';
import { JobPermission, JobType } from '../../../shared/job';
import { Err, Ok } from '../../../shared/result';
import { RpcServerEvent } from '../../../shared/rpc';
import { BlipFactory } from '../../blip';
import { NuiMenu } from '../../nui/nui.menu';
import { PlayerListStateService } from '../../player/player.list.state.service';
import { PlayerService } from '../../player/player.service';
import { ConfigurationRepository } from '../../repository/configuration.repository';
import { TargetFactory } from '../../target/target.factory';
import { VehicleRadarProvider } from '../../vehicle/vehicle.radar.provider';
import { JobService } from '../job.service';

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

    @Inject(JobService)
    private jobService: JobService;

    @Inject(FeatureProvider)
    private featureProvider: FeatureProvider;

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
    public async onOpenSocietyMenu() {
        if (this.nuiMenu.getOpened() === MenuType.GouvJobMenu) {
            this.nuiMenu.closeMenu();
            return;
        }

        const updateSenatSalary = this.jobService.hasPermission(JobType.Gouv, JobPermission.GouvSenatSalary);
        this.nuiMenu.openMenu(MenuType.GouvJobMenu, {
            displayRadar: this.vehicleRadarProvider.displayRadar,
            updateSenatSalary,
        });
    }

    private createBlips() {
        if (this.featureProvider.isFeatureEnabled(Feature.WhatIfFirstEpisode)) {
            return;
        }

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
        const player = this.playerService.getPlayer();
        const isAdmin = ['admin', 'staff'].includes(player.role);

        const value = await this.inputService.askInput(
            {
                title: 'Pourcentage de taxe',
                maxCharacters: 3,
                defaultValue: '',
            },
            input => {
                const inputNumber = Number(input);

                if (isNaN(inputNumber) || inputNumber < 0) {
                    return Err('Veuillez entrer un nombre entre 16 et 30');
                }

                if (!isAdmin && (inputNumber < 16 || inputNumber > 30)) {
                    return Err('Veuillez entrer un nombre entre 16 et 30');
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

        if (!msg) return;

        await emitRpc(RpcServerEvent.PHONE_APP_NEWS_CREATE, {
            type: player.job.id,
            message: msg,
            reporter: player.charinfo.firstname + ' ' + player.charinfo.lastname,
            reporterId: player.citizenid,
            job: player.job.id,
        });
    }

    @OnNuiEvent(NuiEvent.GouvSenatSalary)
    public async senatSalary(value: number) {
        const newValue = await this.inputService.askInput(
            {
                title: 'Salaire de Sénateurs',
                defaultValue: value.toString(),
            },
            PositiveNumberValidator
        );

        if (newValue == null) {
            return;
        }

        TriggerServerEvent(ServerEvent.GOUV_SENAT_SALARY, newValue);
    }
}
