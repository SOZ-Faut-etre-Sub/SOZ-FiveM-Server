import { Injectable } from '@public/core/decorators/injectable';

@Injectable()
export class GangService {
    public isHC() {
        return false;
    }
}
