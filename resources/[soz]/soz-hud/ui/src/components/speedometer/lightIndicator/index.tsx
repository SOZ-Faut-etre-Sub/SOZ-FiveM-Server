import style from "./style.module.css"
import {lightState} from "../../../types/vehicle";
import LowBeamIcon from "../../../assets/vehicle/lowBeam";
import HighBeamIcon from "../../../assets/vehicle/highBeam";
import {FunctionComponent} from "react";

const LightIndicator: FunctionComponent<lightState> = ({state}) => {
    return (
        <div className={style.lights}>
            {state <= 1 ? (
                <LowBeamIcon className={style.icon} style={{color: state === 1 ? '#2ecc71' : ''}} />
            ) : (
                <HighBeamIcon className={style.icon} style={{color: '#0984e3'}}/>
            )}
        </div>
    )
}

export default LightIndicator;
