import { BoxZone } from '@public/shared/polyzone/box.zone';

import { Story } from '../story';

export const Halloween2023Scenario3: Story = {
    name: 'Le visiteur',
    dialog: {
        part1: {
            audio: 'audio/halloween-2023/scenario3/part1.mp3',
            text: [
                'Oh bonsoir Terrien ! La vue est magnifique, n’est-ce pas ?!',
                'Tu dois être bien surpris de m’entendre parler ta langue,',
                'mais figure-toi que ce n’est pas la première fois que je viens ici !',
                'N’est-il pas coutume d’accueillir un invité comme il se doit',
                'en lui servant l’une des merveilles gastronomiques locales ?',
                'J’ai entendu parler d’un certain « The Beef with the Bone !”,',
                'qui serait un Hamburger Géant !',
                'Va donc m’en rapporter un, veux-tu bien terrien ?',
            ],
            timing: [3500, 2500, 2500, 2500, 3000, 3000, 2000, 2000],
        },
        part2: {
            audio: 'audio/halloween-2023/scenario3/part2.mp3',
            text: [
                'Mais c’est un déliiiiice ! Oh, quel plaisir de découvrir votre culture locale…',
                'Ecoute, j’ai cru comprendre que tu cherchais à expliquer les phénomènes récents',
                'et je peux sûrement t’aider.',
                'J’ai sur moi un appareil qui me permet de me téléporter.',
                'Si tu le souhaites, je peux essayer de t’aider en te téléportant dans un sous-marin atomique.',
                'Tu devrais y trouver un document qui t’aidera à en apprendre davantage sur cette histoire.',
                'Je te demande juste un instant, j’ai quelques réglages à faire et on pourra y aller !',
                'Assure toi d’avoir à boire et à manger, ça risque d’être un peu long.',
            ],
            timing: [4500, 3750, 1000, 3250, 4500, 4250, 4500, 3250],
        },
    },
    props: [
        {
            model: 'm23_1_prop_m31_casefile_01a',
            coords: [1561.234130859375, 385.1648864746094, -49.838191986083984],
            rotation: [0, 0, 180],
        },
    ],
    zones: [
        {
            name: 'halloween_2023_scenario3_document',
            part: 4,
            label: 'Ramasser',
            icon: 'fas fa-search',
            ...new BoxZone([1561.1, 385.16, -50.69], 0.4, 0.6, {
                heading: 357.32,
                minZ: -50.09,
                maxZ: -49.69,
            }),
        },
    ],
};
