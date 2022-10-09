import { FunctionComponent, useState } from 'react';

import { healthLevelToLabel, LabelStrategy, stressLevelToLabel } from '../../../shared/health';
import { PlayerData } from '../../../shared/player';
import { useNuiEvent } from '../../hook/nui';

export const HealthBookApp: FunctionComponent = () => {
    const [playerData, setPlayerData] = useState<PlayerData | null>(null);
    const [hideUi, setHideUi] = useState<null | NodeJS.Timeout>(null);

    useNuiEvent('health_book', 'ShowHealthBook', player => {
        setPlayerData(player);

        if (hideUi) {
            clearTimeout(hideUi);
        }

        const hide = () => {
            setPlayerData(null);
        };

        setHideUi(setTimeout(hide, 10000));
    });

    useNuiEvent('health_book', 'HideHealthBook', () => {
        setPlayerData(null);
    });

    if (!playerData) {
        return null;
    }

    return (
        <div
            style={{
                backgroundImage: `url(/public/images/health/health_book.png)`,
            }}
            className="bg-contain bg-no-repeat w-[555px] h-[350px] absolute top-5 right-7"
        >
            <div className="flex mt-[108px] ml-8 uppercase">
                <div className="w-[169px]">{playerData.charinfo.lastname}</div>
                <div>{playerData.charinfo.firstname}</div>
            </div>
            <p className="mt-[6px] ml-[260px] uppercase italic font-bold">
                {healthLevelToLabel(playerData.metadata.health_book_health_level, 0, 100)}
            </p>
            <div className="flex justify-items-start w-full mt-2 pl-8 pr-8">
                <div className="grid grid-cols-2">
                    <ul className="list-inside list-disc text-lime-700 font-medium">
                        <li>
                            <span className="text-black">Glucides</span>
                        </li>
                        <li>
                            <span className="text-black">Fibres</span>
                        </li>
                        <li>
                            <span className="text-black">Lipides</span>
                        </li>
                        <li>
                            <span className="text-black">Proteines</span>
                        </li>
                    </ul>
                    <ul className="text-lime-700 ml-2 italic capitalize">
                        <li>{healthLevelToLabel(playerData.metadata.health_book_sugar, 0, 25)}</li>
                        <li>{healthLevelToLabel(playerData.metadata.health_book_fiber, 0, 25)}</li>
                        <li>{healthLevelToLabel(playerData.metadata.health_book_lipid, 0, 25)}</li>
                        <li>{healthLevelToLabel(playerData.metadata.health_book_protein, 0, 25)}</li>
                    </ul>
                </div>
                <div className="grid grid-cols-2">
                    <ul className="list-inside list-disc text-lime-700 font-medium">
                        <li>
                            <span className="text-black">Endurance</span>
                        </li>
                        <li>
                            <span className="text-black">Force</span>
                        </li>
                        <li>
                            <span className="text-black">Stress</span>
                        </li>
                    </ul>
                    <ul className="text-lime-700 ml-2 italic capitalize">
                        <li>{healthLevelToLabel(playerData.metadata.health_book_max_stamina, 60, 150)}</li>
                        <li>{healthLevelToLabel(playerData.metadata.health_book_strength, 60, 150)}</li>
                        <li>{stressLevelToLabel(playerData.metadata.health_book_stress_level)}</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};
