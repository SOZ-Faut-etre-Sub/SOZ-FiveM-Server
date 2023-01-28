import { ProgressService } from '@public/client/progress.service';
import { OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { wait } from '@public/core/utils';
import { ClientEvent, ServerEvent } from '@public/shared/event';
import { UpwCharger } from '@public/shared/fuel';

@Provider()
export class UpwChargerProvider {
    @Inject(ProgressService)
    private progressService: ProgressService;

    @OnEvent(ClientEvent.UPW_CREATE_CHARGER)
    public async onCreateCharger(charger: UpwCharger) {
        const ped = PlayerPedId();
        TaskTurnPedToFaceCoord(ped, charger.position[0], charger.position[1], charger.position[2], 1000);
        await wait(1000);
        const { completed } = await this.progressService.progress(
            'create_charger',
            'Installer une borne de recharge...',
            60000,
            {
                task: 'world_human_const_drill',
            },
            {
                disableCombat: true,
                disableMovement: true,
            }
        );
        if (!completed) {
            return;
        }
        TriggerServerEvent(ServerEvent.UPW_CREATE_CHARGER, charger);
    }
}
