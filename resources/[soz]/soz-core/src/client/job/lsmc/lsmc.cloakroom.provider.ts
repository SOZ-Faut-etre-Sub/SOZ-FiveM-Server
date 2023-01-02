import { OnEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ClientEvent } from '../../../shared/event';
import { PatientClothes } from '../../../shared/job/lsmc';
import { PlayerService } from '../../player/player.service';
import { PlayerWardrobe } from '../../player/player.wardrobe';

@Provider()
export class LSMCCloakroomProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(PlayerWardrobe)
    private playerWardrobe: PlayerWardrobe;

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
}
