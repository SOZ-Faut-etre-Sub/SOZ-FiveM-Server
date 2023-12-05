import { Once, OnceStep, OnEvent, OnNuiEvent } from '@core/decorators/event';
import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { InputService } from '@public/client/nui/input.service';
import { uuidv4 } from '@public/core/utils';
import { ClientEvent, NuiEvent, ServerEvent } from '@public/shared/event';
import { JobPermission, JobType } from '@public/shared/job';
import { MenuType } from '@public/shared/nui/menu';

import { BlipFactory } from '../../blip';
import { NuiMenu } from '../../nui/nui.menu';
import { PlayerService } from '../../player/player.service';
import { TargetFactory } from '../../target/target.factory';
import { JobService } from '../job.service';

@Provider()
export class GouvProvider {
    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(BlipFactory)
    private blipFactory: BlipFactory;

    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(InputService)
    private inputService: InputService;

    @Inject(JobService)
    private jobService: JobService;

    @Once(OnceStep.PlayerLoaded)
    public setupMdrJob() {
        this.createBlips();

        this.targetFactory.createForBoxZone(
            'gouv:duty',
            {
                center: [-547.61, -611.22, 34.68],
                length: 0.6,
                width: 0.4,
                minZ: 33.68,
                maxZ: 35.68,
                heading: 270,
            },
            [
                {
                    type: 'server',
                    event: 'QBCore:ToggleDuty',
                    icon: 'fas fa-sign-in-alt',
                    label: 'Prise de service',
                    canInteract: () => {
                        return !this.playerService.isOnDuty();
                    },
                    job: JobType.Gouv,
                },
                {
                    type: 'server',
                    event: 'QBCore:ToggleDuty',
                    icon: 'fas fa-sign-in-alt',
                    label: 'Fin de service',
                    canInteract: () => {
                        return this.playerService.isOnDuty();
                    },
                    job: JobType.Gouv,
                },
                {
                    icon: 'fas fa-users',
                    label: 'Employé(e)s en service',
                    action: () => {
                        TriggerServerEvent('QBCore:GetEmployOnDuty');
                    },
                    canInteract: () => {
                        const player = this.playerService.getPlayer();
                        return (
                            this.playerService.isOnDuty() &&
                            this.jobService.hasPermission(player.job.id, JobPermission.OnDutyView)
                        );
                    },
                    job: JobType.Gouv,
                },
            ]
        );
    }

    @OnEvent(ClientEvent.JOBS_GOUV_OPEN_SOCIETY_MENU)
    public onOpenSocietyMenu() {
        if (this.nuiMenu.getOpened() === MenuType.GouvJobMenu) {
            this.nuiMenu.closeMenu();
            return;
        }

        this.nuiMenu.openMenu(MenuType.GouvJobMenu, {
            onDuty: this.playerService.isOnDuty(),
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
                }
            );
        }
    }
}
