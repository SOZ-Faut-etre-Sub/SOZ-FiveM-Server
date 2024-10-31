import { Inject, Injectable } from '@core/decorators/injectable';

import { Control } from '../shared/input';
import { NuiDispatch } from './nui/nui.dispatch';

type InstructionalText = Array<string | Control>;

@Injectable()
export class InstructionalService {
    @Inject(NuiDispatch)
    private readonly nuiDispatch: NuiDispatch;

    public display(textParts: InstructionalText, forced = false): void {
        const instructional = textParts.map(part =>
            typeof part === 'string' ? part : this.getControlInstructional(part)
        );

        this.nuiDispatch.dispatch('hud', 'SetInstructional', instructional);
        this.nuiDispatch.dispatch('hud', 'ForceDisplayInstructional', forced);
    }

    public clear(): void {
        this.nuiDispatch.dispatch('hud', 'SetInstructional', []);
        this.nuiDispatch.dispatch('hud', 'ForceDisplayInstructional', false);
    }

    protected getControlInstructional(control: Control): string {
        return GetControlInstructionalButton(2, control, true);
    }
}
