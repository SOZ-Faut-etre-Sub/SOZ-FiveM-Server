import { FunctionComponent, useCallback, useMemo, useState } from 'react';

import { NuiEvent } from '../../../shared/event/nui';
import { MapPickerLocation } from '../../../shared/picker';
import { fetchNui } from '../../fetch';
import { useNuiEvent, useNuiFocus } from '../../hook/nui';

export const MapPickerApp: FunctionComponent = () => {
    const [locations, setLocations] = useState<MapPickerLocation[]>([]);

    useNuiEvent('picker', 'map', setLocations);

    const nuiFocus = locations.length > 0;

    useNuiFocus(nuiFocus, nuiFocus, false);

    if (!locations.length) {
        return null;
    }

    return (
        <main className="absolute inset-0 h-full w-full overflow-hidden">
            {locations.map(location => (
                <LocationPicker key={location.id} {...location} />
            ))}
        </main>
    );
};

const LocationPicker: FunctionComponent<MapPickerLocation> = ({ id, coords, icon }) => {
    const style = useMemo(() => ({ left: `calc(${coords[0]} * 100vw)`, top: `calc(${coords[1]} * 100vh)` }), [coords]);

    const handleSelectLocation = useCallback(async () => fetchNui(NuiEvent.PickerSelect, id), [id]);

    switch (icon) {
        case 'coffin':
            return (
                <button
                    className="absolute flex justify-center align-center size-8 bg-white/75 border-2 border-white text-2xl rounded-full cursor-pointer z-10"
                    style={style}
                    onClick={handleSelectLocation}
                >
                    ⚰️
                </button>
            );
        case 'location':
            return (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 384 512"
                    className="absolute flex justify-center align-center size-8 fill-[#46EA18] text-2xl rounded-full cursor-pointer z-10"
                    style={style}
                    onClick={handleSelectLocation}
                >
                    <path d="M168.3 499.2C116.1 435 0 279.4 0 192C0 85.96 85.96 0 192 0C298 0 384 85.96 384 192C384 279.4 267 435 215.7 499.2C203.4 514.5 180.6 514.5 168.3 499.2H168.3zM192 256C227.3 256 256 227.3 256 192C256 156.7 227.3 128 192 128C156.7 128 128 156.7 128 192C128 227.3 156.7 256 192 256z" />
                </svg>
            );
    }
};
