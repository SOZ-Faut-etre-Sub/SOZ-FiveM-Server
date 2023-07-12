import { fetchNui } from '@public/nui/fetch';
import { useBackspace } from '@public/nui/hook/control';
import { useNuiEvent, useNuiFocus } from '@public/nui/hook/nui';
import { NuiEvent } from '@public/shared/event';
import { FunctionComponent, useEffect, useState } from 'react';

import { Bait, Localisation, PlayerState, Timetable, TSozedexPage, Weather } from './interfaces';
import SozedexPage from './SozedexPage';

const fishPage: TSozedexPage = {
    fish: {
        id: 1,
        name: 'Clebsouille',
        picture: '/public/images/fishing/fish-1.webp',
        weight: 2.4,
        size: 64,
        description:
            "Doté d'un flair redoutable, spécifiquement envers les uniformes, le passe-temps favori de la Clebsouille consiste à aboyer sans réelle revendication. La légende raconte qu'elle fait son nid à partir de sous-vêtements d'agents des forces de l'ordre, nid pouvant d'ailleurs accueillir jusqu'à une vingtaine d'individu. Sa fertilité aurait pour origine l'amour des daronnes.",
        price: 146,
    },
    amount: 12,
    locations: [Localisation.river],
    hours: [Timetable.afternoon, Timetable.evening, Timetable.morning, Timetable.night],
    weathers: [Weather.foggy],
    baits: [Bait.juicy],
    playerState: [PlayerState.drugged],
};

const fishPageEmpty: TSozedexPage = {
    fish: {
        id: null,
        name: '',
        picture: '',
        weight: null,
        size: null,
        description: '',
        price: null,
    },
    amount: null,
    locations: [],
    hours: [],
    weathers: [],
    baits: [],
    playerState: [],
};

export const SozedexApp: FunctionComponent = () => {
    const [showSozedex, setShowSozedex] = useState<Array<string>>(null);
    useNuiFocus(showSozedex !== null, showSozedex !== null, false);

    useNuiEvent('sozedex', 'ShowSozedex', completion => {
        setShowSozedex(completion);
    });

    useBackspace(() => {
        setShowSozedex(null);
    });

    useEffect(() => {
        if (!showSozedex) {
            fetchNui(NuiEvent.SozedexClosed);
        }
    }, [showSozedex]);

    if (showSozedex === null) {
        return null;
    }

    return (
        <>
            <div className="h-full w-full max-w-screen-md flex justify-center">
                <div className="relative">
                    <img
                        className="absolute -z-10 bottom-12 left-28"
                        src="/public/images/fishing/bass.webp"
                        alt="Logo de truite"
                    />
                    <img
                        className="absolute -z-10 top-32 left-40"
                        src="/public/images/fishing/hook.webp"
                        alt="Image d'hameçon"
                    />
                    <div className="absolute -z-10 top-10 left-96 flex justify-center items-center h-16 w-72 bg-[#d7c8b5] rounded-tl-xl rounded-tr-xl text-3xl font-bold">
                        <span>Page 16/64</span>
                    </div>
                    <img className="w-full" src="/public/images/fishing/book.webp" alt="Livre de fond" />
                    <img
                        className="absolute -z-10 top-48 right-36"
                        src="/public/images/fishing/fishing-net.webp"
                        alt="Image de filet de pêche"
                    />
                </div>
                <div className="absolute flex justify-center top-[10%] w-[62.5%] gap-[3%] h-[82%] mx-auto">
                    <div className="w-1/2">
                        <SozedexPage page={fishPage} />
                    </div>
                    <div className="w-1/2">
                        <SozedexPage page={fishPageEmpty} />
                    </div>
                </div>
            </div>
        </>
    );
};
