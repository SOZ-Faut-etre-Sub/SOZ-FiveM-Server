import {FunctionalComponent} from "preact";
import {useCallback, useContext, useEffect} from "preact/hooks";
import {GameContext} from "../../../context/game";
import PlayerStat from "../../player/stats";
import {PlayerContext} from "../../../context/player";

const Minimap: FunctionalComponent = () => {
    const {minimap, updateMinimap} = useContext(GameContext)
    const {inVehicle, health, armor} = useContext(PlayerContext)

    const onMessageReceived = useCallback((event: MessageEvent) => {
        if (event.data.action === 'hud_minimap_pos') {
            if (event.data.data !== undefined) updateMinimap(event.data.data)
        }
    }, [])

    useEffect(() => {
        window.addEventListener('message', onMessageReceived)

        return () => window.removeEventListener('message', onMessageReceived)
    }, []);

    return (
        <div style={{
            position: 'absolute',
            display: 'grid',
            gap: '.3rem',
            gridTemplateColumns: 'repeat(2, 1fr)',
            padding: '0 .5rem',
            width: `calc(100vw * ${minimap.width})`,
            top: `calc((100vh * ${minimap.bottomY}) - .5rem )`,
            left: `calc(100vw * ${minimap.leftX})`
        }}>
            {(inVehicle || health - 100 <= 50) && <PlayerStat
                type="health"
                value={health - 100}
                backgroundPrimary={'rgba(60,152,30,0.5)'}
                backgroundSecondary={'linear-gradient(to top, rgba(71,190,32,0.6) 31%, rgba(79,228,30,0.6) 100%)'}
            />}
            {inVehicle && <PlayerStat
                type="armor"
                value={armor}
                backgroundPrimary={'rgba(19,90,128,0.5)'}
                backgroundSecondary={'linear-gradient(to top, rgba(19,120,187,0.6) 31%, rgba(23,147,218,0.6) 100%)'}
            />}
        </div>
    )
}

export default Minimap;
