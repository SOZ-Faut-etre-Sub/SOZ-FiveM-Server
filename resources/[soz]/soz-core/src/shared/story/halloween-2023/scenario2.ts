import { BoxZone } from '@public/shared/polyzone/box.zone';

import { Story } from '../story';

export const Halloween2023Scenario2: Story = {
    name: 'Le crystal',
    dialog: {
        part1: {
            audio: 'audio/halloween-2023/scenario2/part1.mp3',
            text: [
                'Ooh bonsoir ! Vous êtes de retour ? Écoutez bien, ',
                'il semblerait que San Andreas subisse des catastrophes naturelles provoqués par ce cristal !',
                'Il serait judicieux de se renseigner auprès des résidents sur comment le cristal est apparu !',
                'Allez donc demander aux gens près du bar, quelqu’un a sûrement dû voir quelque chose.',
            ],
            timing: [3750, 5500, 4750, 4000],
        },
        part2: {
            audio: 'audio/halloween-2023/scenario2/part2.mp3',
            text: [
                "Shhh.. Taisez vous! Le cristal nous entend j'en suis sûr! On va tous mourir..",
                'On va tous mourir! Il est sorti du sol, VOUS ENTENDEZ? IL EST SORTI DU SOL!',
                "ALLEZ DEMANDER A L'ALCOOLIQUE A L'INTERIEUR!",
            ],
            timing: [4125, 3750, 2500],
        },
        part3: {
            audio: 'audio/halloween-2023/scenario2/part3.mp3',
            text: [
                "Ecoutez.. J'vous dirais rien tant qu'vous m'aurez pas apportez un nouveau vin.. ",
                "Et j'veux un truc fort !",
            ],
            timing: [3500, 2500],
        },
        part4: {
            audio: 'audio/halloween-2023/scenario2/part4.mp3',
            text: [
                'Ooooh bonne mère ! Je vais m’exploser le bide avec ce que vous m’avez apporté !',
                'Pour être honnête, j’avais juste soif, mais j’ai aucune information à vous donner…',
                'Peut-être que l’autre espionne sur le toit de la caravane a vu quelque chose… Gloups.',
            ],
            timing: [3500, 3500, 3500],
        },
        part5: {
            audio: 'audio/halloween-2023/scenario2/part5.mp3',
            text: [
                'Vous là ! Je vous ai vu parler aux scientifiques !',
                "J'ai une information importante à vous donner.",
                'Avant que le cristal ne sorte du sol',
                "j'ai vu les extraterrestres danser sous la pleine lune en agitant un étrange artéfact.",
                "Je les ai écouté de loin et ils ont dit qu'ils allaient le cacher à l'abri des regards.",
                'De mémoire, ils parlaient des marais.',
                "Alors, je ne sais pas si j'ai très bien entendu",
                "mais j'espère que ça vous aidera quand même.",
            ],
            timing: [2750, 2150, 2150, 5150, 5000, 2500, 3000, 2750],
        },
        part6: {
            audio: 'audio/halloween-2023/scenario2/part6.mp3',
            text: [
                'Qu’est ce donc ?... Quel étrange artéfact vous avez là !',
                'Je pense l’avoir déjà vu dans certains ouvrages !',
                'De mémoire, il servait autrefois à une race extraterrestre.',
                'J’ai toujours cru que c’était un conte pour enfants…',
                'Dans tous les cas, l’enquête avance de bon train !',
                'Toutes nos félicitations, vous êtes l’associé idéal à mon génie !',
                'Ne me remerciez pas, c’est tout à fait normal.',
            ],
            timing: [4000, 3000, 3000, 3000, 3000, 5000, 3000],
        },
    },
    props: [{ model: 'm23_1_prop_m31_artifact_01a', coords: [-2078.01, 2614.61, 2.06], rotation: [0, 90, 0] }],
    zones: [
        {
            name: 'halloween_2023_scenario2_artefact',
            part: 5,
            label: 'Ramasser',
            icon: 'fas fa-search',
            ...new BoxZone([-2077.8, 2614.5, 2.67], 0.4, 0.4, {
                heading: 198.64,
                minZ: 1.87,
                maxZ: 2.37,
            }),
        },
    ],
};
