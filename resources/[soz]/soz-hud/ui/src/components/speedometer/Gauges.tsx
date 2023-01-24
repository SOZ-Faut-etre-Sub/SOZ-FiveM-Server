import style from "./style.module.css"
import FuelIcon from "../../assets/vehicle/fuel";
import EnergyIcon from "@assets/vehicle/energy";

function SpeedGauge(props: {speed: number, hasFuel: boolean}) {
    return (
        <>
            <svg width="100" height="100">
                <path
                    d="M97 47.8863C97 22.544 75.7335 2 49.5 2C23.2665 2 2 22.544 2 47.8863C2 60.389 7.17623 71.7238 15.5714 80"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeOpacity="0.2"/>
                <path
                    d="M97 47.8863C97 22.544 75.7335 2 49.5 2C23.2665 2 2 22.544 2 47.8863C2 60.389 7.17623 71.7238 15.5714 80"
                    className="progress"
                    fill="none"
                    stroke="#00E949"
                    strokeWidth="4"
                    strokeOpacity="1.0"
                    strokeDasharray="185"
                    style={{strokeDashoffset: -(185 - (props.speed/250*185))}}/>
            </svg>
            <div className={[style.speedDisplay, props.hasFuel ? "" : style.noFuel].join(' ')}>
                <span className={style.speedText}>{props.speed}</span>
                <span>km/h</span>
            </div>
        </>
    )
}

function FuelGauge(props: {value: number, fuelType: string}) {
    var color = "#00E949" // classical green
    var icon = <FuelIcon className={style.fuelIcon} width="15" height="15" style={{color: '#ffffff50'}} />
    if (props.fuelType === 'electric') {
        var icon = <EnergyIcon className={style.fuelIcon} width="15" height="15" style={{color: '#ffffff50'}} />
        color = "#FFFF33"; // yellow
        if (props.value < 60) {
            color = "#FFA500"; //orange
        }
        if (props.value < 30) {
            color = "#FF0000"; //red
        }
    }
    return (
        <div className={style.fuelGauge}>
            <svg className={style.fuelSvg} width="30" height="50">
                <path
                    d="M16.3586 56.0748C17.1932 52.039 17.6419 47.8612 17.6645 43.5816C17.7481 27.6865 11.9379 13.1353 2.28418 2"
                    fill="none"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeOpacity="0.2"/>
                <path
                    d="M16.3586 56.0748C17.1932 52.039 17.6419 47.8612 17.6645 43.5816C17.7481 27.6865 11.9379 13.1353 2.28418 2"
                    fill="none"
                    stroke={color}
                    strokeWidth="3"
                    strokeOpacity="1.0"
                    strokeDasharray="60"
                    style={{strokeDashoffset: 60 - (props.value/100*60)}}/>
            </svg>
            {icon}
        </div>
    )
}

export {SpeedGauge, FuelGauge};
