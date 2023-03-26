import { BlipFactory } from '@public/client/blip';
import { NuiMenu } from '@public/client/nui/nui.menu';
import { OnEvent, OnNuiEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { emitRpc } from '@public/core/rpc';
import { ClientEvent, NuiEvent } from '@public/shared/event';
import { JobType } from '@public/shared/job';
import { UpwFacility, UpwFacilityType } from '@public/shared/job/upw';
import { MenuType } from '@public/shared/nui/menu';
import { RpcEvent } from '@public/shared/rpc';

@Provider()
export class UpwMenuProvider {
    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @Inject(BlipFactory)
    private blipFactory: BlipFactory;

    private displayedBlips = {
        inverter: false,
        jobTerminal: false,
        globalTerminal: false,
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
            this.nuiMenu.openMenu(MenuType.JobUpw, { blips: this.displayedBlips });
        }
    }

    @OnNuiEvent(NuiEvent.UpwDisplayBlips)
    public async onDisplayBlisp({ blip, value }) {
        this.displayedBlips[blip] = value;
        const facilityType: UpwFacilityType = blip == 'jobTerminal' || blip == 'globalTerminal' ? 'terminal' : blip;
        if (facilityType == 'resell') {
            this.blipFactory.hide('job_upw_resell', !value);
            return;
        }
        const facilities = await emitRpc<UpwFacility[]>(RpcEvent.UPW_GET_FACILITIES, facilityType);
        for (const facility of facilities) {
            const data = JSON.parse(facility.data);
            const blip_id = 'job_upw_' + facility.identifier;
            if (
                (blip == 'jobTerminal' && data.scope != 'entreprise') ||
                (blip == 'globalTerminal' && data.scope == 'entreprise')
            ) {
                continue;
            }
            this.blipFactory.hide(blip_id, !value);
        }
    }
}
