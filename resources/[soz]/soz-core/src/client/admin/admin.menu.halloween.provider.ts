import { Inject } from '@public/core/decorators/injectable';

import { OnNuiEvent } from '../../core/decorators/event';
import { Provider } from '../../core/decorators/provider';
import { NuiEvent, ServerEvent } from '../../shared/event';
import { VampireGameRole } from '../../shared/halloween';
import { PositiveNumberValidator } from '../../shared/nui/input';
import { InputService } from '../nui/input.service';
import { NuiMenu } from '../nui/nui.menu';
import { AdminMenuProvider } from './admin.menu.provider';

@Provider()
export class AdminMenuHalloweenProvider {
    @Inject(InputService)
    public inputService: InputService;

    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @Inject(AdminMenuProvider)
    private adminMenuProvider: AdminMenuProvider;

    @OnNuiEvent(NuiEvent.AdminMenuHalloweenLaunchGame)
    async launchGame(): Promise<void> {
        TriggerServerEvent(ServerEvent.ADMIN_HALLOWEEN_START_GAME);
        this.nuiMenu.closeMenu();
    }

    @OnNuiEvent(NuiEvent.AdminMenuHalloweenStopGame)
    async stopGame(): Promise<void> {
        TriggerServerEvent(ServerEvent.ADMIN_HALLOWEEN_STOP_GAME);
        this.nuiMenu.closeMenu();
    }

    @OnNuiEvent(NuiEvent.AdminMenuHalloweenUpdateGameDuration)
    async updateGameDuration(): Promise<void> {
        const amount = await this.inputService.askInput(
            {
                title: 'Durée maximale du jeu en minutes',
            },
            PositiveNumberValidator
        );

        TriggerServerEvent(ServerEvent.ADMIN_HALLOWEEN_UPDATE_GAME_DURATION, amount);
        await this.reloadAdminMenu();
    }

    @OnNuiEvent(NuiEvent.AdminMenuHalloweenForceTransformPlayer)
    async updateStaff(role: VampireGameRole): Promise<void> {
        TriggerServerEvent(ServerEvent.ADMIN_HALLOWEEN_FOCE_TRANSFORM_PLAYER, GetPlayerServerId(PlayerId()), role);
        this.nuiMenu.closeMenu();
    }

    @OnNuiEvent(NuiEvent.AdminMenuHalloweenUpdateGameStaffEnabled)
    async updateGameStaffEnabled({ role, enabled }: { role: string; enabled: boolean }): Promise<void> {
        TriggerServerEvent(ServerEvent.ADMIN_HALLOWEEN_UPDATE_GAME_STAFF_ENABLED, role, enabled);
        await this.reloadAdminMenu();
    }

    @OnNuiEvent(NuiEvent.AdminMenuHalloweenUpdateMoon)
    async updateMoon(value: string): Promise<void> {
        TriggerServerEvent(ServerEvent.ADMIN_HALLOWEEN_MOON_UPDATE, value);
    }

    @OnNuiEvent(NuiEvent.AdminMenuHalloweenUpdateRole)
    async updateRole(role: string): Promise<void> {
        const amount = await this.inputService.askInput(
            {
                title: 'Nombre maximum de joueurs',
            },
            PositiveNumberValidator
        );

        TriggerServerEvent(ServerEvent.ADMIN_HALLOWEEN_UPDATE_ROLE, role, amount);
        await this.reloadAdminMenu();
    }

    @OnNuiEvent(NuiEvent.AdminMenuHalloweenUpdateMortalCollection)
    async updateMortalCollection(collection: string): Promise<void> {
        const amount = await this.inputService.askInput(
            {
                title: 'Nombre maximum de props',
            },
            PositiveNumberValidator
        );

        TriggerServerEvent(ServerEvent.ADMIN_HALLOWEEN_UPDATE_MORTAL_OBJECTIVE_PART1, collection, amount);
        await this.reloadAdminMenu();
    }

    @OnNuiEvent(NuiEvent.AdminMenuHalloweenUpdateObjectivePart2)
    async updateObjectivePart2(objective: string): Promise<void> {
        const amount = await this.inputService.askInput(
            {
                title: 'Nombre de joueurs requis',
            },
            PositiveNumberValidator
        );

        TriggerServerEvent(ServerEvent.ADMIN_HALLOWEEN_UPDATE_MORTAL_OBJECTIVE_PART2, objective, amount);
        await this.reloadAdminMenu();
    }

    @OnNuiEvent(NuiEvent.AdminMenuHalloweenUpdateObjectivePart3)
    async updateObjectivePart3(): Promise<void> {
        const amount = await this.inputService.askInput(
            {
                title: 'Durée maximale de la partie 3 en minutes',
            },
            PositiveNumberValidator
        );

        TriggerServerEvent(ServerEvent.ADMIN_HALLOWEEN_UPDATE_MORTAL_OBJECTIVE_PART3, amount);
        await this.reloadAdminMenu();
    }

    private async reloadAdminMenu() {
        this.nuiMenu.closeMenu();
        await this.adminMenuProvider.openAdminMenu('halloween-vampire-game');
    }
}
