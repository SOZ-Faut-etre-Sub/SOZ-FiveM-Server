import { Injectable } from '../core/decorators/injectable';

@Injectable()
export class LockService {
    private locks = new Set<string>();

    public async lock(key: string, action: () => void): Promise<boolean> {
        if (this.locks.has(key)) {
            return true;
        }

        this.locks.add(key);

        try {
            await action();
        } finally {
            this.locks.delete(key);
        }

        return false;
    }
}
