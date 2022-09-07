import { Injectable } from '../core/decorators/injectable';

@Injectable()
export class TalkService {
    isRadioOpen(): boolean {
        return exports['soz-talk'].isRadioOpen();
    }

    setRadioOpen(status: boolean): void {
        exports['soz-talk'].setRadioOpen(status);
    }
}
