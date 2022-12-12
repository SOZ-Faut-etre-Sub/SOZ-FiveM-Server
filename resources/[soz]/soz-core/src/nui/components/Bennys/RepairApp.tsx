import cn from 'classnames';
import { FunctionComponent, useState } from 'react';
import { GiCarDoor, GiCartwheel, GiCityCar, GiCrackedGlass, GiJerrycan } from 'react-icons/gi';
import { TbEngine } from 'react-icons/tb';
import { Link, MemoryRouter, Route, Routes } from 'react-router-dom';

import { VehicleCondition } from '../../../shared/vehicle/vehicle';
import { useBackspace } from '../../hook/control';
import { useNuiEvent, useNuiFocus } from '../../hook/nui';

type PageProps = {
    condition: VehicleCondition;
};

const EnginePage: FunctionComponent<PageProps> = ({ condition }) => {
    return (
        <>
            <h3 className="text-xl mb-4">Moteur</h3>
            <p>Etat du moteur : {condition.engineHealth.toFixed(2)} / 1000</p>
        </>
    );
};

const WheelPage: FunctionComponent<PageProps> = ({ condition }) => {
    return (
        <>
            <h3>Roues</h3>
            <p>Etat du moteur : {condition.engineHealth} / 1000</p>
        </>
    );
};

const WindowsDoorPage: FunctionComponent<PageProps> = ({ condition }) => {
    return (
        <>
            <h3>Vitres</h3>
            <p>Etat du moteur : {condition.engineHealth} / 1000</p>
        </>
    );
};

const DoorPage: FunctionComponent<PageProps> = ({ condition }) => {
    return (
        <>
            <h3>Portières</h3>
            <p>Etat du moteur : {condition.engineHealth} / 1000</p>
        </>
    );
};

const BodyPage: FunctionComponent<PageProps> = ({ condition }) => {
    return (
        <>
            <h3>Carrosserie</h3>
            <p>Etat du moteur : {condition.engineHealth} / 1000</p>
        </>
    );
};

const TankPage: FunctionComponent<PageProps> = ({ condition }) => {
    return (
        <>
            <h3>Réservoir</h3>
            <p>Etat du moteur : {condition.engineHealth} / 1000</p>
        </>
    );
};

export const RepairApp: FunctionComponent = () => {
    const [repairData, setRepairData] = useState<VehicleCondition>(null);

    useNuiFocus(repairData !== null, repairData !== null, false);
    useNuiEvent('repair', 'open', setRepairData);

    useBackspace(() => {
        if (repairData) {
            setRepairData(null);
        }
    });

    if (!repairData) {
        return null;
    }

    const baseClass = 'absolute flex flex-col items-center';
    const engineClass = cn(baseClass, {
        'text-red-500': repairData.engineHealth < 200,
        'text-green-500': repairData.engineHealth > 900,
        'text-yellow-500': repairData.engineHealth >= 200 && repairData.engineHealth <= 900,
    });
    const bodyClass = cn(baseClass, {
        'text-red-500': repairData.bodyHealth < 200,
        'text-green-500': repairData.bodyHealth > 900,
        'text-yellow-500': repairData.bodyHealth >= 200 && repairData.bodyHealth <= 900,
    });
    const tankClass = cn(baseClass, {
        'text-red-500': repairData.tankHealth < 200,
        'text-green-500': repairData.tankHealth > 900,
        'text-yellow-500': repairData.tankHealth >= 200 && repairData.tankHealth <= 900,
    });

    const numberOfBadDoor = Object.values(repairData.doorStatus).filter(status => status).length;
    const numberOfBadDoorGlass = Object.values(repairData.windowStatus).filter(status => status).length;
    const numberOfBadWheel = Object.values(repairData.tireBurstState).filter(status => status).length;

    const doorClass = cn(baseClass, {
        'text-red-500': numberOfBadDoor > 2,
        'text-green-500': numberOfBadDoor === 0,
        'text-yellow-500': numberOfBadDoor > 0 && numberOfBadDoor <= 2,
    });

    const doorWindowClass = cn(baseClass, {
        'text-red-500': numberOfBadDoorGlass > 2,
        'text-green-500': numberOfBadDoorGlass === 0,
        'text-yellow-500': numberOfBadDoorGlass > 0 && numberOfBadDoorGlass <= 2,
    });

    const wheelClass = cn(baseClass, {
        'text-red-500': numberOfBadWheel > 2,
        'text-green-500': numberOfBadWheel === 0,
        'text-yellow-500': numberOfBadWheel > 0 && numberOfBadWheel <= 2,
    });

    return (
        <MemoryRouter>
            <div className="w-full h-full grid h-screen place-items-center">
                <div
                    style={{
                        backgroundImage: `url(/public/images/vehicle/repair_app.png)`,
                        height: '720px',
                        width: '1280px',
                    }}
                    className="relative bg-contain bg-no-repeat"
                >
                    <div
                        style={{
                            width: '480px',
                            height: '470px',
                            top: '130px',
                            left: '133px',
                        }}
                        className="text-white absolute flex flex-col justify-between"
                    >
                        <div>
                            <Routes>
                                <Route path="/engine" element={<EnginePage condition={repairData} />} />
                                <Route path="/wheel" element={<WheelPage condition={repairData} />} />
                                <Route path="/door" element={<DoorPage condition={repairData} />} />
                                <Route path="/window" element={<WindowsDoorPage condition={repairData} />} />
                                <Route path="/body" element={<BodyPage condition={repairData} />} />
                                <Route path="/tank" element={<TankPage condition={repairData} />} />
                            </Routes>
                        </div>
                        <a href="#" onClick={() => setRepairData(null)} className="text-white text-lg">
                            Quitter
                        </a>
                    </div>
                    <div>
                        <Link
                            style={{
                                top: '247px',
                                left: '659px',
                                width: '100px',
                            }}
                            className={engineClass}
                            to="/engine"
                        >
                            <span>Moteur</span>
                            <TbEngine className="h-8 w-8 mt-2" />
                        </Link>
                        <Link
                            style={{
                                top: '482px',
                                left: '721px',
                                width: '100px',
                            }}
                            className={wheelClass}
                            to="/wheel"
                        >
                            <GiCartwheel className="h-8 w-8 mb-2" />
                            <span>Roues</span>
                        </Link>
                        <Link
                            style={{
                                top: '173px',
                                left: '814px',
                                width: '100px',
                            }}
                            className={doorClass}
                            to="/door"
                        >
                            <span>Portières</span>
                            <GiCarDoor className="h-8 w-8 mt-2" />
                        </Link>
                        <Link
                            style={{
                                top: '491px',
                                left: '901px',
                                width: '100px',
                            }}
                            className={bodyClass}
                            to="/body"
                        >
                            <GiCityCar className="h-8 w-8 mb-2" />
                            <span>Carrosserie</span>
                        </Link>
                        <Link
                            style={{
                                top: '173px',
                                left: '1000px',
                                width: '100px',
                            }}
                            className={doorWindowClass}
                            to="/window"
                        >
                            <span>Vitres</span>
                            <GiCrackedGlass className="h-7 w-7 mt-3" />
                        </Link>
                        <Link
                            style={{
                                top: '421px',
                                left: '1014px',
                                width: '100px',
                            }}
                            className={tankClass}
                            to="/tank"
                        >
                            <GiJerrycan className="h-8 w-8 mb-2" />
                            <span>Réservoir</span>
                        </Link>
                    </div>
                </div>
            </div>
        </MemoryRouter>
    );
};
