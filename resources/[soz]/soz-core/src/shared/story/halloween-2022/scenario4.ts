import { Story } from '../story';

export const Halloween2022Scenario4: Story = {
    name: 'Halloween 2022 Scenario 4',
    dialog: {
        part1: {
            audio: '',
            text: [
                'Hop hop hop ! Où est-ce que vous allez comme ça ?',
                'Désolé, tant que vous n’avez pas votre autorisation,',
                'je ne peux pas vous expliquer la situation.',
                'Essayez d’aller jusqu’aux bureaux de Paleto, ils devraient pouvoir vous en délivrer une !',
            ],
        },
        part2: {
            audio: '',
            text: [
                'Vous voulez enquêter sur l’université ?',
                'Écoutez, tout cela me dépasse… Cette histoire, le FBI qui s’en mêle,',
                'je ne veux plus rien avoir avec ça !',
                'Prenez cette autorisation, et retournez voir l’Agent.',
                'Moi, je me casse d’ici, je n’en peux plus.',
            ],
        },
        part3: {
            audio: '',
            text: [
                'Vous avez obtenu une autorisation ?',
                'Voilà qu’on file une affaire aussi importante à des amateurs...',
                'Bref. Ecoutez, voici la situation.',
                "Nos informations indiquent l'existence d'un Alien dans les environs.",
                "Malheureusement, notre piste s'arrête ici.",
                'Cela fait déjà plusieurs heures que nous avons encerclé le bâtiment,',
                "et jusqu'à maintenant, aucune trace de ce foutu Alien.",
                "On ne peut pas perdre plus de temps. S'il est encore là, il faut qu'on le trouve.",
                'Donc maintenant, vous allez me fouiller de fond en comble cette université, et mettre la main dessus !',
            ],
        },
        part4: {
            audio: '',
            text: [
                "Au premier abord, ce que vous venez d'entendre vous semble totalement incompréhensible.",
                'Pourtant, d’une façon inconnue, votre esprit arrive à traduire ce qu’il essaie de vous communiquer.',
                'Venu en ami, il ne désire pas faire de mal à qui que ce soit.',
                "D'une manière plutôt floue, vous percevez une porte, dans un tunnel près du Mont Chiliad.",
                "S'y rendre vous permettra certainement d'avoir des réponses.",
            ],
        },
        part5: {
            audio: '',
            text: [
                'En observant de plus près la porte, vous remarquez sur sa droite un ingénieux dispositif.',
                'Un emplacement vide vous fait rapidement comprendre qu’il vous manque quelque chose pour pouvoir y entrer.',
                'Cherchant désespérément un indice, vous constatez un écriteau mentionnant les mots  “Camp, Est, Peace”.',
                'Peut-être est-ce un indice où vous devriez vous rendre ?',
            ],
        },
        part6: {
            audio: '',
            text: [],
        },
        part7: {
            audio: '',
            text: [],
        },
    },
    zones: [
        {
            name: 'scenario4_door_chiliad',
            part: 5,
            label: 'Inspecter',
            icon: 'fas fa-search',
            center: [-263.67, 4729.01, 137.92],
            length: 0.4,
            width: 1.45,
            heading: 321,
            minZ: 135.87,
            maxZ: 139.87,
        },
        {
            name: 'aliens',
            part: 6,
            label: 'Inspecter',
            icon: 'fas fa-search',
            center: [2328.64, 2571.04, 46.71],
            length: 5.6,
            width: 3.0,
            heading: 335,
            minZ: 44.16,
            maxZ: 48.16,
        },
    ],
};
