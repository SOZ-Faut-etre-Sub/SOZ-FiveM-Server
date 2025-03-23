import { Injectable } from '../../core/decorators/injectable';
import { RepositoryType } from '../../shared/repository';
import { Repository } from './repository';

@Injectable(PhoneLightRepository, Repository)
export class PhoneLightRepository extends Repository<RepositoryType.PhoneLight> {
    public type = RepositoryType.PhoneLight;

    private playerPhone: Record<number, number[]> = {};

    protected async load(): Promise<Record<number, [boolean, boolean]>> {
        return {};
    }

    public async createPhone(source: number, phoneNetId: number) {
        await this.removeAllPlayerPhones(source);

        if (!this.playerPhone[source]) {
            this.playerPhone[source] = [];
        }
        this.playerPhone[source].push(phoneNetId);

        this.data[phoneNetId] = [true, false];
    }

    public async setPhoneFlashlight(phoneNetId: number, state: boolean) {
        if (!this.data[phoneNetId]) return;
        this.data[phoneNetId][1] = state;
    }

    public async removePhone(source: number, phoneNetId: number) {
        delete this.data[phoneNetId];

        this.playerPhone[source] = this.playerPhone[source].filter(id => id !== phoneNetId);

        await this.removeAllPlayerPhones(source);
    }

    public async removeAllPlayerPhones(source: number) {
        for (const phoneNetId of this.playerPhone[source] ?? []) {
            await this.removePhone(source, phoneNetId);
        }
        delete this.playerPhone[source];
    }
}
