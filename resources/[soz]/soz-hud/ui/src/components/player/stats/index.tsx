import {FunctionalComponent} from "preact";
import style from './style.module.css'
import {Need} from "../../../types/needs";
import {lazy, Suspense} from "preact/compat";
import FallbackIcon from "../../../assets/fallback";


const PlayerStat: FunctionalComponent<Need> = ({type, value, backgroundPrimary, backgroundSecondary}) => {
    const AppIcon = lazy(() => import(`../../../assets/needs/${type}.tsx`).catch(() => import('../../../assets/fallback')))

    if (((type === 'hunger' || type === 'thirst') && value >= 50) || (value === 0 && type !== 'hunger' && type !== 'thirst')) return null

    return (
        <li class={style.status}>
            <Suspense fallback={<FallbackIcon class={style.icon}/>}>
                <AppIcon class={style.icon}/>
            </Suspense>
            <div class={style.progressbar} style={{background: backgroundPrimary}}>
                <div class={style.progress} style={{background: backgroundSecondary, width: `${value}%`}}/>
            </div>
        </li>
    )
}

export default PlayerStat;
