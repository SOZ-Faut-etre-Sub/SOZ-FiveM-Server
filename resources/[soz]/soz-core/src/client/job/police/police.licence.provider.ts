import { ProgressService } from '@public/client/progress.service';
import { OnNuiEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { NuiEvent, ServerEvent } from '@public/shared/event';

@Provider()
export class PoliceLicenceProvider {
    @Inject(ProgressService)
    private progressService: ProgressService;

    @OnNuiEvent(NuiEvent.PoliceAddLicence)
    public async addLicence({ playerServerId, licence }: { playerServerId: number; licence: string }) {
        const completed = await this.playLicenceAnimation('Enregistrement du permis...');
        if (!completed) {
            return;
        }
        TriggerServerEvent(ServerEvent.POLICE_GIVE_LICENCE, playerServerId, licence);
    }

    @OnNuiEvent(NuiEvent.PoliceRemoveLicence)
    public async removeLicence({ playerServerId, licence }: { playerServerId: number; licence: string }) {
        const completed = await this.playLicenceAnimation('Retrait du permis...');
        if (!completed) {
            return;
        }
        TriggerServerEvent(ServerEvent.POLICE_REMOVE_LICENCE, playerServerId, licence);
    }

    @OnNuiEvent(NuiEvent.PoliceRemovePointsLicence)
    public async removePointsLicence({
        playerServerId,
        licence,
        points,
    }: {
        playerServerId: number;
        licence: string;
        points: number;
    }) {
        const completed = await this.playLicenceAnimation('Retrait de points en cours...');
        if (!completed) {
            return;
        }
        TriggerServerEvent(ServerEvent.POLICE_REMOVE_POINT, playerServerId, licence, points);
    }

    private async playLicenceAnimation(textProgressBar: string): Promise<boolean> {
        const { completed } = await this.progressService.progress(
            'police-add-licence',
            textProgressBar,
            5000,
            {
                dictionary: 'missheistdockssetup1clipboard@base',
                name: 'base',
                options: { repeat: true },
                props: [
                    {
                        model: 'prop_notepad_01',
                        bone: 18905,
                        position: [0.09999999999999432, 0.020000000000003126, 0.04999999999999716],
                        rotation: [10, 0, 0],
                    },
                    {
                        model: 'prop_pencil_01',
                        bone: 58866,
                        position: [0.11000000000001364, -0.020000000000003126, 0.0009999999999998899],
                        rotation: [-120, 0, 0],
                    },
                ],
            },
            {
                disableMovement: false,
                disableCarMovement: true,
                disableMouse: false,
                disableCombat: true,
            }
        );
        return completed;
    }
}
