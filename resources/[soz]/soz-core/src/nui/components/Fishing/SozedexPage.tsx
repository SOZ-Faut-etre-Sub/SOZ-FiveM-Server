import { FunctionComponent } from 'react';

import { Bait, Localisation, PlayerState, Timetable, TSozedexPage, Weather } from './interfaces';

type TFishPage = {
    page: TSozedexPage;
};

const SozedexPage: FunctionComponent<TFishPage> = ({ page }) => {
    const weight = page.fish.weight ? page.fish.weight.toLocaleString('fr-FR') : '';
    const picture = page.fish.picture !== '' ? page.fish.picture : '/public/images/fishing/fish-template-picture.webp';
    const fishId = page.fish.id ? `#${page.fish.id}` : '';
    return (
        <>
            <div className="flex justify-between h-full">
                <div className="w-[57.7%] flex flex-col gap-2">
                    <div className="w-full">
                        <div className="relative -rotate-6">
                            <div className="bg-white p-4 pb-20 drop-shadow-md shadow-black">
                                <img src={picture} alt={`Image du poisson ${page.fish.name}`} />
                            </div>
                            <div className="flex items-center absolute bottom-0">
                                <div className="bg-[url('/public/images/fishing/sticker.webp')] flex justify-around items-center object-contain bg-no-repeat h-20 w-56 pr-4 rotate-3">
                                    <div className="flex items-center text-white">
                                        <img
                                            src="/public/images/fishing/icon-weight.webp"
                                            alt=""
                                            className="invert mr-2"
                                        />
                                        <div className="flex flex-col items-center">
                                            <span className="text-2xl font-semibold">{weight}</span>
                                            <span className="text-xs font-light">kg</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center text-white">
                                        <img
                                            src="/public/images/fishing/icon-fishing-rod.webp"
                                            alt=""
                                            className="invert mr-2"
                                        />
                                        <div className="flex flex-col items-center">
                                            <span className="text-2xl font-semibold">{page.amount}</span>
                                            <span className="text-xs font-light">pêché(s)</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="-ml-2 mb-2 flex flex-col items-center justify-center rounded-full bg-gradient-to-tr from-[#3ad33c] via-[#3ad33c] to-[#51eb55] h-28 w-28">
                                    <img src="/public/images/fishing/icon-trophy.webp" alt="" />
                                    <span className="text-white text-4xl font-medium">{page.fish.size}</span>
                                    <span className="text-white text-base -mt-2">cm</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full h-full flex flex-col bg-black/5 rounded-2xl px-4 pb-2 pt-6 -mt-5">
                        <span className="text-2xl font-light text-center">{fishId}</span>
                        <span className="text-5xl text-center font-delight-sunset">{page.fish.name}</span>
                        <p className="text-justify text-sm mt-2">{page.fish.description}</p>
                    </div>
                    <div className="w-full flex justify-between bg-black/5 rounded-2xl px-4 py-2">
                        <div className="flex items-center">
                            <img src="/public/images/fishing/icon-sell-tag.webp" alt="" className="h-6 mr-1" />
                            <span className="text-sozedex-green text-base font-semibold italic">Vente</span>
                        </div>
                        <div className="flex items-center">
                            <span className="text-2xl font-medium">{page.fish.price}</span>
                            <img src="/public/images/fishing/icon-dollar.webp" alt="" className="h-6" />
                        </div>
                    </div>
                </div>
                <div className="w-[34.7%] flex flex-col justify-center gap-2 text-xl">
                    <div className="bg-black/5 rounded-2xl py-2 font-medium">
                        <div className="flex items-center px-4">
                            <img src="/public/images/fishing/icon-location.webp" alt="" className="h-5 mr-1" />
                            <span className="text-sozedex-green italic font-semibold">Localisation</span>
                        </div>
                        <div className="flex flex-col mt-1">
                            <LocalisationList selectedLocations={page.locations} />
                        </div>
                    </div>
                    <div className="bg-black/5 rounded-2xl py-2 px-4">
                        <div className="flex items-center">
                            <img src="/public/images/fishing/icon-clock.webp" alt="" className="h-5 mr-1" />
                            <span className="text-sozedex-green italic font-semibold">Horaire</span>
                        </div>
                        <div className="grid grid-cols-4 gap-1  mt-1">
                            <TimetableList selectedTimetables={page.hours} />
                        </div>
                    </div>
                    <div className="bg-black/5 rounded-2xl py-2 font-medium">
                        <div className="flex items-center px-4">
                            <img src="/public/images/fishing/icon-weather.webp" alt="" className="h-5 mr-1" />
                            <span className="text-sozedex-green italic font-semibold">Intempéries</span>
                        </div>
                        <div className="flex flex-col mt-1">
                            <WeatherList selectedWeathers={page.weathers} />
                        </div>
                    </div>
                    <div className="bg-black/5 rounded-2xl py-2 font-medium">
                        <div className="flex items-center px-4">
                            <img src="/public/images/fishing/icon-hook.webp" alt="" className="h-5 mr-1" />
                            <span className="text-sozedex-green italic font-semibold">Appât</span>
                        </div>
                        <div className="flex flex-col mt-1">
                            <BaitList selectedBaits={page.baits} />
                        </div>
                    </div>
                    <div className="bg-black/5 rounded-2xl py-2 px-4">
                        <div className="flex items-center">
                            <img src="/public/images/fishing/icon-health.webp" alt="" className="h-5 mr-1" />
                            <span className="text-sozedex-green italic font-semibold">État</span>
                        </div>
                        <div className="flex gap-1 justify-between mt-1">
                            <PlayserStateList selectedPlayerStates={page.playerState} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

const LocalisationList: FunctionComponent<{ selectedLocations: Array<Localisation> }> = ({ selectedLocations }) => {
    return (
        <>
            {(Object.keys(Localisation) as Array<keyof typeof Localisation>).map(key => {
                return (
                    <span
                        key={key}
                        className={`${
                            selectedLocations.includes(Localisation[key]) && 'bg-sozedex-green text-white'
                        } px-4`}
                    >
                        {Localisation[key]}
                    </span>
                );
            })}
        </>
    );
};

const TimetableList: FunctionComponent<{ selectedTimetables: Array<Timetable> }> = ({ selectedTimetables }) => {
    return (
        <>
            {(Object.keys(Timetable) as Array<keyof typeof Timetable>).map(key => {
                const isSelected = selectedTimetables.includes(Timetable[key]);
                const selectedClass = isSelected && 'bg-sozedex-green text-white';
                return (
                    <span key={key} className={`${selectedClass} rounded-lg h-7 flex justify-center items-center`}>
                        <img className={`${isSelected && 'invert'} h-full`} src={Timetable[key]} alt="" />
                    </span>
                );
            })}
        </>
    );
};

const WeatherList: FunctionComponent<{ selectedWeathers: Array<Weather> }> = ({ selectedWeathers }) => {
    return (
        <>
            {(Object.keys(Weather) as Array<keyof typeof Weather>)
                .filter(key => selectedWeathers.includes(Weather[key]))
                .map(key => {
                    return (
                        <span key={key} className="px-4">
                            {Weather[key]}
                        </span>
                    );
                })}
        </>
    );
};

const BaitList: FunctionComponent<{ selectedBaits: Array<Bait> }> = ({ selectedBaits }) => {
    return (
        <>
            {(Object.keys(Bait) as Array<keyof typeof Bait>).map(key => {
                return (
                    <span
                        key={key}
                        className={`${selectedBaits.includes(Bait[key]) && 'bg-sozedex-green text-white'} px-4`}
                    >
                        {Bait[key]}
                    </span>
                );
            })}
        </>
    );
};

const PlayserStateList: FunctionComponent<{ selectedPlayerStates: Array<PlayerState> }> = ({
    selectedPlayerStates,
}) => {
    return (
        <>
            {(Object.keys(PlayerState) as Array<keyof typeof PlayerState>).map(key => {
                const isSelected = selectedPlayerStates.includes(PlayerState[key]);
                const selectedClass = isSelected && 'bg-sozedex-green text-white';
                return (
                    <span key={key} className={`${selectedClass} rounded-lg w-9 h-7 flex justify-center items-center`}>
                        <img className={`${isSelected && 'invert'} h-full`} src={PlayerState[key]} alt="" />
                    </span>
                );
            })}
        </>
    );
};

export default SozedexPage;
