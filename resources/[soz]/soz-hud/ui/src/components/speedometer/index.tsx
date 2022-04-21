import {FunctionComponent, useCallback, useContext, useEffect} from "react";
import style from "./style.module.css"
import {VehicleDataContext} from "../../context/vehicle";
import {PlayerContext} from "../../context/player";
import {LightIndicator, LockIndicator, MotorIndicator, SeatbeltIndicator} from "./Indicators";
import {FuelGauge, SpeedGauge} from "./Gauges";

const SpeedoMeter: FunctionComponent<any> = () => {
    const {inVehicle, updateInVehicle} = useContext(PlayerContext)
    const {speed, fuel, engine, lock, seatbelt, lightState, updateSpeed, updateFuel, updateEngine, updateLock, updateSeatbelt, updateLightState} = useContext(VehicleDataContext)

    const onMessageReceived = useCallback((event: MessageEvent) => {
        if (event.data.action === 'speedometer') {

            updateInVehicle(event.data.show)
        } else if (event.data.action === 'update_vehicle') {
            if (event.data.speed !== undefined) updateSpeed(event.data.speed)
            if (event.data.fuel !== undefined) updateFuel(event.data.fuel)
            if (event.data.engine !== undefined) updateEngine(event.data.engine)
            if (event.data.lock !== undefined) updateLock(event.data.lock)
            if (event.data.haveSeatbelt !== undefined) updateSeatbelt(event.data.haveSeatbelt)
            if (event.data.haveLight !== undefined) {
                let lightState = 0
                if (event.data.haveLight && event.data.highBeamsOn) {
                    lightState = 2
                } else if (event.data.haveLight && event.data.lightsOn) {
                    lightState = 1
                }
                updateLightState(lightState)
            }
        }
    }, [])

    useEffect(() => {
        window.addEventListener('message', onMessageReceived)

        return () => window.removeEventListener('message', onMessageReceived)
    }, []);

    return (
        <div className={style.speedometer} style={{transition: "opacity .5s", opacity: inVehicle ? 1.0 : 0.0}} >
            <div className={style.leftContainer}>
                <SeatbeltIndicator state={seatbelt} />
                <LockIndicator state={lock} />
            </div>
            <div className={style.centerContainer}>
                <SpeedGauge speed={speed} />
                <FuelGauge value={fuel} />
                <MotorIndicator state={engine} />
            </div>
            <div className={style.rightContainer}>
                <LightIndicator state={lightState} />
            </div>
        </div>
    )
}

export default SpeedoMeter;
