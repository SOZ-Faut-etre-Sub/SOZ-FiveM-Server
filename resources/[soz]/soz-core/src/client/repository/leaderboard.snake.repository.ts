import { Injectable } from '../../core/decorators/injectable';
import { RepositoryType } from '../../shared/repository';
import { Repository } from './repository';

@Injectable(LeaderboardSnakeRepository, Repository)
export class LeaderboardSnakeRepository extends Repository<RepositoryType.LeaderboardSnake> {
    public type = RepositoryType.LeaderboardSnake;
}
