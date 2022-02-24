import {createContext, FunctionalComponent} from "preact";
import {useCallback, useMemo, useState} from "preact/hooks";
import {Minimap} from "../types/game";

export const GameContext = createContext({
    minimap: {} as Minimap,
    updateMinimap: (m: Minimap) => {}
})

const GameProvider: FunctionalComponent = ({children}) => {
    const [minimap, setMinimap] = useState<Minimap>({
        X: 0.08091666683321,
        Y: 0.88549252311906,
        bottomY: 0.97361377796573,
        height: 0.17624250969333,
        leftX: 0.01060416735708,
        rightX: 0.15122916630934,
        topY: 0.79737126827239,
        width: 0.14062499895226
    })
    const updateMinimap = useCallback((m: Minimap) => setMinimap(m), [setMinimap])

    const value = useMemo(function () {
        return { minimap, updateMinimap }
    }, [minimap, updateMinimap])

    return (
        <GameContext.Provider value={value} >
            { children }
        </GameContext.Provider>
    )
}

export default GameProvider;
