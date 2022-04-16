import {createContext, useCallback, useMemo, useState, FunctionComponent, PropsWithChildren} from "react";

export const PlayerContext = createContext({
    inVehicle: false,
    health: 200,
    armor: 0,
    hunger: 100,
    thirst: 100,
    alcohol: 0,
    drug: 0,
    updateInVehicle: (i: boolean) => {},
    updateHealth: (v: number) => {},
    updateArmor: (v: number) => {},
    updateHunger: (v: number) => {},
    updateThirst: (v: number) => {},
    updateAlcohol: (v: number) => {},
    updateDrug: (v: number) => {},
})

const PlayerProvider: FunctionComponent<PropsWithChildren<{}>> = ({children}) => {
    const [inVehicle, setInVehicle] = useState<boolean>(false)
    const [health, setHealth] = useState<number>(200)
    const [armor, setArmor] = useState<number>(0)
    const [hunger, setHunger] = useState<number>(100)
    const [thirst, setThirst] = useState<number>(100)
    const [alcohol, setAlcohol] = useState<number>(0)
    const [drug, setDrug] = useState<number>(0)

    const updateInVehicle = useCallback((i: boolean) => setInVehicle(i), [setInVehicle])
    const updateHealth = useCallback((v: number) => setHealth(v), [setHealth])
    const updateArmor = useCallback((v: number) => setArmor(v), [setArmor])
    const updateHunger = useCallback((v: number) => setHunger(v), [setHunger])
    const updateThirst = useCallback((v: number) => setThirst(v), [setThirst])
    const updateAlcohol = useCallback((v: number) => setAlcohol(v), [setAlcohol])
    const updateDrug = useCallback((v: number) => setDrug(v), [setDrug])

    const value = useMemo(function () {
        return {
            inVehicle, health, armor, hunger, thirst, alcohol, drug,
            updateInVehicle, updateHealth, updateArmor, updateHunger, updateThirst, updateAlcohol, updateDrug
        }
    }, [inVehicle, health, armor, hunger, thirst, alcohol, drug, updateInVehicle, updateHealth, updateArmor, updateHunger, updateThirst, updateAlcohol, updateDrug])

    return (
        <PlayerContext.Provider value={value} >
            { children }
        </PlayerContext.Provider>
    )
}

export default PlayerProvider;
