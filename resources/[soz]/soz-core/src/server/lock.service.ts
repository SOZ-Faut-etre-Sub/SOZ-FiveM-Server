import { Injectable } from '../core/decorators/injectable';

@Injectable()
export class LockService {
    private acquiredMap: Map<string, boolean> = new Map<string, boolean>();
    private waitingMap: Map<string, (() => void)[]> = new Map<string, (() => void)[]>();

    public async lock<T>(key: string, action: () => Promise<T>, timeout?: number): Promise<T> {
        await this.acquire(key, timeout);

        try {
            return await action();
        } finally {
            this.release(key);
        }
    }

    public async acquire(key: string, timeout?: number): Promise<void> {
        if (!this.acquiredMap.has(key) || !this.acquiredMap.get(key)) {
            this.acquiredMap.set(key, true);
            return Promise.resolve();
        }

        const acquirePromise = new Promise<void>(resolve => {
            if (this.waitingMap.has(key)) {
                const resolvers = this.waitingMap.get(key);
                resolvers.push(resolve);
                this.waitingMap.set(key, resolvers);
            } else {
                this.waitingMap.set(key, [resolve]);
            }
        });

        if (!timeout) {
            return acquirePromise;
        }

        const timeoutPromise = new Promise<never>((_, reject) => {
            setTimeout(() => {
                reject(new Error('Promise timed out'));
            }, timeout);
        });

        return Promise.race([acquirePromise, timeoutPromise]);
    }

    public release(key: string): void {
        if (!this.acquiredMap.has(key) || !this.acquiredMap.get(key)) {
            throw new Error('Please acquire a lock for ' + key + ' before releasing!!');
        }

        if (this.waitingMap.get(key)?.length > 0) {
            const resolve = this.waitingMap.get(key).shift();
            resolve();
        } else {
            if (this.waitingMap.has(key)) {
                this.waitingMap.delete(key);
            }

            this.acquiredMap.set(key, false);
        }
    }
}
