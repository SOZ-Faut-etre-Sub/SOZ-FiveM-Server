import { Injectable } from '../../core/decorators/injectable';
import { RepositoryType } from '../../shared/repository';
import { Repository } from './repository';

@Injectable(LeaderboardTetrisRepository, Repository)
export class LeaderboardTetrisRepository extends Repository<RepositoryType.LeaderboardTetris> {
    public type = RepositoryType.LeaderboardTetris;
}
