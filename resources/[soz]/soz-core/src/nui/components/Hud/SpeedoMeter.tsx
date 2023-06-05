import classNames from 'classnames';
import { FunctionComponent, useEffect, useState } from 'react';

import {
    VehicleCriticalDamageThreshold,
    VehicleHighDamageThreshold,
    VehicleLightState,
    VehicleLockStatus,
    VehicleMidDamageThreshold,
} from '../../../shared/vehicle/vehicle';
import { useVehicle, useVehicleSpeed } from '../../hook/data';
import BatteryIcon from '../../icons/hud/vehicle/battery.svg';
import EnergyIcon from '../../icons/hud/vehicle/energy.svg';
import FuelIcon from '../../icons/hud/vehicle/fuel.svg';
import HighBeamIcon from '../../icons/hud/vehicle/highBeam.svg';
import KeyIcon from '../../icons/hud/vehicle/key.svg';
import LowBeamIcon from '../../icons/hud/vehicle/lowBeam.svg';
import MotorIcon from '../../icons/hud/vehicle/motor.svg';
import OilIcon from '../../icons/hud/vehicle/oil.svg';
import SeatbeltIcon from '../../icons/hud/vehicle/seatbelt.svg';

const LightIndicator: FunctionComponent<{ state: VehicleLightState }> = ({ state }) => {
    return (
        <div className="min-w-[18px] text-black-200">
            {state == VehicleLightState.Off && <LowBeamIcon className="w-[1.5rem] h-[1.5rem] opacity-0" />}
            {state == VehicleLightState.LowBeam && (
                <LowBeamIcon className="w-[1.5rem] h-[1.5rem]" style={{ color: '#2ecc71' }} />
            )}
            {state == VehicleLightState.HighBeam && (
                <HighBeamIcon className="w-[1.5rem] h-[1.5rem]" style={{ color: '#0984e3' }} />
            )}
        </div>
    );
};

const MotorIndicator: FunctionComponent<{ motor: number; oil: number; fuelType: string }> = ({
    motor,
    oil,
    fuelType,
}) => {
    const motorClasses = classNames(
        'transition-all w-[1.5rem] h-[1.5rem] relative top-[75px] right-[6.5rem] my-[0.25rem]',
        {
            'opacity-0': motor >= VehicleMidDamageThreshold,
            'opacity-100': motor < VehicleMidDamageThreshold,
            'text-yellow-300': motor >= VehicleHighDamageThreshold && motor < VehicleMidDamageThreshold,
            'text-orange-500': motor < VehicleHighDamageThreshold && motor >= VehicleCriticalDamageThreshold,
            'text-red-500': motor < VehicleCriticalDamageThreshold,
        }
    );

    const oilClasses = classNames(
        'transition-all w-[1.5rem] h-[1.5rem] relative top-[75px] right-[6.5rem] my-[0.25rem]',
        {
            'opacity-0': oil > 10,
            'opacity-100': oil <= 10,
            'text-red-500': oil <= 10,
        }
    );

    return (
        <>
            <MotorIcon className={motorClasses} />
            {fuelType === 'electric' && <BatteryIcon className={oilClasses} />}
            {fuelType === 'essence' && <OilIcon className={oilClasses} />}
        </>
    );
};

const LockIndicator: FunctionComponent<{ state: VehicleLockStatus }> = ({ state }) => {
    const classes = classNames('transition-all duration-1000 w-[1.5rem] h-[1.5rem] mr-[0.5rem]', {
        'opacity-0': state === VehicleLockStatus.Locked,
        'opacity-100': state !== VehicleLockStatus.Locked,
        'text-green-500': state === VehicleLockStatus.Locked,
        'text-red-500': state !== VehicleLockStatus.Locked,
    });

    return <KeyIcon className={classes} />;
};

const SeatbeltIndicator: FunctionComponent<{ state: boolean }> = ({ state }) => {
    const classes = classNames('transition-all duration-1000 w-[1.5rem] h-[1.5rem] mr-1', {
        'opacity-0': state === null || state === true,
        'opacity-100': state === false,
        'text-green-500': state === true,
        'text-red-500': state === false,
    });

    return <SeatbeltIcon className={classes} />;
};

const SpeedGauge: FunctionComponent<{ hasFuel: boolean; useRpm: boolean }> = ({ hasFuel, useRpm }) => {
    const vehicleSpeed = useVehicleSpeed();

    const classes = classNames(
        'font-prompt font-semibold flex absolute flex-col text-center top-[1.5rem] mr-[80px] w-[100px] text-white/80 uppercase text-sm tabular-nums',
        {
            'mr-[50px]': !hasFuel,
        }
    );

    let rpm;

    if (!useRpm) {
        rpm = vehicleSpeed.speed / 250;
    } else {
        rpm = vehicleSpeed.rpm - 0.2;
    }

    if (rpm < 0) {
        rpm = 0;
    }

    return (
        <div className="w-[100px] h-[100px] relative">
            <svg className="h-full w-full">
                <path
                    d="M97 47.8863C97 22.544 75.7335 2 49.5 2C23.2665 2 2 22.544 2 47.8863C2 60.389 7.17623 71.7238 15.5714 80"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeOpacity="0.2"
                />
                <path
                    d="M97 47.8863C97 22.544 75.7335 2 49.5 2C23.2665 2 2 22.544 2 47.8863C2 60.389 7.17623 71.7238 15.5714 80"
                    className="progress"
                    fill="none"
                    stroke="#00E949"
                    strokeWidth="4"
                    strokeOpacity="1.0"
                    strokeDasharray="185"
                    style={{
                        strokeDashoffset: Math.min(-(185 - rpm * 185), 0),
                    }}
                />
            </svg>
            <div className={classes}>
                <span className="text-white text-3xl">{vehicleSpeed.speed.toFixed(0)}</span>
                <span>km/h</span>
            </div>
        </div>
    );
};

const FuelGauge: FunctionComponent<{ value: number; fuelType: string }> = ({ value, fuelType }) => {
    const fuelTypeClasses = classNames('relative top-[7px] left-[10px] w-4 h-4 text-gray-400/60');

    return (
        <div className="relative right-[10px] top-[6px]">
            <svg
                className={classNames('flex', {
                    'text-green-500': fuelType === 'essence',
                    'text-yellow-300': fuelType === 'electric' && value >= 60,
                    'text-orange-500': fuelType === 'electric' && value < 60 && value >= 30,
                    'text-red-500': fuelType === 'electric' && value < 30,
                })}
                width="30"
                height="50"
            >
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
                    style={{ strokeDashoffset: 60 - (value / 100) * 60 }}
                />
            </svg>
            {fuelType === 'electric' && <EnergyIcon className={fuelTypeClasses} />}
            {fuelType === 'essence' && <FuelIcon className={fuelTypeClasses} />}
        </div>
    );
};

export const SpeedoMeter: FunctionComponent = () => {
    const vehicle = useVehicle();
    const inVehicle = vehicle.seat !== null;
    const [isPilot, setIsPilot] = useState(false);

    useEffect(() => {
        if (vehicle.seat === null) {
            setTimeout(() => {
                setIsPilot(false);
            }, 1000);
        } else {
            setIsPilot(vehicle.seat === -1);
        }
    }, [vehicle.seat]);

    const classes = classNames(
        'absolute bottom-[1.2vh] left-[35vw] w-[30vw] flex justify-center transition-opacity duration-500',
        {
            'opacity-0': !inVehicle,
            'opacity-100': inVehicle,
        }
    );

    const classesLight = classNames('flex justify-start items-end pb-[1.15rem]', {
        'pl-[40px]': vehicle.fuelType === 'none',
    });

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
            <div className="flex justify-end items-end pb-[1.25rem]">
                {vehicle.seatbelt !== null && <SeatbeltIndicator state={vehicle.seatbelt} />}
                <LockIndicator state={vehicle.lockStatus} />
            </div>
            <div className="flex justify-center mr-[-50px]">
                <SpeedGauge hasFuel={vehicle.fuelType !== 'none'} useRpm={vehicle.useRpm} />
                {vehicle.fuelType !== 'none' && <FuelGauge value={vehicle.fuelLevel} fuelType={vehicle.fuelType} />}
                <MotorIndicator motor={vehicle.engineHealth} oil={vehicle.oilLevel} fuelType={vehicle.fuelType} />
            </div>
            <div className={classesLight}>
                <LightIndicator state={vehicle.lightState} />
            </div>
        </div>
    );
};
