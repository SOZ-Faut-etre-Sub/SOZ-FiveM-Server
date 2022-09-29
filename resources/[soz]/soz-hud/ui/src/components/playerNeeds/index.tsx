import style from './style.module.css'
import {useCallback, useContext, useEffect} from "react";
import {PlayerContext} from "../../context/player";
import PlayerStat from "../player/stats";

const PlayerNeeds= () => {
    const {hunger, thirst, alcohol, drug, updateHealth, updateMaxHealth, updateArmor, updateHunger, updateThirst, updateAlcohol, updateDrug} = useContext(PlayerContext)

    const onMessageReceived = useCallback((event: MessageEvent) => {
        if (event.data.action === 'update_needs') {
            if (event.data.health !== undefined) updateHealth(event.data.health)
            if (event.data.maxHealth !== undefined) updateMaxHealth(event.data.maxHealth)
            if (event.data.armor !== undefined) updateArmor(event.data.armor)
            if (event.data.hunger !== undefined) updateHunger(event.data.hunger)
            if (event.data.thirst !== undefined) updateThirst(event.data.thirst)
            if (event.data.alcohol !== undefined) updateAlcohol(event.data.alcohol)
            if (event.data.drug !== undefined) updateDrug(event.data.drug)
        }
    }, [])

    useEffect(() => {
        window.addEventListener('message', onMessageReceived)

        return () => window.removeEventListener('message', onMessageReceived)
    }, []);

    return (
        <ul className={style.statues}>
            <PlayerStat
                type="drug"
                value={drug}
                backgroundPrimary="rgba(79, 228, 30, 0.4)"
                backgroundSecondary="linear-gradient(to top, rgba(37, 228, 30, 0.6) 31%, rgba(97, 243, 91, 0.6) 100%)"
            />
            <PlayerStat
                type="alcohol"
                value={alcohol}
                backgroundPrimary="rgba(228, 30, 53, 0.4)"
                backgroundSecondary="linear-gradient(to top, rgba(228, 30, 47, 0.6) 31%, rgba(241, 78, 92, 0.6) 100%)"
            />
            <PlayerStat
                type="hunger"
                value={hunger}
                backgroundPrimary="rgba(251, 140, 0, 0.4)"
                backgroundSecondary="linear-gradient(to top, rgba(251, 140, 0, 0.6) 31%, rgba(255, 168, 55, 0.6) 100%)"
            />
            <PlayerStat
                type="thirst"
                value={thirst}
                backgroundPrimary="rgba(30, 135, 228, 0.4)"
                backgroundSecondary="linear-gradient(to top, rgba(30, 135, 228, 0.6) 31%, rgba(94, 165, 239, 0.6) 100%)"
            />
        </ul>
    )
}

export default PlayerNeeds;
