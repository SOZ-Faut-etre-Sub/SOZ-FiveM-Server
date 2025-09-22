import { Injectable } from '@core/decorators/injectable';
import { HackedCam } from '@public/shared/job/police';
import { RepositoryType } from '@public/shared/repository';

import { Repository } from './repository';

@Injectable(HackedCamRepository, Repository)
export class HackedCamRepository extends Repository<RepositoryType.HackedCam> {
    public type = RepositoryType.HackedCam;

    protected async load(): Promise<Record<string, HackedCam>> {
        return {};
    }

    public async add(cam: HackedCam): Promise<void> {
        await this.set(cam.hash, cam);
    }

    public async remove(hash: number): Promise<void> {
        this.delete(hash);
    }
}
