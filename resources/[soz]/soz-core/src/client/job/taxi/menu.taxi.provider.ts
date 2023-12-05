import { OnEvent, OnNuiEvent } from '@core/decorators/event';
import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { NuiDispatch } from '@public/client/nui/nui.dispatch';
import { Command } from '@public/core/decorators/command';
import { ClientEvent, NuiEvent } from '@public/shared/event';
import { MenuType } from '@public/shared/nui/menu';

import { NuiMenu } from '../../nui/nui.menu';
import { PlayerService } from '../../player/player.service';
import { TaxiMissionService } from './mission.taxi.service';

@Provider()
export class TaxiMenuProvider {
    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @Inject(TaxiMissionService)
    private taxiMissionService: TaxiMissionService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(NuiDispatch)
    private dispatcher: NuiDispatch;

    @OnEvent(ClientEvent.JOBS_TAXI_OPEN_SOCIETY_MENU)
    public onOpenSocietyMenu() {
        if (this.nuiMenu.getOpened() === MenuType.TaxiJobMenu) {
            this.nuiMenu.closeMenu();
            return;
        }

        this.nuiMenu.openMenu(MenuType.TaxiJobMenu, {
            onDuty: this.playerService.isOnDuty(),
        });
    }

    @OnNuiEvent(NuiEvent.TaxiSetMission)
    public async takeMission(status: boolean) {
        if (status) {
            await this.taxiMissionService.doTaxiNpc();
        } else {
            await this.taxiMissionService.clearMission();
        }
    }

    @OnNuiEvent(NuiEvent.TaxiDisplayHorodateur)
    public async setHorodateurDisplay(status: boolean) {
        this.taxiMissionService.setHorodateurDisplay(status);
    }

    @OnNuiEvent(NuiEvent.TaxiSetHorodateur)
    public async setHorodateurStarted(status: boolean) {
        this.taxiMissionService.setHorodateurStarted(status);
    }

    @Command('Horodateur-Taxi', {
        description: 'Horodateur-Taxi',
        keys: [{ mapper: 'keyboard', key: 'OEM_7' }],
    })
    public onToggleHorodateur() {
        this.taxiMissionService.onToggleHorodateur();
    }

    @Command('Horodateur-Taxi-active', {
        description: 'Horodateur-Taxi-active',
        keys: [{ mapper: 'keyboard', key: 'OEM_5' }],
    })
    public onEnableHorodateur() {
        this.taxiMissionService.onToggleStart();
    }
}
