import { Injectable } from '../../core/decorators/injectable';
import { Apartment, Property } from '../../shared/housing/housing';
import { RepositoryType } from '../../shared/repository';
import { Repository } from './repository';

@Injectable(HousingRepository, Repository)
export class HousingRepository extends Repository<RepositoryType.Housing> {
    public findProperty(propertyId: number): Property | null {
        return this.get().find(property => property.id === propertyId) ?? null;
    }

    public findApartment(propertyId: number, apartmentId: number): Apartment | null {
        const property = this.findProperty(propertyId);

        if (!property) {
            return null;
        }

        return property.apartments.find(apartment => apartment.id === apartmentId) ?? null;
    }
}
