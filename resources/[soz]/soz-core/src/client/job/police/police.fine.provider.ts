import { Notifier } from '@public/client/notifier';
import { InputService } from '@public/client/nui/input.service';
import { OnNuiEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { NuiEvent } from '@public/shared/event';
import { Fine } from '@public/shared/job/police';

import { emitRpcTimeout } from '../../../core/rpc';
import { NotEmptyStringValidator, PositiveNumberValidator } from '../../../shared/nui/input';
import { RpcServerEvent } from '../../../shared/rpc';

@Provider()
export class PoliceFineProvider {
    @Inject(InputService)
    private inputService: InputService;

    @Inject(Notifier)
    private notifier: Notifier;

    @OnNuiEvent(NuiEvent.PolicePreFine)
    public async preFine({ playerServerId, fine }: { playerServerId: number; fine: Fine }) {
        const amount = await this.inputService.askInput({
            maxCharacters: 30,
            title: `Montant de l'amende (${fine.price.min} - ${fine.price.max})`,
        });

        if (!amount || isNaN(Number(amount)) || Number(amount) < fine.price.min || Number(amount) > fine.price.max) {
            this.notifier.error('Montant invalide');
            return;
        }

        await emitRpcTimeout(
            RpcServerEvent.BANK_CREATE_INVOICE,
            10000,
            playerServerId,
            'personal',
            fine.label,
            Number(amount),
            'fine'
        );
    }

    @OnNuiEvent(NuiEvent.PolicePreCustomFine)
    public async preCustomFine({ playerServerId }: { playerServerId: number }) {
        const title = await this.inputService.askInput(
            {
                maxCharacters: 200,
                title: "Titre de l'amende",
            },
            NotEmptyStringValidator
        );

        if (!title) {
            return;
        }

        const amount = await this.inputService.askInput(
            {
                maxCharacters: 30,
                title: "Montant de l'amende",
            },
            PositiveNumberValidator
        );

        if (!amount) {
            return;
        }

        await emitRpcTimeout(
            RpcServerEvent.BANK_CREATE_INVOICE,
            10000,
            playerServerId,
            'personal',
            title,
            Number(amount),
            'fine'
        );
    }
}
