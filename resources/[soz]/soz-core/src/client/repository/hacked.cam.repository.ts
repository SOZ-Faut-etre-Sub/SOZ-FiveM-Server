import { Injectable } from '../../core/decorators/injectable';
import { RepositoryType } from '../../shared/repository';
import { Repository } from './repository';

@Injectable(HackedCamRepository, Repository)
export class HackedCamRepository extends Repository<RepositoryType.HackedCam> {
    public type = RepositoryType.HackedCam;
}
