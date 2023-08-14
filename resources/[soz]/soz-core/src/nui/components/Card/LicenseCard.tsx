import { FunctionComponent } from 'react';

import { PlayerData, PlayerLicenceType } from '../../../shared/player';

type LicenseCardProps = {
    player: PlayerData;
};

const licenceLabel = (player: PlayerData, type: PlayerLicenceType) => {
    if (player.metadata.licences[type]) {
        return 'Valide';
    }

    return 'Non valide';
};

const licenseLabelPoints = (player: PlayerData, type: PlayerLicenceType) => {
    if (player.metadata.licences[type]) {
        return `${player.metadata.licences[type]} points`;
    }

    return '-';
};

export const LicenseCard: FunctionComponent<LicenseCardProps> = ({ player }) => {
    return (
        <div
            style={{
                backgroundImage: `url(/public/images/identity/licenses.webp)`,
            }}
            className="bg-contain bg-no-repeat aspect-[855/539] h-[340px]"
        >
            <div className="flex h-full">
                <div className="pt-[48%] pl-[7.5%] flex w-[52%]">
                    <div>
                        <h3 className="text-sm leading-none">Nom</h3>
                        <p className="leading-none text-lg">{player.charinfo.lastname.toUpperCase()}</p>
                    </div>
                    <div className="pl-4">
                        <h3 className="text-sm leading-none">Prénom(s)</h3>
                        <p className="leading-none text-lg">{player.charinfo.firstname.toUpperCase()}</p>
                    </div>
                </div>
                <div className="pl-[10%] flex-grow pr-[5%] pt-[12%] pb-[8.5%] h-full flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                        <div className="w-[50%]">
                            <h3 className="text-2xs leading-none uppercase">Voiture</h3>
                            <p className="font-bold mt-[-1%] text-xsm leading-none uppercase">
                                {licenceLabel(player, PlayerLicenceType.Car)}
                            </p>
                        </div>
                        <div className="w-[50%] text-center font-bold text-sm uppercase">
                            {licenseLabelPoints(player, PlayerLicenceType.Car)}
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="w-[50%]">
                            <h3 className="text-2xs leading-none uppercase">Poid-Lourd</h3>
                            <p className="font-bold mt-[-1%] text-xsm leading-none uppercase">
                                {licenceLabel(player, PlayerLicenceType.Truck)}
                            </p>
                        </div>
                        <div className="w-[50%] text-center font-bold text-sm uppercase">
                            {licenseLabelPoints(player, PlayerLicenceType.Truck)}
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="w-[50%]">
                            <h3 className="text-2xs leading-none uppercase">Moto</h3>
                            <p className="font-bold mt-[-1%] text-xsm leading-none uppercase">
                                {licenceLabel(player, PlayerLicenceType.Moto)}
                            </p>
                        </div>
                        <div className="w-[50%] text-center font-bold text-sm uppercase">
                            {licenseLabelPoints(player, PlayerLicenceType.Moto)}
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="w-[50%]">
                            <h3 className="text-2xs leading-none uppercase">Helicoptère</h3>
                            <p className="font-bold mt-[-1%] text-xsm leading-none uppercase">
                                {licenceLabel(player, PlayerLicenceType.Heli)}
                            </p>
                        </div>
                        <div className="w-[50%] text-center font-bold text-sm uppercase">
                            {licenseLabelPoints(player, PlayerLicenceType.Heli)}
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="w-[50%]">
                            <h3 className="text-2xs leading-none uppercase">Bâteau</h3>
                            <p className="font-bold mt-[-1%] text-xsm leading-none uppercase">
                                {licenceLabel(player, PlayerLicenceType.Boat)}
                            </p>
                        </div>
                        <div className="w-[50%] text-center font-bold text-sm uppercase">
                            {licenseLabelPoints(player, PlayerLicenceType.Boat)}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-2xs leading-none uppercase">Port d'arme</h3>
                        <p className="font-bold mt-[-1%] text-xsm leading-none uppercase">
                            {licenceLabel(player, PlayerLicenceType.Weapon)}
                        </p>
                    </div>
                    <div>
                        <h3 className="text-2xs leading-none uppercase">Chasse</h3>
                        <p className="font-bold mt-[-1%] text-xsm leading-none uppercase">
                            {licenceLabel(player, PlayerLicenceType.Hunting)}
                        </p>
                    </div>
                    <div>
                        <h3 className="text-2xs leading-none uppercase">Pêche</h3>
                        <p className="font-bold mt-[-1%] text-xsm leading-none uppercase">
                            {licenceLabel(player, PlayerLicenceType.Fishing)}
                        </p>
                    </div>
                    <div>
                        <h3 className="text-2xs leading-none uppercase">Secouriste</h3>
                        <p className="font-bold text-xsm leading-none uppercase">
                            {licenceLabel(player, PlayerLicenceType.Rescuer)}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
