import { animated, useSpring } from '@react-spring/web';
import { FunctionComponent, useEffect, useState } from 'react';

import { useMinimap, usePlayer, useVehicle } from '../../hook/data';
import { FuelGauge } from './components/FuelGauge';
import { LightIndicator } from './components/LightIndicator';
import { LockIndicator } from './components/LockIndicator';
import { NosGauge } from './components/NosGauge';
import { SeatbeltIndicator } from './components/SeatbeltIndicator';
import { SpeedGauge } from './components/SpeedGauge';

export const VehicleInterface: FunctionComponent = () => {
    const minimap = useMinimap();

    const vehicle = useVehicle();
    const player = usePlayer();
    const [isPilot, setIsPilot] = useState(false);
    const [timeout, initTimeout] = useState<NodeJS.Timeout>(null);

    const hudShouldBeDisplayed = player && !player.metadata.isdead && vehicle.seat !== null;

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

    const styles = useSpring({
        from: {
            opacity: 0,
            bottom: '-50vh',
        },
        to: {
            opacity: 1,
            bottom: hudShouldBeDisplayed ? `${100 - minimap.bottom * 100}vh` : '-50vh',
        },
    });

    return (
        <animated.div className="absolute inset-x-0 w-full -z-10" style={styles}>
            <div className="relative flex justify-center gap-1 top-12">
                {isPilot ? (
                    <>
                        <div className="flex justify-end items-end gap-1 pb-2 w-10">
                            {vehicle.seatbelt !== null && <SeatbeltIndicator state={vehicle.seatbelt} />}
                            <LockIndicator state={vehicle.lockStatus} />
                        </div>
                        <div className="flex justify-center">
                            <NosGauge />
                            <SpeedGauge useRpm={vehicle.useRpm} />
                        </div>
                        <div className="flex flex-col justify-end items-center gap-2 w-10">
                            <LightIndicator state={vehicle.lightState} />
                            {vehicle.fuelType !== 'none' && (
                                <FuelGauge
                                    value={vehicle.fuelLevel}
                                    fuelType={vehicle.fuelType}
                                    vehCategory={vehicle.vehCategory}
                                />
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex justify-end items-end pb-[1.25rem]">
                        {vehicle.seatbelt !== null && <SeatbeltIndicator state={vehicle.seatbelt} />}
                    </div>
                )}
            </div>
        </animated.div>
    );
};
