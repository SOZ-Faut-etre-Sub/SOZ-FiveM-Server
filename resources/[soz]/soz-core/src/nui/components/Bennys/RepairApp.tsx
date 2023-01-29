import cn from 'classnames';
import { FunctionComponent, useState } from 'react';
import { Link, MemoryRouter, Route, Routes } from 'react-router-dom';

import { RepairAnalyze } from '../../../shared/nui/repair';
import { useBackspace } from '../../hook/control';
import { useNuiEvent, useNuiFocus } from '../../hook/nui';
import { useOutside } from '../../hook/outside';
import IconBattery from '../../icons/repair/battery.svg';
import IconBody from '../../icons/repair/body.svg';
import IconDoor from '../../icons/repair/door.svg';
import IconEngine from '../../icons/repair/engine.svg';
import IconGlass from '../../icons/repair/glass.svg';
import IconTank from '../../icons/repair/tank.svg';
import IconWheel from '../../icons/repair/wheel.svg';

const WHEEL_LABEL = {
    0: 'Avant gauche',
    1: 'Avant droite',
    2: 'Arrière gauche (autre)',
    3: 'Arrière droite (autre)',
    4: 'Arrière gauche',
    5: 'Arrière droite',
};

const WINDOWS_LABEL = {
    0: 'Avant gauche',
    1: 'Avant droite',
    2: 'Arrière gauche',
    3: 'Arrière droite',
    4: 'Arrière gauche (autre)',
    5: 'Arrière droite (autre)',
    6: 'Pare-brise',
    7: 'Lunette arrière',
};

const DOOR_LABELS = {
    0: 'Avant gauche',
    1: 'Avant droite',
    2: 'Arrière gauche',
    3: 'Arrière droite',
    4: 'Capot',
    5: 'Coffre',
};

type PageProps = {
    analyze: RepairAnalyze;
};

const EnginePage: FunctionComponent<PageProps> = ({ analyze }) => {
    let oilLine;
    if (!analyze.isElectric) {
        oilLine = <p>Huile moteur : {analyze.condition.oilLevel.toFixed(2)} / 100</p>;
    }
    return (
        <>
            <h3 className="text-3xl mb-4">Moteur</h3>
            <p>Etat du moteur : {analyze.condition.engineHealth.toFixed(2)} / 1000</p>
            {oilLine}
            <p>Kilométrage : {(analyze.condition.mileage / 1000).toFixed(2)} km</p>
        </>
    );
};

const WheelPage: FunctionComponent<PageProps> = ({ analyze }) => {
    return (
        <>
            <h3 className="text-3xl mb-4">Roues</h3>
            <div className="grid grid-cols-2">
                {Object.keys(analyze.condition.tireHealth).map(wheel => {
                    const index = parseInt(wheel, 10);
                    const health = analyze.condition.tireHealth[index];
                    const burst = analyze.condition.tireBurstState[index];
                    const completelyBurst = analyze.condition.tireBurstCompletely[index];
                    const burstDistance = analyze.condition.tireTemporaryRepairDistance[index];

                    if (health <= 0.01 && !burst && !completelyBurst) {
                        return null;
                    }

                    return (
                        <div className="my-4" key={wheel}>
                            <h5 className="text-xl">{WHEEL_LABEL[wheel]}</h5>
                            <p>Pneu neuf : {burstDistance === undefined ? 'Oui' : 'Non'}</p>
                            {burstDistance !== undefined && (
                                <p>Vie restante : {((10000 - burstDistance) / 1000).toFixed(2)} km</p>
                            )}
                            <p>Crevaison : {burst ? 'Oui' : 'Non'}</p>
                            <p>Sur les jantes : {completelyBurst ? 'Oui' : 'Non'}</p>
                        </div>
                    );
                })}
            </div>
        </>
    );
};

const WindowsDoorPage: FunctionComponent<PageProps> = ({ analyze }) => {
    return (
        <>
            <h3 className="text-3xl mb-4">Vitres</h3>

            <div className="grid grid-cols-2">
                {Object.keys(analyze.condition.windowStatus).map(index => {
                    if (!analyze.windows[index]) {
                        return null;
                    }

                    return (
                        <div className="mt-2" key={index}>
                            <h5 className="text-xl">{WINDOWS_LABEL[index]}</h5>
                            <p>Cassé : {analyze.condition.windowStatus[index] ? 'Oui' : 'Non'}</p>
                        </div>
                    );
                })}
            </div>
        </>
    );
};

const DoorPage: FunctionComponent<PageProps> = ({ analyze }) => {
    return (
        <>
            <h3 className="text-3xl mb-4">Portières</h3>

            <div className="grid grid-cols-2">
                {analyze.doors.map(index => {
                    return (
                        <div className="mt-2" key={index}>
                            <h5 className="text-xl">{DOOR_LABELS[index]}</h5>
                            <p>Cassé : {analyze.condition.doorStatus[index] ? 'Oui' : 'Non'}</p>
                        </div>
                    );
                })}
            </div>
        </>
    );
};

const BodyPage: FunctionComponent<PageProps> = ({ analyze }) => {
    return (
        <>
            <h3 className="text-3xl mb-4">Carrosserie</h3>
            <p>Etat de la carrosserie : {analyze.condition.bodyHealth.toFixed(2)} / 1000</p>
        </>
    );
};

const TankPage: FunctionComponent<PageProps> = ({ analyze }) => {
    if (analyze.isElectric) {
        return (
            <>
                <h3 className="text-3xl mb-4">Batterie</h3>
                <p>Durabilité de la batterie : {analyze.condition.oilLevel.toFixed(2)} / 100</p>
                <p>Charge : {(analyze.condition.fuelLevel * 0.6).toFixed(2)} / 60</p>
            </>
        );
    } else {
        return (
            <>
                <h3 className="text-3xl mb-4">Réservoir</h3>
                <p>Etat du réservoir : {((analyze.condition.tankHealth - 600) * 2.5).toFixed(2)} / 1000</p>;
                <p>Essence : {analyze.condition.fuelLevel.toFixed(2)} / 100</p>
            </>
        );
    }
};

export const RepairApp: FunctionComponent = () => {
    const [repairData, setRepairData] = useState<RepairAnalyze>(null);

    useNuiFocus(repairData !== null, repairData !== null, false);
    useNuiEvent('repair', 'open', setRepairData);
    const refOutside = useOutside({
        click: () => setRepairData(null),
    });

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
        'text-red-500': repairData.condition.engineHealth < 200,
        'text-green-500': repairData.condition.engineHealth > 900,
        'text-yellow-500': repairData.condition.engineHealth >= 200 && repairData.condition.engineHealth <= 900,
    });
    const bodyClass = cn(baseClass, {
        'text-red-500': repairData.condition.bodyHealth < 200,
        'text-green-500': repairData.condition.bodyHealth > 900,
        'text-yellow-500': repairData.condition.bodyHealth >= 200 && repairData.condition.bodyHealth <= 900,
    });
    const tankClass = cn(baseClass, {
        'text-red-500': repairData.condition.tankHealth < 200,
        'text-green-500': repairData.condition.tankHealth > 900,
        'text-yellow-500': repairData.condition.tankHealth >= 200 && repairData.condition.tankHealth <= 900,
    });
    const batteryClass = cn(baseClass, {
        'text-red-500': repairData.condition.oilLevel < 20,
        'text-green-500': repairData.condition.oilLevel > 50,
        'text-yellow-500': repairData.condition.oilLevel >= 20 && repairData.condition.tankHealth <= 50,
    });

    const numberOfBadDoor = Object.values(repairData.condition.doorStatus).filter(status => status).length;
    const numberOfBadDoorGlass = Object.values(repairData.condition.windowStatus).filter((status, index) => {
        return status && repairData.windows[index];
    }).length;
    const numberOfBadWheel = Object.values(repairData.condition.tireBurstState).filter(status => status).length;

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

    let tankLink;
    if (repairData.isElectric) {
        tankLink = (
            <Link
                style={{
                    top: '421px',
                    left: '1014px',
                    width: '100px',
                }}
                className={batteryClass}
                to="/tank"
            >
                <IconBattery className="h-8 w-8 mb-2" />
                <span>Batterie</span>
            </Link>
        );
    } else {
        tankLink = (
            <Link
                style={{
                    top: '421px',
                    left: '1014px',
                    width: '100px',
                }}
                className={tankClass}
                to="/tank"
            >
                <IconTank className="h-8 w-8 mb-2" />
                <span>Réservoir</span>
            </Link>
        );
    }

    return (
        <MemoryRouter>
            <div className="w-full h-full grid h-screen place-items-center">
                <div
                    ref={refOutside}
                    style={{
                        backgroundImage: `url(/public/images/vehicle/repair_app.png)`,
                        height: '720px',
                        width: '1280px',
                    }}
                    className="font-mono font-thin tracking-tight text-lg relative bg-contain bg-no-repeat"
                >
                    <div
                        style={{
                            width: '480px',
                            height: '470px',
                            top: '130px',
                            left: '133px',
                        }}
                        className="p-2 text-white absolute flex flex-col justify-between"
                    >
                        <div>
                            <Routes>
                                <Route path="/" element={<EnginePage analyze={repairData} />} />
                                <Route path="/engine" element={<EnginePage analyze={repairData} />} />
                                <Route path="/wheel" element={<WheelPage analyze={repairData} />} />
                                <Route path="/door" element={<DoorPage analyze={repairData} />} />
                                <Route path="/window" element={<WindowsDoorPage analyze={repairData} />} />
                                <Route path="/body" element={<BodyPage analyze={repairData} />} />
                                <Route path="/tank" element={<TankPage analyze={repairData} />} />
                            </Routes>
                        </div>
                        <a href="#" onClick={() => setRepairData(null)} className="hover:underline text-white text-lg">
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
                            <IconEngine className="h-8 w-8 mt-2" />
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
                            <IconWheel className="h-8 w-8 mb-2" />
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
                            <IconDoor className="h-8 w-8 mt-2" />
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
                            <IconBody className="h-8 w-8 mb-2" />
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
                            <IconGlass className="h-7 w-7 mt-3" />
                        </Link>
                        {tankLink}
                    </div>
                </div>
            </div>
        </MemoryRouter>
    );
};
