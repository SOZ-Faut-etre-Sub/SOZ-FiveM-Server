import { Injectable } from '../../../core/decorators/injectable';

@Injectable()
export class LockBinService {
    private lockedBin: string[] = [];

    public isLock(id: string) {
        return this.lockedBin.includes(id);
    }

    public changeLockStatus(id: string, status: boolean) {
        if (status) {
            if (!this.lockedBin.includes(id)) {
                this.lockedBin.push(id);
            }
        } else {
            const index = this.lockedBin.indexOf(id, 0);
            if (index > -1) {
                this.lockedBin.splice(index, 1);
            }
        }
    }
}
