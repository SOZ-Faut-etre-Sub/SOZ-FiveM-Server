import { OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { NuiEvent } from '../../shared/event';
import { JobGrade, JobPermission } from '../../shared/job';
import { JobMenuData } from '../../shared/nui/player';
import { InputService } from '../nui/input.service';
import { NuiMenu } from '../nui/nui.menu';
import { PlayerService } from '../player/player.service';
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

    @OnNuiEvent(NuiEvent.PlayerMenuJobGradeCreate)
    public async onPlayerMenuJobGradeCreate() {
        const name = await this.inputService.askInput({
            title: 'Nom du grade',
            defaultValue: '',
            maxCharacters: 32,
        });

        if (!name || name.length === 0) {
            return;
        }

        TriggerServerEvent('job:grade:add', name);
        this.nuiMenu.closeMenu();
    }

    @OnNuiEvent(NuiEvent.PlayerMenuJobGradeDelete)
    public async onPlayerMenuJobGradeDelete({ grade }: { grade: JobGrade }) {
        const confirm = await this.inputService.askConfirm(
            `Etes vous sur de vouloir supprimer le grade ${grade.name} ?`
        );

        if (!confirm) {
            return;
        }

        TriggerServerEvent('job:grade:remove', grade.id);
        this.nuiMenu.closeMenu();
    }

    @OnNuiEvent(NuiEvent.PlayerMenuJobGradeSetDefault)
    public async onPlayerMenuJobGradeSetDefault({ gradeId }: { gradeId: number }) {
        TriggerServerEvent('job:grade:set-default', gradeId);
        this.nuiMenu.closeMenu();
    }

    @OnNuiEvent(NuiEvent.PlayerMenuJobGradeUpdateSalary)
    public async onPlayerMenuJobGradeUpdateSalary({ gradeId }: { gradeId: number }) {
        const salary = await this.inputService.askInput({
            title: 'Nouveau salaire :',
            defaultValue: '',
            maxCharacters: 32,
        });

        if (!salary || salary.length === 0) {
            return;
        }

        const salaryNumber = parseInt(salary, 10);

        TriggerServerEvent('job:grade:set-salary', gradeId, salaryNumber);
        this.nuiMenu.closeMenu();
    }

    @OnNuiEvent(NuiEvent.PlayerMenuJobGradeUpdateWeight)
    public async onPlayerMenuJobGradeUpdateWeight({ gradeId }: { gradeId: number }) {
        const weight = await this.inputService.askInput({
            title: 'Importance (le patron doit être le plus élevé) :',
            defaultValue: '',
            maxCharacters: 32,
        });

        if (!weight || weight.length === 0) {
            return;
        }

        const weightNumber = parseInt(weight, 10);

        TriggerServerEvent('job:grade:set-weight', gradeId, weightNumber);
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
        if (value) {
            TriggerServerEvent('job:grade:add-permission', gradeId, permission);
        } else {
            TriggerServerEvent('job:grade:remove-permission', gradeId, permission);
        }
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
