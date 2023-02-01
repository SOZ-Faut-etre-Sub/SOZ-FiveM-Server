import {Spawn} from "../types/spawn";

import SpawnDefault from "../assets/img/default.png"
import SpawnLosSantos from "../assets/img/lossantos.png"
import SpawnPaletoBay from "../assets/img/paletobay.png"

const SpawnList: Spawn[] = [
    {
        identifier: 'default',
        name: 'Bienvenue à San Andreas',
        description: 'Choisis ton départ en cliquant sur l\'un des deux points !',
        image: SpawnDefault
    },
    {
        identifier: 'spawn1',
        name: 'Los Santos',
        description: 'La ville avec le plus gros réseau de livreurs Zuber de tout San Andreas !',
        image: SpawnLosSantos,
        waypoint: {
            left: '85vw',
            top: '50vh'
        }
    },
    {
        identifier: 'spawn2',
        name: 'Paleto Bay',
        description: 'La ville où vous avez le plus de chance de vous faire dévorer par un animal sauvage de tout San Andreas !',
        image: SpawnPaletoBay,
        waypoint: {
            left: '14vw',
            top: '60vh'
        }
    },
]

export default SpawnList
