import { Injectable } from '../core/decorators/injectable';

@Injectable()
export class ClipboardService {
    copy(text: string | any): void {
        const value: string = typeof text === 'string' ? text : JSON.stringify(text);
        SendNUIMessage({
            string: value,
        });
    }
}
