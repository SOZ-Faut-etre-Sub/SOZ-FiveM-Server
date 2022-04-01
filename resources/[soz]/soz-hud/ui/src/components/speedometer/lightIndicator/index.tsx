import {FunctionalComponent} from "preact";
import style from "./style.module.css"
import {lightState} from "../../../types/vehicle";
import LowBeamIcon from "../../../assets/vehicle/lowBeam";
import HighBeamIcon from "../../../assets/vehicle/highBeam";

const LightIndicator: FunctionalComponent<lightState> = ({state}) => {
    return (
        <div class={style.lights}>
            {state <= 1 ? (
                <LowBeamIcon class={style.icon} style={{color: state === 1 ? '#2ecc71' : ''}} />
            ) : (
                <HighBeamIcon class={style.icon} style={{color: '#0984e3'}}/>
            )}
        </div>
    )
}

export default LightIndicator;
