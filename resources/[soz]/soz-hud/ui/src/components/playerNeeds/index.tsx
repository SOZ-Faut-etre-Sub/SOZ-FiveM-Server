import {FunctionalComponent} from "preact";
import style from './style.module.css'
import {useCallback, useContext, useEffect} from "preact/hooks";
import {PlayerContext} from "../../context/player";
import PlayerStat from "../player/stats";

const PlayerNeeds: FunctionalComponent = () => {
    const {hunger, thirst, updateHealth, updateArmor, updateHunger, updateThirst} = useContext(PlayerContext)

    const onMessageReceived = useCallback((event: MessageEvent) => {
        if (event.data.action === 'update_needs') {
            if (event.data.health !== undefined) updateHealth(event.data.health)
            if (event.data.armor !== undefined) updateArmor(event.data.armor)
            if (event.data.hunger !== undefined) updateHunger(event.data.hunger)
            if (event.data.thirst !== undefined) updateThirst(event.data.thirst)
        }
    }, [])

    useEffect(() => {
        window.addEventListener('message', onMessageReceived)

        return () => window.removeEventListener('message', onMessageReceived)
    }, []);

    return (
        <ul class={style.statues}>
            <PlayerStat
                type="weed"
                value={0}
                backgroundPrimary="rgba(79, 228, 30, 0.4)"
                backgroundSecondary="linear-gradient(to top, rgba(37, 228, 30, 0.6) 31%, rgba(97, 243, 91, 0.6) 100%)"
            />
            <PlayerStat
                type="drunk"
                value={0}
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
