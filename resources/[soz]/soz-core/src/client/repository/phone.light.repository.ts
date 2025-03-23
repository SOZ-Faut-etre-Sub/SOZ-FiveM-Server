import { Injectable } from '@core/decorators/injectable';
import { Repository } from '@public/client/repository/repository';
import { RepositoryType } from '@public/shared/repository';

@Injectable(PhoneLightRepository, Repository)
export class PhoneLightRepository extends Repository<RepositoryType.PhoneLight> {
    public type = RepositoryType.PhoneLight;
}
