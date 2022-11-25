import LowBeamIcon from "../../assets/vehicle/lowBeam";
import HighBeamIcon from "../../assets/vehicle/highBeam";
import MotorIcon from "../../assets/vehicle/motor";
import KeyIcon from "../../assets/vehicle/key";
import SeatbeltIcon from "../../assets/vehicle/seatbelt";
import style from "./style.module.css"
import cn from "classnames";
import OilIcon from '../../assets/vehicle/oil';

function LightIndicator(props: {state: number}) {
    return (
        <div className={style.lights}>
            {props.state == 1 && <LowBeamIcon className={style.icon} style={{color: '#2ecc71'}} />}
            {props.state == 2 && <HighBeamIcon className={style.icon} style={{color: '#0984e3'}}/>}
        </div>
    )
}

function MotorIndicator(props: {motor: number, oil: number}) {
    return (
        <>
            <MotorIcon className={cn(style.icon, style.motor, {
                [style.hidden]: props.motor >= 700,
                [style.yellow]: props.motor > 400 && props.motor < 700,
                [style.orange]: props.motor < 400 && props.motor >= 101,
                [style.red]: props.motor < 101,
            })} />
            <OilIcon className={cn(style.icon, style.motor, {
                [style.hidden]: props.oil > 10,
                [style.red]: props.oil <= 10,
            })} />
        </>
    )
}

function LockIndicator(props: {state: boolean}) {
    return (
        <KeyIcon className={cn(style.icon, {
            [style.hidden]: props.state,
            [style.red]: !props.state,
        })} style={{marginRight: '.5rem'}} />
    )
}

function SeatbeltIndicator(props: {state: boolean}) {
    return (
        <SeatbeltIcon className={cn(style.icon, style.nobelt, {
            [style.hidden]: props.state,
        })} style={{marginRight: '.3rem'}} />
    )
}

export {LightIndicator, MotorIndicator, LockIndicator, SeatbeltIndicator};
