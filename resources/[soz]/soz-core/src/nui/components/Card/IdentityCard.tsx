import { FunctionComponent } from 'react';

import { JobLabel } from '../../../shared/job';
import { PlayerData } from '../../../shared/player';
import { Mugshot } from '../Player/Mugshot';

type IdentityCardProps = {
    player: PlayerData;
};

const FORMAT_LOCALIZED: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
};

export const IdentityCard: FunctionComponent<IdentityCardProps> = ({ player }) => {
    return (
        <div
            style={{
                backgroundImage: player.is_validated
                    ? `url(https://soz.zerator.com/static/game/images/identity/identity.webp)`
                    : `url(https://soz.zerator.com/static/game/images/identity/identity_temp.webp)`,
            }}
            className="bg-contain bg-no-repeat aspect-[855/539] h-[340px]"
        >
            <div className="flex h-full">
                <div className="w-[50%] pt-[20%] pl-[10%]">
                    <Mugshot player={player} />
                </div>
                <div className="flex flex-col pt-[14%] pb-[9%] justify-between">
                    <div>
                        <h3 className="text-xs leading-none">Nom</h3>
                        <p className="uppercase leading-none">{player.charinfo.lastname}</p>
                    </div>
                    <div>
                        <h3 className="text-xs leading-none">Prénom(s)</h3>
                        <p className="uppercase leading-none">{player.charinfo.firstname}</p>
                    </div>
                    <div>
                        <h3 className="text-xs leading-none">Sexe</h3>
                        <p className="uppercase leading-none">
                            {player.skin?.Model?.Hash === -1667301416 ? 'Feminin' : 'Masculin'}
                        </p>
                    </div>
                    <div>
                        <h3 className="text-xs leading-none">Profession</h3>
                        <p className="uppercase leading-none">{JobLabel[player.job.id]}</p>
                    </div>
                    <div>
                        <h3 className="text-xs leading-none">Domicile - Adresse</h3>
                        <p className="uppercase leading-none">{player.address ? player.address : '-'}</p>
                    </div>
                    <div>
                        <h3 className="text-xs leading-none">Numéro de téléphone</h3>
                        <p className="uppercase leading-none">{player.charinfo.phone}</p>
                    </div>
                    {!player.is_validated && (
                        <div>
                            <h3 className="text-xs leading-none">Date d'éxpiration</h3>
                            <p className="uppercase leading-none">
                                {new Date(player.created_at + 2 * 7 * 24 * 3600 * 1000).toLocaleDateString(
                                    'fr-FR',
                                    FORMAT_LOCALIZED
                                )}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
