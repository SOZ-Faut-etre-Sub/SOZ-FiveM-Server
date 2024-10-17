import { FunctionComponent, useState } from 'react';

import { NuiEvent } from '../../../shared/event/nui';
import { MapPickerLocation } from '../../../shared/picker';
import { fetchNui } from '../../fetch';
import { useNuiEvent, useNuiFocus } from '../../hook/nui';

export const MapPickerApp: FunctionComponent = () => {
    const [locations, setLocations] = useState<MapPickerLocation[]>([]);

    useNuiEvent('picker', 'map', setLocations);

    const handleSelectLocation = async (id: string) => {
        await fetchNui(NuiEvent.PickerSelect, id);
    };

    const nuiFocus = locations.length > 0;

    useNuiFocus(nuiFocus, nuiFocus, false);

    if (!locations.length) {
        return null;
    }

    return (
        <main className="absolute inset-0 h-full w-full overflow-hidden">
            {locations.map(location => (
                <button
                    key={location.id}
                    className="absolute flex justify-center align-center size-8 bg-white/75 border-2 border-white text-2xl rounded-full cursor-pointer z-10"
                    style={{ left: `calc(${location.coords[0]} * 100vw)`, top: `calc(${location.coords[1]} * 100vh)` }}
                    onClick={() => handleSelectLocation(location.id)}
                >
                    {location.icon === 'coffin' && <>⚰️</>}
                </button>
            ))}
        </main>
    );
};
