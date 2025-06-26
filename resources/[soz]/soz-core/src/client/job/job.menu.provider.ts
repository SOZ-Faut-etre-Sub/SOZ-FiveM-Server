import { CasinoService } from '@private/client/casino/casino.service';

import { Command } from '../../core/decorators/command';
import { OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ClientEvent, NuiEvent, ServerEvent } from '../../shared/event';
import { JobGrade, JobPermission } from '../../shared/job';
import { PositiveNumberValidator } from '../../shared/nui/input';
import { JobMenuData } from '../../shared/nui/player';
import { InputService } from '../nui/input.service';
import { NuiMenu } from '../nui/nui.menu';
import { PlayerService } from '../player/player.service';
import { Election2024CeremonyProvider } from '../story/election-2024/ceremony.provider';
import { ParadeProvider } from '../story/parade.provider';
import { JobService } from './job.service';

@Provider()
export class JobMenuProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(JobService)
    private jobService: JobService;

    @Inject(InputService)
    private inputService: InputService;

    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @Inject(Election2024CeremonyProvider)
    private ceremonyProvider: Election2024CeremonyProvider;

    @Inject(ParadeProvider)
    private paradeProvider: ParadeProvider;

    @Inject(CasinoService)
    private readonly casinoService: CasinoService;

    @OnNuiEvent(NuiEvent.PlayerMenuJobGradeCreate)
    public async onPlayerMenuJobGradeCreate() {
        const name = await this.inputService.askInput({
            title: 'Nom du grade',
            maxCharacters: 32,
        });

        if (!name || name.length === 0) {
            return;
        }

        TriggerServerEvent(ServerEvent.JOB_GRADE_ADD, name);

        this.nuiMenu.closeMenu();
    }

    @OnNuiEvent(NuiEvent.PlayerMenuJobGradeDelete)
    public async onPlayerMenuJobGradeDelete({ grade }: { grade: JobGrade }) {
        const confirm = await this.inputService.askConfirm(
            `Êtes-vous sûr(e) de vouloir supprimer le grade ${grade.name} ? (OUI)`
        );

        if (!confirm) {
            return;
        }

        TriggerServerEvent(ServerEvent.JOB_GRADE_REMOVE, grade.id);
        this.nuiMenu.closeMenu();
    }

    @OnNuiEvent(NuiEvent.PlayerMenuJobGradeSetDefault)
    public async onPlayerMenuJobGradeSetDefault({ gradeId }: { gradeId: number }) {
        TriggerServerEvent(ServerEvent.JOB_GRADE_SET_DEFAULT, gradeId);
        this.nuiMenu.closeMenu();
    }

    @OnNuiEvent(NuiEvent.PlayerMenuJobGradeUpdateSalary)
    public async onPlayerMenuJobGradeUpdateSalary({ gradeId }: { gradeId: number }) {
        const salary = await this.inputService.askInput(
            {
                title: 'Nouveau salaire :',
                maxCharacters: 32,
            },
            PositiveNumberValidator
        );

        TriggerServerEvent(ServerEvent.JOB_GRADE_SET_SALARY, gradeId, salary);
        this.nuiMenu.closeMenu();
    }

    @OnNuiEvent(NuiEvent.PlayerMenuJobGradeUpdateWeight)
    public async onPlayerMenuJobGradeUpdateWeight({ gradeId }: { gradeId: number }) {
        const weight = await this.inputService.askInput(
            {
                title: 'Importance (le patron doit être le plus élevé) :',
                maxCharacters: 32,
            },
            PositiveNumberValidator
        );

        TriggerServerEvent(ServerEvent.JOB_GRADE_SET_WEIGHT, gradeId, weight);
        this.nuiMenu.closeMenu();
    }

    @OnNuiEvent(NuiEvent.PlayerMenuJobGradeUpdateName)
    public async onPlayerMenuJobGradeUpdateName({ gradeId }: { gradeId: number }) {
        const newName = await this.inputService.askInput({
            title: 'Nouveau nom :',
            maxCharacters: 32,
        });

        if (!newName || newName.length === 0) {
            return;
        }

        TriggerServerEvent(ServerEvent.JOB_GRADE_SET_NAME, gradeId, newName);
        this.nuiMenu.closeMenu();
    }

    @OnNuiEvent(NuiEvent.PlayerMenuJobGradePermissionUpdate)
    public async onPlayerMenuJobGradePermissionUpdate({
        gradeId,
        permission,
        value,
    }: {
        gradeId: number;
        permission: JobPermission;
        value: boolean;
    }) {
        TriggerServerEvent(ServerEvent.JOB_GRADE_SET_PERMISSION, gradeId, permission, value);
    }

    @Command('society-menu', {
        description: 'Ouvrir le menu entreprise',
        keys: [{ mapper: 'keyboard', key: 'F3' }],
    })
    public openSocietyMenu() {
        const player = this.playerService.getPlayer();

        if (!player || player.metadata.isdead) {
            return;
        }

        const job = this.jobService.getJob(player.job.id);

        if (!job) {
            return;
        }

        if (this.casinoService.usingMinigame()) {
            return;
        }

        if (this.ceremonyProvider.isRunning) {
            return;
        }

        if (this.paradeProvider.isRunning) {
            return;
        }

        const event = job.menuCallback || ClientEvent.JOB_OPEN_MENU;
        TriggerEvent(event, job.id);
    }

    public getJobMenuData(): JobMenuData {
        const player = this.playerService.getPlayer();

        if (!player) {
            return {
                enabled: false,
                job: null,
            };
        }

        if (!this.jobService.hasPermission(player.job.id, JobPermission.ManageGrade)) {
            return {
                enabled: false,
                job: null,
            };
        }

        const job = this.jobService.getJob(player.job.id);

        if (!job) {
            return {
                enabled: false,
                job: null,
            };
        }

        return {
            enabled: true,
            job,
        };
    }
}
