import { FunctionComponent } from 'react';

import { useVehicle, useVehicleSpeed } from '../../../hook/data';
import { GlassMorphismContainer } from '../../Styleguide/GlassMorphismContainer';
import { MotorIndicator } from './MotorIndicator';
import { OilIndicator } from './OilIndicator';

export const SpeedGauge: FunctionComponent<{ useRpm: boolean }> = ({ useRpm }) => {
    const vehicle = useVehicle();
    const vehicleSpeed = useVehicleSpeed();

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
        <div className="relative size-[125px]">
            <GlassMorphismContainer borderClassName="rounded-full" className="size-[125px]">
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

                    <div className="absolute inset-0 flex flex-col justify-center items-center font-prompt font-semibold text-center text-white/80 uppercase text-sm tabular-nums [text-shadow:_0px_0px_4px_rgb(0_0_0_/_40%)] h-full w-full">
                        <div className="absolute inset-0 flex flex-col justify-center">
                            <span className="text-white text-3xl leading-5">{vehicleSpeed.speed.toFixed(0)}</span>
                            <span>km/h</span>
                        </div>

                        <div className="absolute inset-x-0 bottom-3 flex justify-center items-center gap-2">
                            <MotorIndicator motor={vehicle.engineHealth} fuelType={vehicle.fuelType} />
                            <OilIndicator oil={vehicle.oilLevel} fuelType={vehicle.fuelType} />
                        </div>
                    </div>
                </div>
            </GlassMorphismContainer>
        </div>
    );
};
