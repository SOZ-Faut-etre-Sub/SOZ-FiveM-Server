import { OnEvent } from '@core/decorators/event';
import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';

import { ClientEvent, ServerEvent } from '../../../shared/event';
import { DUTY_OUTFIT_NAME, LsmcCloakroom, PatientClothes } from '../../../shared/job/lsmc';
import { PlayerService } from '../../player/player.service';
import { PlayerWardrobe } from '../../player/player.wardrobe';
import { JobCloakroomProvider } from '../job.cloakroom.provider';

@Provider()
export class LSMCCloakroomProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(PlayerWardrobe)
    private playerWardrobe: PlayerWardrobe;

    @Inject(JobCloakroomProvider)
    private jobCloakroomProvider: JobCloakroomProvider;

    @OnEvent(ClientEvent.LSMC_APPLY_PATIENT_CLOTHING)
    public async applyPatientClothing() {
        await this.playerWardrobe.waitProgress(false);
        const player = this.playerService.getPlayer();
        this.playerService.setTempClothes(PatientClothes[player.skin.Model.Hash]['Patient']);
    }

    @OnEvent(ClientEvent.LSMC_REMOVE_PATIENT_CLOTHING)
    public async removePatientClothing() {
        await this.playerWardrobe.waitProgress(false);
        this.playerService.setTempClothes(null);
    }

    @OnEvent(ClientEvent.LSMC_OPEN_CLOAKROOM)
    public async openCloakroom(storageIdToSave: string) {
        await this.jobCloakroomProvider.openCloakroom(storageIdToSave, LsmcCloakroom);
    }

    @OnEvent(ClientEvent.LSMC_APPLY_OUTFIT)
    public async applyDutyClothing() {
        const model = GetEntityModel(PlayerPedId());

        const outfit = LsmcCloakroom[model][DUTY_OUTFIT_NAME];
        const progress = await this.playerWardrobe.waitProgress(false);
        if (progress.completed) {
            TriggerServerEvent(ServerEvent.CHARACTER_SET_JOB_CLOTHES, outfit);
        }
    }
}
