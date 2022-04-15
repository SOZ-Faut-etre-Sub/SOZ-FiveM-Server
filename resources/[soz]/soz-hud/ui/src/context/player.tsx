import {createContext, useCallback, useMemo, useState, FunctionComponent, PropsWithChildren} from "react";

export const PlayerContext = createContext({
    inVehicle: false,
    health: 200,
    armor: 0,
    hunger: 100,
    thirst: 100,
    updateInVehicle: (i: boolean) => {},
    updateHealth: (v: number) => {},
    updateArmor: (v: number) => {},
    updateHunger: (v: number) => {},
    updateThirst: (v: number) => {},
})

const PlayerProvider: FunctionComponent<PropsWithChildren<{}>> = ({children}) => {
    const [inVehicle, setInVehicle] = useState<boolean>(false)
    const [health, setHealth] = useState<number>(200)
    const [armor, setArmor] = useState<number>(0)
    const [hunger, setHunger] = useState<number>(100)
    const [thirst, setThirst] = useState<number>(100)

    const updateInVehicle = useCallback((i: boolean) => setInVehicle(i), [setInVehicle])
    const updateHealth = useCallback((v: number) => setHealth(v), [setHealth])
    const updateArmor = useCallback((v: number) => setArmor(v), [setArmor])
    const updateHunger = useCallback((v: number) => setHunger(v), [setHunger])
    const updateThirst = useCallback((v: number) => setThirst(v), [setThirst])

    const value = useMemo(function () {
        return {
            inVehicle, health, armor, hunger, thirst,
            updateInVehicle, updateHealth, updateArmor, updateHunger, updateThirst
        }
    }, [inVehicle, health, armor, hunger, thirst, updateInVehicle, updateHealth, updateArmor, updateHunger, updateThirst])

    return (
        <PlayerContext.Provider value={value} >
            { children }
        </PlayerContext.Provider>
    )
}

export default PlayerProvider;
