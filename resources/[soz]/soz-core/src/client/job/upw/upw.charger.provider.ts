import { ProgressService } from '@public/client/progress.service';
import { UpwChargerRepository } from '@public/client/resources/upw.station.repository';
import { OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { Tick } from '@public/core/decorators/tick';
import { emitRpc } from '@public/core/rpc';
import { wait } from '@public/core/utils';
import { ClientEvent, ServerEvent } from '@public/shared/event';
import { UpwCharger, UpwStation } from '@public/shared/fuel';
import { getDistance, Vector3 } from '@public/shared/polyzone/vector';
import { RpcEvent } from '@public/shared/rpc';

@Provider()
export class UpwChargerProvider {
    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(UpwChargerRepository)
    private upwChargerRepository: UpwChargerRepository;

    @OnEvent(ClientEvent.UPW_CREATE_CHARGER)
    public async onCreateCharger(charger: UpwCharger) {
        const ped = PlayerPedId();
        TaskTurnPedToFaceCoord(ped, charger.position[0], charger.position[1], charger.position[2], 500);
        await wait(500);
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

    @Tick(5000)
    public async updateChargerTexture() {
        const position = GetEntityCoords(PlayerPedId(), false) as Vector3;
        const charger = this.upwChargerRepository.getClosestCharger(position);
        if (!charger) {
            return;
        }
        if (!charger || getDistance(position, charger.position) > 50) {
            return;
        }
        const station = await emitRpc<UpwStation>(RpcEvent.UPW_GET_STATION, charger.station);
        if (!station) {
            return;
        }
        if (station.stock >= station.max_stock * 0.8) {
            AddReplaceTexture('upwcarchargertex', 'cc_emit_full', 'upwcarchargertex', 'cc_emit_full');
        } else if (station.stock >= station.max_stock * 0.5) {
            AddReplaceTexture('upwcarchargertex', 'cc_emit_full', 'upwcarchargertex', 'cc_emit_66');
        } else if (station.stock >= station.max_stock * 0.2) {
            AddReplaceTexture('upwcarchargertex', 'cc_emit_full', 'upwcarchargertex', 'cc_emit_33');
        } else {
            AddReplaceTexture('upwcarchargertex', 'cc_emit_full', 'upwcarchargertex', 'cc_emit_empty');
        }
    }
}
