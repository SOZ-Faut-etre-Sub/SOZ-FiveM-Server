import { BoxZone } from '@public/shared/polyzone/box.zone';

import { Story } from '../story';

export const Halloween2023Scenario4: Story = {
    name: "L'oeil du diable",
    dialog: {
        part1: {
            audio: 'audio/halloween-2023/scenario4/part1.mp3',
            text: [
                "Mes frères et soeurs, l'avènement de notre dieu est arrivé ! L'œil voit tout !",
                'Offrez-vous au seigneur afin d’atteindre les enfers tant désirés !',
                'Le corps d’un enfant du Diable nous a été volé et amené à la morgue, récupérez le !',
            ],
            timing: [8500, 5000, 8000],
        },
    },
    zones: [
        {
            name: 'Halloween2023-scenario4-files',
            part: 2,
            label: 'Fouiller',
            icon: 'fas fa-search',
            ...new BoxZone([237.36, -1360.29, 39.53], 1.0, 2.4, {
                heading: 140.6,
                minZ: 38.53,
                maxZ: 40.53,
            }),
        },
    ],
};
