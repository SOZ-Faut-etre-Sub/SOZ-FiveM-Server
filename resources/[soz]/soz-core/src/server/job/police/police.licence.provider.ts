import { OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { PlayerService } from '@public/server/player/player.service';
import { ClientEvent, ServerEvent } from '@public/shared/event';
import { JobType } from '@public/shared/job';
import { PlayerLicenceLabels, PlayerLicenceType } from '@public/shared/player';
import { getDistance, Vector3 } from '@public/shared/polyzone/vector';

const jobAllowed = [JobType.FBI, JobType.LSPD, JobType.BCSO, JobType.FBI];

@Provider()
export class PoliceLicenceProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @OnEvent(ServerEvent.POLICE_REMOVE_POINT)
    public onRemovePoint(source: number, targetId: number, licenceType: PlayerLicenceType, nbPoints: number) {
        const player = this.playerService.getPlayer(source);
        const target = this.playerService.getPlayer(targetId);

        if (player && target && player != target) {
            if (
                getDistance(
                    GetEntityCoords(GetPlayerPed(player.source)) as Vector3,
                    GetEntityCoords(GetPlayerPed(target.source)) as Vector3
                ) > 2.5
            ) {
                TriggerClientEvent(
                    ClientEvent.NOTIFICATION_DRAW,
                    player.source,
                    `Vous êtes trop loin de la personne pour lui retirer des points`
                );
                return;
            }
            if (jobAllowed.includes(player.job.id)) {
                const licences = target.metadata.licences;
                const newValue = Math.max(0, licences[licenceType] - nbPoints);
                licences[licenceType] = newValue;
                const label = PlayerLicenceLabels[licenceType];

                TriggerClientEvent(
                    ClientEvent.NOTIFICATION_DRAW,
                    player.source,
                    `Vous avez retiré ~b~${nbPoints} point${nbPoints > 1 ? 's' : ''}~s~ sur le ~b~${label}~s~`
                );
                TriggerClientEvent(
                    ClientEvent.NOTIFICATION_DRAW,
                    target.source,
                    `~b~${nbPoints} point${nbPoints > 1 ? 's' : ''}~s~ ont été retirés de votre ~b~${label}~s~ !`
                );
                this.playerService.setPlayerMetadata(target.source, 'licences', licences);
            }
        }
    }

    @OnEvent(ServerEvent.POLICE_REMOVE_LICENCE)
    public onRemoveLicence(source: number, targetId: number, licenceType: PlayerLicenceType) {
        const player = this.playerService.getPlayer(source);
        const target = this.playerService.getPlayer(targetId);

        if (player && target && player != target) {
            if (jobAllowed.includes(player.job.id)) {
                const licences = target.metadata.licences;
                if (!licences[licenceType]) {
                    TriggerClientEvent(
                        ClientEvent.NOTIFICATION_DRAW,
                        player.source,
                        `Le permis ~b~${PlayerLicenceLabels[licenceType]}~s~ est déjà invalide`
                    );
                    return;
                }
                licences[licenceType] = 0;

                TriggerClientEvent(
                    ClientEvent.NOTIFICATION_DRAW,
                    player.source,
                    `Vous avez retiré le permis ~b~${PlayerLicenceLabels[licenceType]}~s~`
                );
                TriggerClientEvent(
                    ClientEvent.NOTIFICATION_DRAW,
                    target.source,
                    `Votre permis ~b~${PlayerLicenceLabels[licenceType]}~s~ a été retiré !`
                );
                this.playerService.setPlayerMetadata(target.source, 'licences', licences);
            }
        }
    }

    @OnEvent(ServerEvent.POLICE_GIVE_LICENCE)
    public onGiveLicence(source: number, targetId: number, licenceType: PlayerLicenceType) {
        const player = this.playerService.getPlayer(source);
        const target = this.playerService.getPlayer(targetId);

        if (player && target && player != target) {
            if (jobAllowed.includes(player.job.id)) {
                const licences = target.metadata.licences;
                if (licences[licenceType]) {
                    TriggerClientEvent(
                        ClientEvent.NOTIFICATION_DRAW,
                        player.source,
                        `Le permis ~b~${PlayerLicenceLabels[licenceType]}~s~ est déjà valide`
                    );
                    return;
                }
                licences[licenceType] = 1;

                TriggerClientEvent(
                    ClientEvent.NOTIFICATION_DRAW,
                    player.source,
                    `Vous avez donné le permis ~b~${PlayerLicenceLabels[licenceType]}~s~`
                );
                TriggerClientEvent(
                    ClientEvent.NOTIFICATION_DRAW,
                    target.source,
                    `Vous avez reçu le permis ~b~${PlayerLicenceLabels[licenceType]}~s~`
                );
                this.playerService.setPlayerMetadata(target.source, 'licences', licences);
            }
        }
    }
}
