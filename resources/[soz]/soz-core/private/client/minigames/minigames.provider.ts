/* eslint-disable @typescript-eslint/no-unused-vars */
import { Inject, Injectable } from '@core/decorators/injectable';
import { NuiMethodMap } from '@public/shared/nui';

@Injectable()
export class MinigameProvider {
    public async runGame<Method extends keyof NuiMethodMap['minigame']>(
        method: Method,
        data?: NuiMethodMap['minigame'][Method]
    ) {
        return false;
    }
}
