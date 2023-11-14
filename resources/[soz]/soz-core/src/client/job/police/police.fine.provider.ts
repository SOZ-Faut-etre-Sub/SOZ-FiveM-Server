import { Notifier } from '@public/client/notifier';
import { InputService } from '@public/client/nui/input.service';
import { ProgressService } from '@public/client/progress.service';
import { OnNuiEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { wait } from '@public/core/utils';
import { NuiEvent } from '@public/shared/event';
import { Fine } from '@public/shared/job/police';

@Provider()
export class PoliceFineProvider {
    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(InputService)
    private inputService: InputService;

    @Inject(Notifier)
    private notifier: Notifier;

    @OnNuiEvent(NuiEvent.PolicePreFine)
    public async preFine({ playerServerId, fine }: { playerServerId: number; fine: Fine }) {
        const amount = await this.inputService.askInput({
            maxCharacters: 30,
            title: `Montant de l'amende (${fine.price.min} - ${fine.price.max})`,
            defaultValue: '',
        });
        if (!amount || isNaN(Number(amount)) || Number(amount) < fine.price.min || Number(amount) > fine.price.max) {
            this.notifier.error('Montant invalide');
            return;
        }
        const completed = await this.playLicenceAnimation("Rédaction de l'amende");
        if (!completed) {
            return;
        }
        //TODO AURELIEN: Change to ServerEvent when server will be refacto
        TriggerServerEvent('banking:server:sendInvoice', playerServerId, fine.label, amount, 'fine');
    }

    @OnNuiEvent(NuiEvent.PolicePreCustomFine)
    public async preCustomFine({ playerServerId }: { playerServerId: number }) {
        const title = await this.inputService.askInput({
            maxCharacters: 200,
            title: "Titre de l'amende",
            defaultValue: '',
        });
        if (!title) {
            this.notifier.error('Titre invalide');
            return;
        }
        await wait(100);
        const amount = await this.inputService.askInput({
            maxCharacters: 30,
            title: "Montant de l'amende",
            defaultValue: '',
        });
        if (!amount || isNaN(Number(amount))) {
            this.notifier.error('Montant invalide');
            return;
        }
        const completed = await this.playLicenceAnimation("Rédaction de l'amende");
        if (!completed) {
            return;
        }
        //TODO AURELIEN: Change to ServerEvent when server will be refacto
        TriggerServerEvent('banking:server:sendInvoice', playerServerId, title, amount, 'fine');
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
