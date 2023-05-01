import classNames from 'classnames';
import { FunctionComponent } from 'react';

import {
    VehicleCriticalDamageThreshold,
    VehicleHighDamageThreshold,
    VehicleLockStatus,
    VehicleMidDamageThreshold,
} from '../../../shared/vehicle/vehicle';
import { useVehicle } from '../../hook/data';
import BatteryIcon from '../../icons/hud/vehicle/battery.svg';
import EnergyIcon from '../../icons/hud/vehicle/energy.svg';
import FuelIcon from '../../icons/hud/vehicle/fuel.svg';
import HighBeamIcon from '../../icons/hud/vehicle/highBeam.svg';
import KeyIcon from '../../icons/hud/vehicle/key.svg';
import LowBeamIcon from '../../icons/hud/vehicle/lowBeam.svg';
import MotorIcon from '../../icons/hud/vehicle/motor.svg';
import OilIcon from '../../icons/hud/vehicle/oil.svg';
import SeatbeltIcon from '../../icons/hud/vehicle/seatbelt.svg';

const LightIndicator: FunctionComponent<{ state: number }> = ({ state }) => {
    return (
        <div className="min-width-3rem text-black/30">
            {state == 1 && <LowBeamIcon className="w-2 h-2" style={{ color: '#2ecc71' }} />}
            {state == 2 && <HighBeamIcon className="w-2 h-2" style={{ color: '#0984e3' }} />}
        </div>
    );
};

const MotorIndicator: FunctionComponent<{ motor: number; oil: number; fuelType: string }> = ({
    motor,
    oil,
    fuelType,
}) => {
    const motorClasses = classNames('w-2 h-2 relative top-[75px] right-[6.5rem] my-1', {
        'opacity-0': motor >= VehicleMidDamageThreshold,
        'opacity-100': motor < VehicleMidDamageThreshold,
        'text-yellow-500': motor >= VehicleHighDamageThreshold && motor < VehicleMidDamageThreshold,
        'text-orange-500': motor < VehicleHighDamageThreshold && motor >= VehicleCriticalDamageThreshold,
        'text-red-500': motor < VehicleCriticalDamageThreshold,
    });

    const oilClasses = classNames('w-2 h-2 relative top-[75px] right-[6.5rem] my-1', {
        'opacity-0': oil > 10,
        'opacity-100': oil <= 10,
        'text-red-500': oil <= 10,
    });

    return (
        <>
            <MotorIcon className={motorClasses} />
            {fuelType === 'electric' && <BatteryIcon className={oilClasses} />}
            {fuelType === 'essence' && <OilIcon className={oilClasses} />}
        </>
    );
};

const LockIndicator: FunctionComponent<{ state: VehicleLockStatus }> = ({ state }) => {
    const classes = classNames('w-2 h-2', {
        'opacity-0': state === VehicleLockStatus.Locked,
        'opacity-100': state !== VehicleLockStatus.Locked,
        'text-red-500': state !== VehicleLockStatus.Locked,
    });

    return <KeyIcon className={classes} />;
};

const SeatbeltIndicator: FunctionComponent<{ state: boolean }> = ({ state }) => {
    const classes = classNames('transition-opacity w-2 h-2 mr-1', {
        'opacity-0': state,
        'opacity-100': !state,
    });

    return <SeatbeltIcon className={classes} />;
};

const SpeedGauge: FunctionComponent<{ speed: number; hasFuel: boolean }> = ({ speed, hasFuel }) => {
    const classes = classNames(
        'absolute flex flex-col text-center top-1 mr-16 w-[100px] text-white/80 text-uppercase',
        {
            'mr-8': hasFuel,
        }
    );

    return (
        <>
            <svg width="100" height="100">
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
                    style={{ strokeDashoffset: -(185 - (speed / 250) * 185) }}
                />
            </svg>
            <div className={classes}>
                <span className="text-white">{speed}</span>
                <span>km/h</span>
            </div>
        </>
    );
};

const FuelGauge: FunctionComponent<{ value: number; fuelType: string }> = ({ value, fuelType }) => {
    const fuelTypeClasses = classNames('relative top-[5px] left-[10px] w-4 h-4');

    return (
        <div className="relative right-[10px] top-[6px]">
            <svg
                className={classNames('flex', {
                    'text-green-500': fuelType === 'essence' && value >= 60,
                    'text-yellow-500': fuelType === 'electric' && value >= 60,
                    'text-orange-500': value < 60 && value >= 30,
                    'text-red-500': value < 30,
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

    const classes = classNames(
        'absolute bottom-[1.2vh] left-[35vw] right-[30vw] flex items-center transition-opacity duration-500',
        {
            'opacity-0': !inVehicle,
            'opacity-100': inVehicle,
        }
    );

    return (
        <div className={classes}>
            <div className="flex justify-end items-end pb-3">
                {vehicle.seatbelt !== null && <SeatbeltIndicator state={vehicle.seatbelt} />}
                <LockIndicator state={vehicle.lockStatus} />
            </div>
            <div className="flex justify-center items-end">
                <SpeedGauge speed={vehicle.speed} hasFuel={vehicle.fuelType !== 'none'} />
                {vehicle.fuelType !== 'none' && <FuelGauge value={vehicle.fuelLevel} fuelType={vehicle.fuelType} />}
                <MotorIndicator motor={vehicle.engineHealth} oil={vehicle.oilLevel} fuelType={vehicle.fuelType} />
            </div>
            <div className="fkex justify-start items-end">
                <LightIndicator state={vehicle.lightState} />
            </div>
        </div>
    );
};
