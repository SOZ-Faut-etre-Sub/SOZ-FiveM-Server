import {createContext, FunctionalComponent} from "preact";
import {useCallback, useMemo, useState} from "preact/hooks";
import {Spawn} from "../types/spawn";
import SpawnList from "../config/spawn";

export const SpawnContext = createContext({
    spawn: {} as Spawn,
    updateSpawn: (s: Spawn) => {}
})

const SpawnProvider: FunctionalComponent = ({children}) => {
    const [spawn, setSpawn] = useState<Spawn>(SpawnList[0])
    const updateSpawn = useCallback((s: Spawn) => setSpawn(s), [setSpawn])

    const value = useMemo(function () {
        return { spawn, updateSpawn }
    }, [spawn, updateSpawn])

    return (
        <SpawnContext.Provider value={value} >
            { children }
        </SpawnContext.Provider>
    )
}

export default SpawnProvider;
