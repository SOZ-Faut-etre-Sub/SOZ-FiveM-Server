import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { FunctionComponent } from 'react';

import { healthLevelToLabel, stressLevelToLabel } from '../../../shared/health';
import { PlayerData } from '../../../shared/player';

type HealthCardProps = {
    player: PlayerData;
};

export const HealthCard: FunctionComponent<HealthCardProps> = ({ player }) => {
    return (
        <div
            style={{
                backgroundImage: `url(https://soz.zerator.com/static/game/images/identity/health_book.webp)`,
            }}
            className="transition bg-cover bg-no-repeat aspect-[855/539] h-[340px]"
        >
            <div className="flex pt-[19.5%] pl-[6%] uppercase">
                <div className="w-[32.5%]">{player.charinfo.lastname}</div>
                <div>{player.charinfo.firstname}</div>
            </div>
            <p className="mt-[1%] ml-[50%] uppercase italic font-bold">
                {healthLevelToLabel(player.metadata.health_book_health_level, 0, 100)}
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
                        <li>{healthLevelToLabel(player.metadata.health_book_sugar, 0, 25)}</li>
                        <li>{healthLevelToLabel(player.metadata.health_book_fiber, 0, 25)}</li>
                        <li>{healthLevelToLabel(player.metadata.health_book_lipid, 0, 25)}</li>
                        <li>{healthLevelToLabel(player.metadata.health_book_protein, 0, 25)}</li>
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
                        <li>{healthLevelToLabel(player.metadata.health_book_max_stamina, 60, 150)}</li>
                        <li>{healthLevelToLabel(player.metadata.health_book_strength, 60, 150)}</li>
                        <li>{stressLevelToLabel(player.metadata.health_book_stress_level)}</li>
                    </ul>
                </div>
            </div>
            <div className="flex justify-items-start w-full mt-2 pl-8 pr-8">
                Mis à jour le
                <span className="text-lime-700 ml-2 italic capitalize">
                    {player.metadata.health_book_update_date
                        ? format(player.metadata.health_book_update_date, 'eeee dd MMMMMM yyyy', { locale: fr })
                        : 'Inconnu'}
                </span>
            </div>
        </div>
    );
};
