import '../DiagnosticPad/index.scss';

import { fetchNui } from '@public/nui/fetch';
import { useBackspace } from '@public/nui/hook/control';
import { useNuiEvent, useNuiFocus } from '@public/nui/hook/nui';
import { useOutside } from '@public/nui/hook/outside';
import { NuiEvent } from '@public/shared/event/nui';
import { healthLevelToLabel, stressLevelToLabel } from '@public/shared/health';
import { bones, DamageConfigs, DamageGravity, DamageServerData, DamagesTypes } from '@public/shared/job/lsmc';
import { PlayerMetadata, PlayerPedHash } from '@public/shared/player';
import { getRandomInt } from '@public/shared/random';
import { format } from 'date-fns';
import { FunctionComponent, useEffect, useState } from 'react';

import { MedicalMetadata } from '../../../../shared/inventory';

type ConstantMedicalProps = {
    medicalDatas: MedicalMetadata;
};

export const ConstantMedicalApp: FunctionComponent<ConstantMedicalProps> = ({ medicalDatas }) => {
    const [heartRate, setHeartRate] = useState(0);
    const [oxygenRate, setOxygenRate] = useState(0);

    const getHeartRate = (stressLevel: number, health: number, dead: boolean) => {
        if (dead) {
            return 0;
        }

        const healthLevel = health - 100;
        let min = 60;
        let max = 80;
        if (stressLevel > 50) {
            min = 100;
            max = 140;
        }

        if (stressLevel > 80) {
            min = 120;
            max = 180;
        }

        if (healthLevel < 20) {
            min = 120;
            max = 130;
        }

        return getRandomInt(min, max);
    };

    useEffect(() => {
        if (medicalDatas && medicalDatas.patient) {
            const interval = setInterval(() => {
                setHeartRate(
                    getHeartRate(
                        medicalDatas.patient.metadata.stress_level,
                        medicalDatas.patient.metadata.health,
                        medicalDatas.patient.metadata.isdead
                    )
                );
                setOxygenRate(medicalDatas.patient.metadata.isdead ? 0 : getRandomInt(96, 99));
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [medicalDatas]);

    return (
        <div className="[box-shadow:_0_1px_10px_rgb(39_169_151)] mt-10 [text-shadow:_0_2px_12px_rgb(39_169_151)] text-[#53e2cf] rounded-lg border-2 border-[#27a997] h-full">
            <h1 className="neuropol mb-2 text-xl text-[#53e2cf] [text-shadow:_0_2px_12px_rgb(39_169_151)] px-2 py-2 rounded-t bg-[#27a99842]">
                Constantes
            </h1>

            <div className="flex flex-row items-center">
                <div className="flex-col w-[20%] ">
                    <img
                        className="w-[3vh] mx-auto"
                        src={`https://soz.zerator.com/static/game/images/lsmc/icons/icon_heartbeat.webp`}
                    ></img>
                </div>
                <div className="flex-col w-[80%]">
                    <div className="uppercase flex flex-row">
                        <div className="flex flex-col">Rythme cardiaque</div>
                        <div className="flex flex-col w-[5%] text-center">:</div>
                        <div className="flex flex-col text-white">{heartRate} BPM</div>
                    </div>
                </div>
            </div>
            <div className="flex flex-row items-center pb-2">
                <div className="flex-col w-[20%] ">
                    <img
                        className="w-[3vh] mx-auto"
                        src={`https://soz.zerator.com/static/game/images/lsmc/icons/icon_o2.webp`}
                    ></img>
                </div>
                <div className="flex-col w-[80%]">
                    <div className="uppercase flex flex-row">
                        <div className="flex flex-col">niveau d'oxygène</div>
                        <div className="flex flex-col w-[5%] text-center">:</div>
                        <div className="flex flex-col text-white">{oxygenRate} %</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const MedicalApp: FunctionComponent = () => {
    const [medicalDatas, setMedicalDatas] = useState<MedicalMetadata>(null);
    const [detail, setDetail] = useState<[DamageServerData, number, number, string, number, number]>(null);

    useNuiFocus(medicalDatas !== null, medicalDatas !== null, false);
    useNuiEvent('medicalDiag', 'open', setMedicalDatas);

    const refOutside = useOutside({
        click: () => {
            setMedicalDatas(null);
            fetchNui(NuiEvent.LsmcMedicalDiagExit);
        },
    });

    useBackspace(() => {
        if (medicalDatas) {
            setMedicalDatas(null);
            fetchNui(NuiEvent.LsmcMedicalDiagExit);
        }
    });

    if (!medicalDatas) {
        return null;
    }

    const patient = medicalDatas.patient;

    const getBodyStatesStyle = (level: number) => {
        if (level < 25) {
            return 'red';
        } else if (level < 50) {
            return 'orange';
        } else if (level < 75) {
            return 'yellow';
        } else if (level >= 100) {
            return 'rgb(34, 197, 94)';
        }
    };

    const getInjuriesStatus = (metadata: PlayerMetadata): [allowed: boolean, label: string] => {
        let state = '';
        const allowed = true;
        if (metadata.injuries_count >= 7) {
            state = 'graves';
        } else if (metadata.injuries_count >= 4) {
            state = 'moyennes';
        } else if (metadata.injuries_count >= 1) {
            state = 'légères';
        } else {
            state = 'aucunes';
        }
        return [allowed, state];
    };

    const getWoundImportance = (damageQty: number, isFatal?: boolean) => {
        if (isFatal) {
            return DamageGravity.Fatal;
        }

        if (damageQty <= 10) {
            return DamageGravity.Small;
        } else if (damageQty <= 30) {
            return DamageGravity.Small;
        } else if (damageQty <= 50) {
            return DamageGravity.Medium;
        } else if (damageQty <= 70) {
            return DamageGravity.Heavy;
        } else {
            return DamageGravity.Heavy;
        }
    };

    function getWoundAnteriority(damageDate: number) {
        const time = Date.now() - damageDate;
        const hours = time / 1000 / 60 / 60;

        if (hours < 1) {
            return "Moins d'une heure";
        } else if (hours < 3) {
            return "Plus d'une heure";
        } else if (hours < 12) {
            return 'Entre 3 et 12 heures';
        } else {
            return 'Plus de 12 heures';
        }
    }

    function getStyleByGravity(damage: number, isFatal: boolean) {
        const woundGravity = getWoundImportance(damage, isFatal);
        return DamageConfigs[woundGravity].color;
    }

    const getIconByDamageType = (damageType: number) => {
        return DamagesTypes[damageType]?.icon || 'unknown';
    };

    function groupByMultiple(array: DamageServerData[]) {
        const groups: DamageServerData[][] = [];
        array
            .sort((a, b) => b.date - a.date)
            .forEach(function (damage) {
                if (groups.length > 0 && groups[groups.length - 1][0].damageType == damage.damageType) {
                    groups[groups.length - 1].push(damage);
                } else {
                    groups.push([damage]);
                }
            });
        return groups;
    }

    const renderDamagedZones = () => {
        const damages = medicalDatas.damages.reduce(function (memo, damage) {
            if (!memo[bones[damage.bone]]) {
                memo[bones[damage.bone]] = [];
            }
            memo[bones[damage.bone]].push(damage);
            return memo;
        }, {});

        const headZone = {
            label: bones[31086],
            zones: damages[bones[31086]],
        };
        // Epaules
        const rightShoulder = {
            label: bones[10706],
            zones: damages[bones[10706]],
        };
        const leftShoulder = {
            label: bones[64729],
            zones: damages[bones[64729]],
        };
        // Bras
        const rightArm = {
            label: bones[40269],
            zones: damages[bones[40269]],
        };
        const leftArm = {
            label: bones[45509],
            zones: damages[bones[45509]],
        };
        // Mains
        const rightHand = {
            label: bones[57005],
            zones: damages[bones[57005]],
        };
        const leftHand = {
            label: bones[18905],
            zones: damages[bones[18905]],
        };

        // Jambes
        const rightLeg = {
            label: bones[36864],
            zones: damages[bones[36864]],
        };
        const leftLeg = {
            label: bones[63931],
            zones: damages[bones[63931]],
        };
        // Pieds
        const rightFoot = {
            label: bones[52301],
            zones: damages[bones[52301]],
        };
        const leftFoot = {
            label: bones[14201],
            zones: damages[bones[14201]],
        };

        return (
            <div className="flex flex-row h-full w-full ">
                <div className="flex flex-col w-[79%] h-full">
                    {/* HEAD */}
                    <div className="flex flex-row pb-[1vh] justify-center h-[15%]">
                        {renderZones(headZone.label, headZone.zones, 'center')}
                    </div>

                    {/* SHOULDERS */}
                    <div className="flex flex-row h-[16%]">
                        <div className="flex flex-col w-[40%] items-end">
                            {renderZones(rightShoulder.label, rightShoulder.zones, 'end')}
                        </div>
                        <div className="flex flex-col w-[20%]"></div>

                        <div className="flex flex-col w-[40%] items-start">
                            {renderZones(leftShoulder.label, leftShoulder.zones, 'start')}
                        </div>
                    </div>

                    {/* ARMS */}
                    <div className="flex flex-row h-[15%]">
                        <div className="flex flex-col w-[33%] items-end">
                            {renderZones(rightArm.label, rightArm.zones, 'end')}
                        </div>
                        <div className="flex flex-col w-[34%]"></div>
                        <div className="flex flex-col w-[34%] items-start">
                            {renderZones(leftArm.label, leftArm.zones, 'start')}
                        </div>
                    </div>

                    {/* HANDS */}
                    <div className="flex flex-row h-[20%]">
                        <div className="flex flex-col w-[32%]">
                            {renderZones(rightHand.label, rightHand.zones, 'end')}
                        </div>
                        <div className="flex flex-col w-[34%]"></div>
                        <div className="flex flex-col w-[33%]">
                            {renderZones(leftHand.label, leftHand.zones, 'start')}
                        </div>
                    </div>

                    {/* LEGS */}
                    <div className="flex flex-row h-[20%]">
                        <div className="flex flex-col w-[35%] items-end">
                            {renderZones(rightLeg.label, rightLeg.zones, 'end')}
                        </div>
                        <div className="flex flex-col w-[28%]"></div>

                        <div className="flex flex-col w-[27%] items-start">
                            {renderZones(leftLeg.label, leftLeg.zones, 'start')}
                        </div>
                    </div>
                    {/* FOOT */}
                    <div className="flex flex-row h-[20%]">
                        <div className="flex flex-col w-[28%] items-end">
                            {renderZones(rightFoot.label, rightFoot.zones, 'end')}
                        </div>
                        <div className="flex flex-col w-[40%]"></div>
                        <div className="flex flex-col w-[30%] items-start">
                            {renderZones(leftFoot.label, leftFoot.zones, 'start')}
                        </div>
                    </div>
                </div>

                {/* OTHER */}
                <div className="flex flex-col h-full w-[20%] justify-center items-end">
                    <div className="bg-[black] h-[65%] bg-opacity-25 p-8 border-[2px] border-[#8bfee19a] rounded-[3vh] [box-shadow:_0_1px_12px_rgb(39_169_151)]">
                        <div className="flex flex-col h-[33%]">
                            {renderZones(bones[0], damages[bones[0]], 'center')}
                        </div>
                        <div className="flex flex-col h-[33%]">
                            {renderZones(bones[24817], damages[bones[24817]], 'center')}
                        </div>
                        <div className="flex flex-col h-[33%]">
                            {renderZones(bones[24816], damages[bones[24816]], 'center')}
                        </div>
                    </div>
                    <div>
                        {detail && renderDetail(detail[0], detail[1], detail[2], detail[3], detail[4], detail[5])}
                    </div>
                </div>
            </div>
        );
    };

    const renderZones = (name: string, damages: DamageServerData[], orientation?: 'center' | 'end' | 'start') => {
        return (
            <div className={`flex flex-col justify-end items-${orientation}`}>
                <div className="flex flex-col justify-center items-start py-[0.5vh] text-[#53e2cf]">
                    <p className="neuropol text-s [text-shadow:_0_1px_12px_rgb(39_169_151)]">{name}</p>
                </div>
                <div
                    className="flex flex-row justify-center min-w-[7vh] min-h-[7vh] rounded-lg [box-shadow:_0_1px_5px_rgb(39_169_151)] bg-opacity-50"
                    style={{
                        borderWidth: '0.2vh',
                        borderColor: damages ? 'transparent' : 'rgba(39,169,151,0.7)',
                        boxShadow: damages ? 'none' : `0 1px 12px rgba(39,169,151,0.7)`,
                        background: damages ? 'none' : '#0000005e',
                    }}
                >
                    {renderDamagedIcons(damages)}
                </div>
            </div>
        );
    };

    const renderDetail = (
        damage: DamageServerData,
        count: number,
        globalDamages: number,
        styleByGravity: string,
        screenX: number,
        screenY: number
    ) => {
        const gravity = getWoundImportance(globalDamages, damage.isFatal);
        const textColor = DamageConfigs[gravity].color;
        const rightPopup = screenX;
        const topPopup = screenY;
        return (
            <div
                className={`flex flex-col absolute min-w-[40vh] max-w-[60vh] rounded-[2vh] bg-[black]
            border-2 p-2 bg-opacity-100 scale-[0.9]`}
                style={{
                    boxShadow: `0 1px 12px ${styleByGravity}`,
                    borderColor: styleByGravity,
                    left: `${rightPopup * 1.1 > window.screen.width * 0.8 ? rightPopup * 0.6 : rightPopup * 1.1}px`,
                    top: `${topPopup}px`,
                }}
            >
                <div
                    className="flex flex-col h-full p-4 opacity-90 [text-shadow:_0_1px_12px_rgb(39_169_151)]"
                    style={{ color: 'white' }}
                >
                    <div className="flex flex-row">
                        <div className="flex flex-col uppercase  w-[75%] justify-center items-start pe-[1rem]">
                            <p className="text-xs mb-[1rem]">
                                Analyse : #
                                {(Math.random() * 10000).toFixed(0) + '-' + patient.charinfo.lastname.toUpperCase()}
                            </p>
                            <p className="text-lg neuropol">
                                {DamagesTypes[damage.damageType]?.label}
                                {count > 1 && ' Multiple'}
                            </p>
                            <div
                                className={`h-[2]  w-full opacity-30 pt-[1px] my-2`}
                                style={{ backgroundColor: textColor, boxShadow: `0 1px 12px ${textColor}` }}
                            ></div>
                            <p
                                className={`text-m neuropol`}
                                style={{
                                    color: textColor,
                                    textShadow: `0 1px 12px ${textColor}`,
                                }}
                            >
                                {DamageConfigs[gravity].label}
                            </p>
                            <div
                                className={`h-[2] w-full opacity-30 pt-[1px] my-2`}
                                style={{ backgroundColor: textColor, boxShadow: `0 1px 12px ${textColor}` }}
                            ></div>{' '}
                            <p className="text-m neuropol">{getWoundAnteriority(damage.date)}</p>
                            {damage.isFatal && (
                                <span className="flex flex-row justify-center items-center">
                                    <p className="text-m neuropol mt-1 mr-4">
                                        Cette blessure a entraînée une perte de conscience.
                                    </p>
                                    <img
                                        className="p-1 w-[3vh] h-[3vh] opacity-80"
                                        src={`https://soz.zerator.com/static/game/images/lsmc/icons/icon_death.webp`}
                                    ></img>
                                </span>
                            )}
                        </div>
                        <div className="flex flex-col justify-start h-[6vh] items-start w-[25%]">
                            {
                                <img
                                    width="80%"
                                    src={`https://soz.zerator.com/static/game/images/lsmc/icons/${getIconByDamageType(damage.damageType)}.webp`}
                                ></img>
                            }
                        </div>
                    </div>
                    <div
                        className={`h-[2] w-full opacity-30 pt-[1px] my-2`}
                        style={{ backgroundColor: textColor, boxShadow: `0 1px 12px ${textColor}` }}
                    ></div>
                </div>
            </div>
        );
    };

    const renderDamagedIcons = (damages: DamageServerData[]) => {
        if (!damages) {
            return (
                <div
                    className="flex justify-center items-center w-full h-full"
                    style={{
                        backgroundImage: `url(https://soz.zerator.com/static/game/images/lsmc/icons/default_zone_background.webp)`,
                        backgroundSize: '85%',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                    }}
                >
                    {/* <img
                        className="w-[90%] h-[90%]"
                        src={`https://soz.zerator.com/static/game/images/lsmc/icons/default_zone_background.webp`}
                    ></img> */}
                </div>
            );
        }
        const sortedDamage = groupByMultiple(damages);
        if (!sortedDamage.find(damages => damages.reduce((prev, cur) => prev + cur.damageQty, 0) > 10)) {
            return (
                <div
                    className={`h-[6vh] w-[6vh] bg-opacity-50 border-solid border-4 rounded-lg flex items-center  justify-center cursor-pointer group m-[0.5vh] p-[1vh] bg-[#0000005e]`}
                    style={{
                        backgroundImage: `url(https://soz.zerator.com/static/game/images/lsmc/icons/default_zone_background.webp)`,
                        backgroundSize: '85%',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        borderWidth: '0.2vh',
                        borderColor: 'rgba(39,169,151,0.7)',
                        boxShadow: `0 1px 12px rgba(39,169,151,0.7)`,
                    }}
                ></div>
            );
        }
        return (
            <div className="flex flex-row items-center min-w-[20%] h-full">
                {sortedDamage &&
                    sortedDamage.map((damages, index) => {
                        if (index > 2) {
                            return null;
                        }
                        const globalDamages = damages.reduce((prev, cur) => prev + cur.damageQty, 0);
                        const fatal = !!damages.find(item => item.isFatal);
                        const styleByGravity = getStyleByGravity(globalDamages, fatal);
                        if (globalDamages < 10) {
                            return null;
                        }
                        return (
                            <div
                                key={index}
                                className={`h-[7vh] w-[7vh] bg-opacity-50 border-solid border-4 rounded-lg flex items-center  justify-center cursor-pointer group m-[0.5vh] p-[1vh] bg-[#0000005e]`}
                                style={{
                                    backgroundImage: `url(https://soz.zerator.com/static/game/images/lsmc/icons/default_zone_background.webp)`,
                                    backgroundSize: '85%',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat',
                                    boxShadow: `0 1px 12px ${styleByGravity}`,
                                    borderColor: styleByGravity,
                                }}
                                onMouseEnter={e => {
                                    setDetail([
                                        {
                                            attackerId: null,
                                            bone: damages[0].bone,
                                            citizenid: damages[0].citizenid,
                                            damageQty: globalDamages,
                                            damageType: damages[0].damageType,
                                            weapon: damages[0].weapon,
                                            isFatal: fatal,
                                            date: damages[0].date,
                                        },
                                        damages.length,
                                        globalDamages,
                                        styleByGravity,
                                        e.currentTarget.offsetLeft,
                                        e.currentTarget.offsetTop,
                                    ]);
                                }}
                                onMouseLeave={() => {
                                    setDetail(null);
                                }}
                            >
                                {fatal && (
                                    <img
                                        className="p-1 fixed mb-[-5vh] w-[3vh] ml-[-5vh] opacity-70"
                                        src={`https://soz.zerator.com/static/game/images/lsmc/icons/icon_death.webp`}
                                    ></img>
                                )}
                                {false && damages.length > 1 && (
                                    <span className="absolute ms-[4rem] mb-[4rem] ">{damages.length}</span>
                                )}
                                {
                                    <img
                                        className="p-1"
                                        src={`https://soz.zerator.com/static/game/images/lsmc/icons/${getIconByDamageType(
                                            damages[0].damageType
                                        )}.webp`}
                                    ></img>
                                }
                            </div>
                        );
                    })}
            </div>
        );
    };

    const renderLeftPatientInformations = () => {
        const healthStateLabel = healthLevelToLabel(patient.metadata.health_level, 0, 100);
        const stressLevelLabel = stressLevelToLabel(patient.metadata.stress_level);
        const maxStaminaLevelLabel = healthLevelToLabel(patient.metadata.max_stamina, 60, 150);
        const strengthLevelLabel = healthLevelToLabel(patient.metadata.strength, 60, 150);
        const [injuriesAllowed, injuriesLabel] = getInjuriesStatus(patient.metadata);
        return (
            <>
                <div className="[box-shadow:_0_1px_10px_rgb(39_169_151)] [text-shadow:_0_1px_15px_rgb(39_169_151)] rounded-lg border-2 uppercase text-[#53e2cf] border-[#27a997] h-full">
                    <h1 className="neuropol mb-2 text-xl text-[#53e2cf] [text-shadow:_0_2px_12px_rgb(39_169_151)] px-2 py-2 rounded-t bg-[#27a99842]">
                        informations
                    </h1>

                    <div className="flex flex-row items-center">
                        <div className="flex-col w-[20%]">
                            <img
                                className="w-[3vh] mx-auto"
                                src={`https://soz.zerator.com/static/game/images/lsmc/icons/icon_informations.webp`}
                            ></img>
                        </div>
                        <div className="flex flex-col w-[80%]">
                            <div className=" flex flex-row">
                                <div className="flex flex-col uppercase">Nom</div>
                                <div className="flex flex-col w-[5%] text-center">:</div>
                                <div className="flex flex-col text-white capitalize">{patient.charinfo.lastname}</div>
                            </div>
                            <div className=" flex flex-row">
                                <div className="flex flex-col uppercase">Prénom</div>
                                <div className="flex flex-col w-[5%] text-center">:</div>
                                <div className="flex flex-col text-white capitalize">{patient.charinfo.firstname}</div>
                            </div>
                        </div>
                    </div>
                    <div className="flex w-full h-[20px] justify-center items-center">
                        <div className="flex h-[1px] w-[80%] bg-[#27a997ab]"></div>
                    </div>
                    <div className="flex flex-row items-center pb-4">
                        <div className="flex-col w-[20%] ">
                            <img
                                className="w-[2vh] mx-auto"
                                src={`https://soz.zerator.com/static/game/images/lsmc/icons/icon_time.webp`}
                            ></img>
                        </div>
                        <div className="flex flex-col w-[80%]">
                            <div className="uppercase flex flex-row">
                                <div className="flex flex-col">Date</div>
                                <div className="flex flex-col w-[5%] text-center">:</div>
                                <div className="flex flex-col text-white">
                                    {format(medicalDatas.date, 'yyyy-MM-dd HH:mm:ss')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <ConstantMedicalApp medicalDatas={medicalDatas} />

                <div className="[box-shadow:_0_1px_10px_rgb(39_169_151)] mt-10 [text-shadow:_0_2px_12px_rgb(39_169_151)] text-[#53e2cf]  rounded-lg border-2 border-[#27a997] h-full">
                    <h1 className="neuropol text-xl text-[#53e2cf] [text-shadow:_0_2px_12px_rgb(39_169_151)] px-2 py-2 rounded-t bg-[#27a99842]">
                        Santé Générale
                    </h1>
                    <div className="flex flex-col py-[1vh]">
                        <div className="flex flex-row">
                            <div className="flex-col w-[20%] ">
                                <img
                                    className="w-[3vh] mx-auto"
                                    src={`https://soz.zerator.com/static/game/images/lsmc/icons/icon_list.webp`}
                                ></img>
                            </div>
                            <div className="flex-col w-[80%]">
                                <div className="flex flex-row items-center pb-2">
                                    <h2 className="mb-2 font-semibold text-2xl uppercase text-[#53e2cf] [text-shadow:_0_2px_12px_rgb(39_169_151)]">
                                        Nutrition
                                    </h2>
                                </div>
                                <div className="uppercase flex flex-row">
                                    <div className="flex flex-col">Glucides</div>
                                    <div className="flex flex-col w-[5%] text-center">:</div>
                                    <div
                                        className="flex flex-col"
                                        style={{
                                            color: getBodyStatesStyle(patient.metadata.sugar),
                                            textShadow: `0 1px 12px ${getBodyStatesStyle(patient.metadata.sugar)}`,
                                        }}
                                    >
                                        {patient.metadata.sugar} %
                                    </div>
                                </div>
                                <div className="uppercase flex flex-row">
                                    <div className="flex flex-col">Lipides</div>
                                    <div className="flex flex-col w-[5%] text-center">:</div>
                                    <div
                                        className="flex flex-col"
                                        style={{
                                            color: getBodyStatesStyle(patient.metadata.lipid),
                                            textShadow: `0 1px 12px ${getBodyStatesStyle(patient.metadata.lipid)}`,
                                        }}
                                    >
                                        {patient.metadata.lipid} %
                                    </div>
                                </div>
                                <div className="uppercase flex flex-row">
                                    <div className="flex flex-col">Protéïnes</div>
                                    <div className="flex flex-col w-[5%] text-center">:</div>
                                    <div
                                        className="flex flex-col"
                                        style={{
                                            color: getBodyStatesStyle(patient.metadata.protein),
                                            textShadow: `0 1px 12px ${getBodyStatesStyle(patient.metadata.protein)}`,
                                        }}
                                    >
                                        {patient.metadata.protein} %
                                    </div>
                                </div>
                                <div className="uppercase flex flex-row">
                                    <div className="flex flex-col">Fibres</div>
                                    <div className="flex flex-col w-[5%] text-center">:</div>
                                    <div
                                        className="flex flex-col"
                                        style={{
                                            color: getBodyStatesStyle(patient.metadata.fiber),
                                            textShadow: `0 1px 12px ${getBodyStatesStyle(patient.metadata.fiber)}`,
                                        }}
                                    >
                                        {patient.metadata.fiber} %
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-row pt-2">
                            <div className="flex-col w-[20%] ">
                                <img
                                    className="w-[3vh] mx-auto"
                                    src={`https://soz.zerator.com/static/game/images/lsmc/icons/icon_physical_condition.webp`}
                                ></img>
                            </div>
                            <div className="flex-col w-[80%]">
                                <div className="flex flex-row items-center pb-2">
                                    <h2 className="mb-2 font-semibold  text-2xl uppercase text-[#53e2cf] [text-shadow:_0_2px_12px_rgb(39_169_151)]">
                                        Condition Physique
                                    </h2>
                                </div>
                                <div className="flex flex-row">
                                    <div className="flex flex-col uppercase">Santé</div>
                                    <div className="flex flex-col w-[5%] text-center">:</div>
                                    <div className="flex flex-col text-white capitalize">{healthStateLabel}</div>
                                </div>
                                <div className="flex flex-row">
                                    <div className="flex flex-col uppercase">Force</div>
                                    <div className="flex flex-col w-[5%] text-center">:</div>
                                    <div className="flex flex-col text-white capitalize">{strengthLevelLabel}</div>
                                </div>
                                <div className="flex flex-row">
                                    <div className="flex flex-col uppercase">Stress</div>
                                    <div className="flex flex-col w-[5%] text-center">:</div>
                                    <div className="flex flex-col text-white capitalize">{stressLevelLabel}</div>
                                </div>
                                <div className="flex flex-row">
                                    <div className="flex flex-col uppercase">Endurance</div>
                                    <div className="flex flex-col w-[5%] text-center">:</div>
                                    <div className="flex flex-col text-white capitalize">{maxStaminaLevelLabel}</div>
                                </div>
                            </div>
                        </div>
                        {injuriesAllowed && (
                            <div className="flex flex-row pt-2">
                                <div className="flex-col w-[20%] ">
                                    <img
                                        className="w-[3.5vh] mx-auto"
                                        src={`https://soz.zerator.com/static/game/images/lsmc/icons/icon_injuries.webp`}
                                    ></img>
                                </div>
                                <div className="flex-col">
                                    <>
                                        <div className="flex flex-row items-center pb-2">
                                            <h2 className="mb-2 font-semibold text-2xl uppercase text-[#53e2cf] [text-shadow:_0_2px_12px_rgb(39_169_151)]">
                                                Blessures
                                            </h2>
                                        </div>
                                        <div>
                                            <p>
                                                ÉTAT DES BLESSURES :{' '}
                                                <span className="text-white capitalize">{injuriesLabel}</span>
                                            </p>
                                        </div>
                                    </>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </>
        );
    };

    return (
        <div className="h-full w-full justify-center items-center flex">
            <div className="z-10 h-[100vh] flex justify-center items-center text-white w-[180vh] scale-[0.8]">
                <div
                    ref={refOutside}
                    style={{
                        backgroundImage: `url(https://soz.zerator.com/static/game/images/lsmc/medical_app_background_${
                            patient.hash === PlayerPedHash.Male ? 'male' : 'female'
                        }.webp)`,
                        width: '100%',
                        height: '100%',
                        backgroundSize: 'cover',
                        paddingInline: '6vh',
                        paddingTop: '6vh',
                    }}
                >
                    <div className="w-full h-full p-5">
                        <div className="h-full flex flex-row ">
                            <div className="flex flex-col relative w-[40vh] justify-center">
                                <div className=" ms-2 mt-2 flex flex-col ">{renderLeftPatientInformations()}</div>
                            </div>
                            <div className="flex flex-col w-full h-full">{renderDamagedZones()}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
