import { On, Once } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Permissions } from '../../core/permissions';
import { QBCore } from '../qbcore';

@Provider()
export class PlayerProvider {
    @Inject(QBCore)
    private QBCore: QBCore;

    @Inject(Permissions)
    private permissions: Permissions;

    @On('QBCore:Server:PlayerLoaded', false)
    onPlayerLoaded(player: any) {
        this.permissions.addPlayerRole(player.PlayerData.source, player.PlayerData.role);
    }

    @Once()
    onStart() {
        const connectedSources = this.QBCore.getPlayersSources();

        for (const source of connectedSources) {
            const player = this.QBCore.getPlayer(source);

            this.permissions.addPlayerRole(source, player.PlayerData.role);
        }
    }
}
