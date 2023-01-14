import { Injectable } from '@core/decorators/injectable';

@Injectable()
export class UPWFacilitesService {
    public getTerminalIdentifierForEntity(entity: number): string {
        return exports['soz-upw'].GetTerminalIdentifierForEntity(entity);
    }
}
