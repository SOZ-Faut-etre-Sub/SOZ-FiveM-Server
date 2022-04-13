import style from './style.module.css'
import {Need} from "../../../types/needs";
import {FunctionComponent, lazy, Suspense} from "react";
import FallbackIcon from "../../../assets/fallback";


const PlayerStat: FunctionComponent<Need> = ({type, value, backgroundPrimary, backgroundSecondary}) => {
    const AppIcon = lazy(() => import(`../../../assets/needs/${type}.tsx`).catch(() => import('../../../assets/fallback')))

    if (((type === 'hunger' || type === 'thirst') && value >= 50) || (value === 0 && type !== 'hunger' && type !== 'thirst')) return null

    return (
        <li className={style.status}>
            <Suspense fallback={<FallbackIcon className={style.icon}/>}>
                <AppIcon className={style.icon}/>
            </Suspense>
            <div className={style.progressbar} style={{background: backgroundPrimary}}>
                <div className={style.progress} style={{background: backgroundSecondary, width: `${value}%`}}/>
            </div>
        </li>
    )
}

export default PlayerStat;
