import { BlipFactory } from '@public/client/blip';
import { NuiMenu } from '@public/client/nui/nui.menu';
import { UpwChargerRepository } from '@public/client/repository/upw.station.repository';
import { OnEvent, OnNuiEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { emitRpc } from '@public/core/rpc';
import { wait } from '@public/core/utils';
import { Blip } from '@public/shared/blip';
import { ClientEvent, NuiEvent } from '@public/shared/event';
import { JobType } from '@public/shared/job';
import { UpwConfig, UpwFacility, UpwFacilityType } from '@public/shared/job/upw';
import { MenuType } from '@public/shared/nui/menu';
import { getDistance, Vector3 } from '@public/shared/polyzone/vector';
import { RpcServerEvent } from '@public/shared/rpc';

@Provider()
export class UpwMenuProvider {
    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @Inject(BlipFactory)
    private blipFactory: BlipFactory;

    @Inject(UpwChargerRepository)
    private upwChargerRepository: UpwChargerRepository;

    private displayedBlips = {
        inverter: false,
        jobTerminal: false,
        terminal: false,
        plant: false,
        resell: false,
    };

    @OnEvent(ClientEvent.JOB_OPEN_MENU)
    public async toggleJobMenu(job: JobType) {
        if (job != JobType.Upw) {
            return;
        }
        if (this.nuiMenu.getOpened() === MenuType.JobUpw) {
            this.nuiMenu.closeMenu();
        } else {
            this.nuiMenu.openMenu(MenuType.JobUpw, {
                blips: { charger: this.upwChargerRepository.getDisplayLocation(), ...this.displayedBlips },
            });
        }
    }

    @OnNuiEvent(NuiEvent.UpwDisplayBlips)
    public async onDisplayBlip({ type, value }: { type: UpwFacilityType; value: boolean }) {
        if (type == 'charger') {
            this.upwChargerRepository.updateDisplayLocation(value);

            const chargers = this.upwChargerRepository.get();
            if (value) {
                const end = GetGameTimer() + 15000;
                while (GetGameTimer() < end) {
                    for (const charger of Object.values(chargers)) {
                        if (!charger.active) {
                            const pedPosition = GetEntityCoords(PlayerPedId()) as Vector3;
                            const distanceToCharger = getDistance(pedPosition, charger.position);
                            if (distanceToCharger < 100) {
                                DrawLightWithRange(
                                    charger.position[0],
                                    charger.position[1],
                                    charger.position[2] + 0.5,
                                    0,
                                    229,
                                    255,
                                    1.5,
                                    80.0
                                );
                            }
                        }
                    }
                    await wait(0);
                }
            }
            return;
        }

        this.displayedBlips[type] = value;

        if (type == 'resell') {
            this.blipFactory.hide('job_upw_resell', !value);

            return;
        }

        const facilities = await emitRpc<UpwFacility[]>(RpcServerEvent.UPW_GET_FACILITIES, [type]);

        for (const facility of facilities) {
            const blip_id = `job_upw_${facility.identifier}`;
            this.blipFactory.hide(blip_id, !value);
        }
    }

    @OnEvent(ClientEvent.UPW_ADD_FACILITY)
    public onAddFacility(facility: UpwFacility) {
        const blip_id = `job_upw_${facility.identifier}`;
        const blip: Blip = {
            ...UpwConfig.FacilitiesBlip[facility.type],
            position: facility.position || facility.energyZone.center,
        };
        this.blipFactory.create(blip_id, blip, this.displayedBlips[facility.type]);
    }
}
