import {FunctionalComponent} from "preact";
import style from "./style.module.css"
import {speedGauge} from "../../../types/vehicle";

const SpeedGauge: FunctionalComponent<speedGauge> = ({value}) => {
    const speed = value > 200 ? 200 : value

    return (
        <>
            <svg class={style.gauge} width="100" height="100">
                <path
                    d="M92 47.0775C92 22.1819 71.8528 2 47 2C22.1472 2 2 22.1819 2 47.0775C2 61.1597 8.44627 73.7337 18.5441 82"
                    fill="none"
                    stroke="white"
                    stroke-width="4"
                    stroke-opacity="0.2"/>
                <path
                    d="M92 47.0775C92 22.1819 71.8528 2 47 2C22.1472 2 2 22.1819 2 47.0775C2 61.1597 8.44627 73.7337 18.5441 82"
                    className="progress"
                    fill="none"
                    stroke="url(#gradient)"
                    stroke-width="4"
                    stroke-opacity="0.6"
                    stroke-dasharray="200"
                    style={{strokeDashoffset: -(200 - speed)}}/>
                <defs>
                    <linearGradient id="gradient">
                        <stop offset="10%" stop-color={"rgba(255, 255, 255, .8)"}/>
                        <stop offset="100%" stop-color={"#23740c"}/>
                    </linearGradient>
                </defs>
            </svg>
            <div class={style.display}>
                <span class={style.speed}>{value}</span>
                <span>km/h</span>
            </div>
        </>
    )
}

export default SpeedGauge;
