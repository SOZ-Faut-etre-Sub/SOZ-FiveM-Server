import {ComponentProps, FunctionalComponent} from "preact";
import style from "./style.module.css"
import LightIndicator from "./lightIndicator";
import FuelGauge from "./fuelGauge";
import SpeedGauge from "./speedGauge";
import {useCallback, useContext, useEffect} from "preact/hooks";
import {VehicleDataContext} from "../../context/vehicle";
import SeatbeltIcon from "../../assets/vehicle/seatbelt";
import {PlayerContext} from "../../context/player";

const SpeedoMeter: FunctionalComponent<ComponentProps<any>> = () => {
    const {inVehicle, updateInVehicle} = useContext(PlayerContext)
    const {speed, fuel, seatbelt, lightState, updateSpeed, updateFuel, updateSeatbelt, updateLightState} = useContext(VehicleDataContext)

    const onMessageReceived = useCallback((event: MessageEvent) => {
        if (event.data.action === 'speedometer') {

            updateInVehicle(event.data.show)
        } else if (event.data.action === 'update_vehicle') {
            if (event.data.speed !== undefined) updateSpeed(event.data.speed)
            if (event.data.fuel !== undefined) updateFuel(event.data.fuel)
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
        <div class={style.speedometer} style={{transition: "opacity .5s", opacity: inVehicle ? 1.0 : 0.0}} >
            <div class={`${style.seatbelt} ${seatbelt ? style.belt : style.nobelt}`}>
                <SeatbeltIcon class={style.icon}/>
            </div>
            <div class={style.gauge}>
                <SpeedGauge value={speed} />
                <FuelGauge value={fuel} />
            </div>
            <LightIndicator state={lightState} />
        </div>
    )
}

export default SpeedoMeter;
