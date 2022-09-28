import { Inject, Injectable } from '../core/decorators/injectable';
import { PlayerService } from './player/player.service';

@Injectable()
export class PermissionService {
    @Inject(PlayerService)
    private playerService: PlayerService;

    public isHelper(source: number): boolean {
        return (
            this.playerService.hasPermission(source, 'helper') ||
            this.playerService.hasPermission(source, 'staff') ||
            this.playerService.hasPermission(source, 'admin')
        );
    }

    public isStaff(source: number): boolean {
        return this.playerService.hasPermission(source, 'staff') || this.playerService.hasPermission(source, 'admin');
    }

    public isAdmin(source: number): boolean {
        return this.playerService.hasPermission(source, 'admin');
    }
}
