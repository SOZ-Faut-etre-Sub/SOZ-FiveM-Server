import classNames from 'classnames';
import { Fragment, FunctionComponent } from 'react';

import { Field } from '../../../shared/field';
import { FoodFields, FoodFieldType } from '../../../shared/job/food';
import { OIL_FIELDS } from '../../../shared/job/oil';
import { AbstractZone } from '../../../shared/polyzone/abstract.zone';
import { PolygonZone } from '../../../shared/polyzone/polygon.zone';
import { RepositoryType } from '../../../shared/repository';
import { usePlayer } from '../../hook/data';
import { useRepository } from '../../hook/repository';
import { useIsInZone } from '../../hook/zone';
import CardinalIcon from '../../icons/field/cardinal.svg';
import CentennialIcon from '../../icons/field/centennial.svg';
import ChasselasIcon from '../../icons/field/chasselas.svg';
import MuscatIcon from '../../icons/field/muscat.svg';
import PetrolIcon from '../../icons/field/petrol.svg';

export const FieldZoneHealthApp: FunctionComponent = () => {
    const player = usePlayer();
    const fields = useRepository(RepositoryType.Field);

    if (!player) {
        return null;
    }

    if (!player.job.onduty) {
        return null;
    }

    return (
        <div className="w-full h-full">
            <div className="absolute flex bottom-24 justify-center items-center w-full">
                {Object.keys(FoodFields).map((foodFieldType, i) => {
                    const field = FoodFields[foodFieldType as FoodFieldType];

                    if (!field) {
                        return null;
                    }

                    return (
                        <Fragment key={`food_${i}`}>
                            {field.zones.map((zone, j) => {
                                const identifier = `food-field-${foodFieldType}-${j}`;
                                const fieldData = fields[identifier];

                                if (!fieldData) {
                                    return null;
                                }

                                if (fieldData.owner !== player.job.id) {
                                    return null;
                                }

                                const polygonZone = new PolygonZone(zone);

                                return (
                                    <FieldZoneHealth
                                        key={`field_zone_${j}`}
                                        field={fieldData}
                                        zone={polygonZone}
                                        type={foodFieldType as FoodFieldType}
                                    />
                                );
                            })}
                        </Fragment>
                    );
                })}
                {Object.keys(OIL_FIELDS).map((oilFieldIdentifier, i) => {
                    const field = OIL_FIELDS[oilFieldIdentifier];

                    if (!field) {
                        return null;
                    }

                    const fieldData = fields[oilFieldIdentifier];

                    if (!fieldData) {
                        return null;
                    }

                    if (fieldData.owner !== player.job.id) {
                        return null;
                    }

                    const polygonZone = new PolygonZone(field.zone);

                    return (
                        <FieldZoneHealth key={`oil_field_zone_${i}`} field={fieldData} zone={polygonZone} type="oil" />
                    );
                })}
            </div>
        </div>
    );
};

type FieldZoneHealthProps = {
    field: Field;
    zone: AbstractZone;
    type: FoodFieldType | 'oil';
};

export const FieldZoneHealth: FunctionComponent<FieldZoneHealthProps> = ({ field, zone, type }) => {
    const isInZone = useIsInZone(zone);

    if (!isInZone) {
        return null;
    }

    const percentage = field.capacity / field.maxCapacity;
    let iconToShow = 0;

    if (percentage > 0.05) {
        iconToShow++;
    }

    if (percentage > 0.2) {
        iconToShow++;
    }

    if (percentage > 0.5) {
        iconToShow++;
    }

    if (percentage > 0.8) {
        iconToShow++;
    }

    return (
        <Fragment>
            {Array.from({ length: 4 }).map((_, i) => {
                const className = classNames('h-10 w-12', {
                    grayscale: i >= iconToShow,
                });

                switch (type) {
                    case 'oil':
                        return <PetrolIcon key={i} className={className} />;
                    case 'cardinal':
                        return <CardinalIcon key={i} className={className} />;
                    case 'muscat':
                        return <MuscatIcon key={i} className={className} />;
                    case 'chasselas':
                        return <ChasselasIcon key={i} className={className} />;
                    case 'centennial':
                        return <CentennialIcon key={i} className={className} />;
                    default:
                        return null;
                }
            })}
        </Fragment>
    );
};
