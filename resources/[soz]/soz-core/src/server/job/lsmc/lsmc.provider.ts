import { OnEvent } from '@public/core/decorators/event';
import { Rpc } from '@public/core/decorators/rpc';
import { ClientEvent, ServerEvent } from '@public/shared/event';
import { RpcServerEvent } from '@public/shared/rpc';

import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { Notifier } from '../../notifier';
import { PlayerService } from '../../player/player.service';

@Provider()
export class LSMCProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(Notifier)
    private notifier: Notifier;

    public ittRemovalCheck = (target: number): boolean => {
        const player = this.playerService.getPlayer(target);
        return player.metadata.itt;
    };

    public updateIttRemovalCheck(checker: (target: number) => boolean) {
        this.ittRemovalCheck = checker;
    }

    @Rpc(RpcServerEvent.LSMC_CAN_REMOVE_ITT)
    public canRemoveITT(source: number, target: number) {
        return this.ittRemovalCheck(target);
    }

    @Rpc(RpcServerEvent.LSMC_CAN_SET_ITT)
    public canSetITT(source: number, target: number) {
        const player = this.playerService.getPlayer(target);
        return !player.metadata.itt;
    }

    @OnEvent(ServerEvent.LSMC_SET_PATIENT_OUTFIT)
    public setPatientOutfit(source: number, target: number, useOutfit: boolean) {
        const player = this.playerService.getPlayer(target);
        if (!player) {
            return;
        }
        Player(player.source).state.isWearingPatientOutfit = useOutfit;

        if (useOutfit) {
            TriggerClientEvent(ClientEvent.LSMC_APPLY_PATIENT_CLOTHING, player.source);
        } else {
            TriggerClientEvent(ClientEvent.LSMC_REMOVE_PATIENT_CLOTHING, player.source);
        }
    }
}
