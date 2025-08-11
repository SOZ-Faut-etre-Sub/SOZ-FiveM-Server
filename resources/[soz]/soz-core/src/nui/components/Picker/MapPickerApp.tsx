import { FunctionComponent, useState } from 'react';

import { MapPickerLocation } from '../../../shared/picker';
import { useNuiEvent, useNuiFocus } from '../../hook/nui';
import { LocationDescription } from './LocationDescription';
import { LocationPicker } from './LocationPicker';

export const MapPickerApp: FunctionComponent = () => {
    const [locations, setLocations] = useState<MapPickerLocation[]>([]);
    const [description, setDescription] = useState<MapPickerLocation['id']>();

    useNuiEvent('picker', 'map', setLocations);

    const nuiFocus = locations.length > 0;

    useNuiFocus(nuiFocus, nuiFocus, false);

    if (!locations.length) {
        return null;
    }

    return (
        <main className="absolute inset-0 h-full w-full overflow-hidden">
            {locations.map(location => (
                <LocationPicker key={location.id} {...location} setDescription={setDescription} />
            ))}

            {description && (
                <LocationDescription
                    id={description}
                    description={locations.find(l => l.id === description)?.description}
                />
            )}
        </main>
    );
};
