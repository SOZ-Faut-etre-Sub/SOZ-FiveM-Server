import classNames from 'classnames';
import { FunctionComponent, useEffect, useState } from 'react';

import {
    getDefaultVehicleCondition,
    VehicleClassFuelStorageMultiplier,
    VehicleCriticalDamageThreshold,
    VehicleHighDamageThreshold,
    VehicleLightState,
    VehicleLockStatus,
    VehicleMidDamageThreshold,
} from '../../../shared/vehicle/vehicle';
import { usePlayer, useVehicle, useVehicleSpeed } from '../../hook/data';
import EnergyIcon from '../../icons/hud/vehicle/energy.svg';
import FuelIcon from '../../icons/hud/vehicle/fuel.svg';
import HighBeamIcon from '../../icons/hud/vehicle/highBeam.svg';
import LowBeamIcon from '../../icons/hud/vehicle/lowBeam.svg';
import MotorIcon from '../../icons/hud/vehicle/motor.svg';
import OilIcon from '../../icons/hud/vehicle/oil.svg';
import SeatbeltIcon from '../../icons/hud/vehicle/seatbelt.svg';
import { GlassMorphismContainer } from '../Styleguide/GlassMorphismContainer';
import { StatusGauge } from './components/StatusGauge';

const LightIndicator: FunctionComponent<{ state: VehicleLightState }> = ({ state }) => {
    let icon = 'off';

    if (state === VehicleLightState.LowBeam) {
        icon = 'low';
    } else if (state === VehicleLightState.HighBeam) {
        icon = 'high';
    }

    return (
        <div className="size-11">
            <GlassMorphismContainer className="flex justify-center items-center size-11">
                <img className="size-6" src={`/public/images/hud/vehicle/light-${icon}.webp`} alt="light" />
            </GlassMorphismContainer>
        </div>
    );
};

const MotorIndicator: FunctionComponent<{ motor: number; fuelType: string }> = ({ motor, fuelType }) => {
    let motorStatus = 'yellow';

    if (motor >= VehicleHighDamageThreshold && motor < VehicleMidDamageThreshold) {
        motorStatus = 'yellow';
    } else if (motor < VehicleHighDamageThreshold && motor >= VehicleCriticalDamageThreshold) {
        motorStatus = 'orange';
    } else if (motor < VehicleCriticalDamageThreshold) {
        motorStatus = 'red';
    }

    return (
        <img
            className={classNames('size-6 transition-all duration-1000', {
                'opacity-5': motor >= VehicleMidDamageThreshold,
                'opacity-100': motor < VehicleMidDamageThreshold,
            })}
            src={`/public/images/hud/vehicle/${fuelType === 'essence' ? 'motor' : 'battery'}-${motorStatus}.webp`}
            alt="motor"
        />
    );
};

const OilIndicator: FunctionComponent<{ oil: number; fuelType: string }> = ({ oil, fuelType }) => {
    let oilStatus = 'yellow';

    if (oil <= 10 && oil > 5) {
        oilStatus = 'yellow';
    } else if (oil <= 5 && oil > 3) {
        oilStatus = 'orange';
    } else if (oil <= 3) {
        oilStatus = 'red';
    }

    return (
        <img
            className={classNames('size-6 transition-all duration-1000', {
                'opacity-5': oil > 10,
                'opacity-100': oil <= 10,
            })}
            src={`/public/images/hud/vehicle/oil-${oilStatus}.webp`}
            alt="oil"
        />
    );
};

const LockIndicator: FunctionComponent<{ state: VehicleLockStatus }> = ({ state }) => {
    return (
        <img
            className={classNames('size-6 transition-all duration-1000', {
                'opacity-0': state === VehicleLockStatus.Locked,
                'opacity-100': state !== VehicleLockStatus.Locked,
            })}
            src="/public/images/hud/vehicle/lock.webp"
            alt="lock"
        />
    );
};

const SeatbeltIndicator: FunctionComponent<{ state: boolean }> = ({ state }) => {
    return (
        <img
            className={classNames('size-6 transition-all duration-1000', {
                'opacity-0': state === null || state === true,
                'opacity-100': state === false,
            })}
            src="/public/images/hud/vehicle/seatbelt.webp"
            alt="seatbelt"
        />
    );
};

const SpeedGauge: FunctionComponent<{ useRpm: boolean }> = ({ useRpm }) => {
    const vehicle = useVehicle();
    const vehicleSpeed = useVehicleSpeed();

    const classes = classNames(
        'absolute inset-0 flex flex-col justify-center items-center font-prompt font-semibold text-center text-white/80 uppercase text-sm tabular-nums [text-shadow:_0px_0px_4px_rgb(0_0_0_/_40%)] h-full w-full'
    );

    let rpm: number;

    if (!useRpm) {
        rpm = vehicleSpeed.speed / 250;
    } else {
        rpm = vehicleSpeed.rpm - 0.2;
    }

    if (rpm < 0) {
        rpm = 0;
    }

    let gear = vehicleSpeed.gear.toString();
    if (vehicleSpeed.gear == 0 && vehicleSpeed.speed > 0) {
        gear = 'R';
    }

    return (
        <div className="relative h-[100px] w-[100px]">
            <GlassMorphismContainer className="h-[100px] w-[100px]">
                <div className="absolute h-full w-full">
                    <svg className="mt-1.5 mx-1.5" viewBox="0 0 114 109" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M110.499 56.6069C110.395 42.4939 104.719 28.9937 94.7067 19.0467C84.6946 9.09963 71.1576 3.5117 57.0443 3.50002C42.931 3.48833 29.3848 9.05383 19.3562 18.9843C9.32767 28.9147 3.62925 42.4055 3.50217 56.5183"
                            stroke="#F3FBFA"
                            strokeOpacity="0.3"
                            strokeWidth="3"
                            strokeLinecap="square"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M110.499 56.6069C110.395 42.4939 104.719 28.9937 94.7067 19.0467C84.6946 9.09963 71.1576 3.5117 57.0443 3.50002C42.931 3.48833 29.3848 9.05383 19.3562 18.9843C9.32767 28.9147 3.62925 42.4055 3.50217 56.5183"
                            stroke="#00E949"
                            strokeWidth="3"
                            strokeLinecap="square"
                            strokeLinejoin="round"
                            strokeDasharray="175"
                            strokeDashoffset={Math.min(-(175 - rpm * 175), 0)}
                        />

                        <path d="M0 57H4H8" stroke="white" strokeWidth="2" />
                        <path d="M57 8V4V-2.98023e-08" stroke="white" strokeWidth="2" />
                        <path d="M91.5332 22.0797L94.1731 19.4398L96.8129 16.8" stroke="white" strokeWidth="2" />
                        <path d="M22.146 22.0797L19.5061 19.4398L16.8663 16.8" stroke="white" strokeWidth="2" />
                        <path d="M106 57H110H114" stroke="white" strokeWidth="2" />
                    </svg>

                    <div className={classes}>
                        <div className="absolute inset-0 flex flex-col justify-center">
                            <span>{gear}</span>
                            <span className="text-white text-3xl leading-5">{vehicleSpeed.speed.toFixed(0)}</span>
                            <span>km/h</span>
                        </div>

                        <div className="absolute inset-x-0 bottom-2.5 flex justify-center items-center gap-2">
                            <MotorIndicator motor={vehicle.engineHealth} fuelType={vehicle.fuelType} />
                            <OilIndicator oil={vehicle.oilLevel} fuelType={vehicle.fuelType} />
                        </div>
                    </div>
                </div>
            </GlassMorphismContainer>
        </div>
    );
};

const FuelGauge: FunctionComponent<{ value: number; fuelType: string; vehCategory: string }> = ({
    value,
    fuelType,
    vehCategory,
}) => {
    const maxFuel = getDefaultVehicleCondition().fuelLevel * (VehicleClassFuelStorageMultiplier[vehCategory] || 1.0);

    let gaugeColor = '#92212B';
    let gaugeBackgroundColor = '#362628';

    if (fuelType === 'electric') {
        gaugeColor = '#00E949';
        gaugeBackgroundColor = '#283525';

        if (value < 60 && value >= 30) {
            gaugeColor = '#F39C12';
            gaugeBackgroundColor = '#283525';
        } else if (value < 30) {
            gaugeColor = '#92212B';
            gaugeBackgroundColor = '#362628';
        }
    }

    return (
        <StatusGauge
            percent={Math.min(value, maxFuel)}
            gaugeColor={gaugeColor}
            gaugeBackgroundColor={gaugeBackgroundColor}
        >
            <img
                className="size-6"
                src={`/public/images/hud/vehicle/${fuelType === 'electric' ? 'battery' : 'motor'}.webp`}
                alt="fuel"
            />
        </StatusGauge>
    );
};

const NosGauge: FunctionComponent<{ value: number }> = ({ value }) => {
    return (
        <div className="relative right-[19px] top-[6px]">
            <svg className={'flex text-blue-500'} width="30" height="50">
                <path
                    d="M16.3586 56.0748C17.1932 52.039 17.6419 47.8612 17.6645 43.5816C17.7481 27.6865 11.9379 13.1353 2.28418 2"
                    fill="none"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeOpacity="0.2"
                />
                <path
                    d="M16.3586 56.0748C17.1932 52.039 17.6419 47.8612 17.6645 43.5816C17.7481 27.6865 11.9379 13.1353 2.28418 2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeOpacity="1.0"
                    strokeDasharray="60"
                    style={{
                        strokeDashoffset: 60 - 60 * value,
                    }}
                />
            </svg>
            <NosIcon className={'relative top-[7px] left-[10px] w-6 h-6 text-gray-400/60'} />
        </div>
    );
};

export const SpeedoMeter: FunctionComponent = () => {
    const vehicle = useVehicle();
    const player = usePlayer();
    const inVehicle = vehicle.seat !== null;
    const [isPilot, setIsPilot] = useState(false);
    const [timeout, initTimeout] = useState<NodeJS.Timeout>(null);

    useEffect(() => {
        clearTimeout(timeout);
        if (vehicle.seat === null) {
            initTimeout(
                setTimeout(() => {
                    setIsPilot(false);
                }, 1000)
            );
        } else {
            setIsPilot(vehicle.seat === -1);
        }
    }, [vehicle.seat]);

    if (player && player.metadata.isdead) {
        return null;
    }

    const classes = classNames(
        'absolute bottom-[3vh] left-[35vw] w-[30vw] flex justify-center gap-1 transition-opacity duration-500',
        {
            'opacity-0': !inVehicle,
            'opacity-100': inVehicle,
        }
    );

    if (!isPilot) {
        return (
            <div className={classes}>
                <div className="flex justify-end items-end pb-[1.25rem]">
                    {vehicle.seatbelt !== null && <SeatbeltIndicator state={vehicle.seatbelt} />}
                </div>
            </div>
        );
    }

    return (
        <div className={classes}>
            <div className="flex justify-end items-end gap-1 pb-2">
                {vehicle.seatbelt !== null && <SeatbeltIndicator state={vehicle.seatbelt} />}
                <LockIndicator state={vehicle.lockStatus} />
            </div>
            <div className="flex justify-center">
                <SpeedGauge useRpm={vehicle.useRpm} />
            </div>
            <div className="flex flex-col justify-end items-center gap-2">
                <LightIndicator state={vehicle.lightState} />
                {vehicle.fuelType !== 'none' && (
                    <FuelGauge
                        value={vehicle.fuelLevel}
                        fuelType={vehicle.fuelType}
                        vehCategory={vehicle.vehCategory}
                    />
                )}
                {vehicle.nosLevel != null && <NosGauge value={vehicle.nosLevel} />}
            </div>
        </div>
    );
};
