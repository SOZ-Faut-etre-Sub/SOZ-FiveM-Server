import {createContext, useCallback, useMemo, useState, FunctionComponent, PropsWithChildren} from "react";

export const PlayerContext = createContext({
    inVehicle: false,
    seatbelt: false,
    health: 200,
    maxHealth: 200,
    armor: 0,
    hunger: 100,
    thirst: 100,
    alcohol: 0,
    drug: 0,
    updateInVehicle: (i: boolean) => {},
    updateSeatbelt: (s: boolean) => {},
    updateHealth: (v: number) => {},
    updateMaxHealth: (v: number) => {},
    updateArmor: (v: number) => {},
    updateHunger: (v: number) => {},
    updateThirst: (v: number) => {},
    updateAlcohol: (v: number) => {},
    updateDrug: (v: number) => {},
})

const PlayerProvider: FunctionComponent<PropsWithChildren<{}>> = ({children}) => {
    const [inVehicle, setInVehicle] = useState<boolean>(false)
    const [seatbelt, setSeatbelt] = useState<boolean>(false)
    const [health, setHealth] = useState<number>(200)
    const [maxHealth, setMaxHealth] = useState<number>(200)
    const [armor, setArmor] = useState<number>(0)
    const [hunger, setHunger] = useState<number>(100)
    const [thirst, setThirst] = useState<number>(100)
    const [alcohol, setAlcohol] = useState<number>(0)
    const [drug, setDrug] = useState<number>(0)

    const updateInVehicle = useCallback((i: boolean) => setInVehicle(i), [setInVehicle])
    const updateSeatbelt = useCallback((s: boolean) => setSeatbelt(s), [setSeatbelt])
    const updateHealth = useCallback((v: number) => setHealth(v), [setHealth])
    const updateMaxHealth = useCallback((v: number) => setMaxHealth(v), [setMaxHealth])
    const updateArmor = useCallback((v: number) => setArmor(v), [setArmor])
    const updateHunger = useCallback((v: number) => setHunger(v), [setHunger])
    const updateThirst = useCallback((v: number) => setThirst(v), [setThirst])
    const updateAlcohol = useCallback((v: number) => setAlcohol(v), [setAlcohol])
    const updateDrug = useCallback((v: number) => setDrug(v), [setDrug])

    const value = useMemo(function () {
        return {
            inVehicle, seatbelt, health, maxHealth, armor, hunger, thirst, alcohol, drug,
            updateInVehicle, updateSeatbelt, updateHealth, updateMaxHealth, updateArmor, updateHunger, updateThirst, updateAlcohol, updateDrug
        }
    }, [inVehicle, seatbelt, health, maxHealth, armor, hunger, thirst, alcohol, drug, updateInVehicle, updateSeatbelt, updateHealth, updateMaxHealth, updateArmor, updateHunger, updateThirst, updateAlcohol, updateDrug])

    return (
        <PlayerContext.Provider value={value} >
            { children }
        </PlayerContext.Provider>
    )
}

export default PlayerProvider;
