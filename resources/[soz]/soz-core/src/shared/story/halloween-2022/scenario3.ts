import { Story } from '../story';

export const Halloween2022Scenario3EnterBunker = 'Halloween2022Scenario3EnterBunker';
export const Halloween2022Scenario3ExitBunker = 'Halloween2022Scenario3ExitBunker';

export const Halloween2022Scenario3: Story = {
    name: 'La double personnalité',
    dialog: {
        part1: {
            audio: 'audio/halloween-2022/scenario3/part1.mp3',
            text: [
                'Mais où est-ce qu’elle est tombée ?',
                'J’ai tourné la tête une seconde en voulant photographier un alien, et me voilà toute seule !',
                'Est-ce que vous pouvez aller vérifier en bas de cette falaise si mon amie y est ?',
                'On prenait des photos entre giiiirrrlll quand elle a soudainement disparu !',
                'Je crains qu’elle soit malheureusement tombée…',
            ],
        },
        part2: {
            audio: 'audio/halloween-2022/scenario3/part2.mp3',
            text: [
                'Aaaaah… J’ai si mal à la main… Oh, quelqu’un ! Vous dites être venu ici grâce à mon amie ?',
                'C’est incroyable, vous allez me sauver ! Je me suis brisée la main en tombant de la falaise !',
                'C’est allé si vite, j’avais vu un bel alien au loin, et paf, plus aucun souvenir !',
                'L’alien m’a aidé et m’a installé sur ce lit, je ne sais pas trop où je suis.',
                'Il disait qu’il allait devoir me couper la main, la recoudre, bref…',
                "J’ai cru entendre qu'il devait aller au Wenger Institute !",
                'Faites quelque chose, s’il vous plaît !',
            ],
        },
        part3: {
            audio: 'audio/halloween-2022/scenario3/part3.mp3',
            text: [
                'Mmmmh ? Qu’est ce que vous me racontez ?...',
                'Il y a en effet un alien qui correspond à votre description qui est passé par ici.',
                'Il m’a demandé une main fraiche afin d’aider une femme qu’il avait trouvé au sol.',
                'J’ai pas tout compris, il est parti avant même que je puisse lui répondre.',
                'Prenez ceci, peut-être que ça vous aidera. Mais dégagez maintenant !',
            ],
        },
        part4: {
            audio: 'audio/halloween-2022/scenario3/part4.mp3',
            text: [
                'Oh c’est incroyable ! La main que vous m’avez recollé est parfaite !',
                'Je peux de nouveau l’utiliser. Merci beaucoup de votre aide !',
                "Il serait judicieux de prévenir mon amie, elle doit m'attendre en étant morte d'inquiétude !",
                'Oooh où est ton mon bel alien, j’aimerais tant revoir mon véritable sauveur.',
            ],
        },
        part5: {
            audio: 'audio/halloween-2022/scenario3/part5.mp3',
            text: [
                'Pardon ? Vous lui avez recollé une main ?! Et en plus elle a trouvé un alien ?!',
                'Non mais quelle immonde personne, à vivre ses aventures toute seule ! Tu parles d’une amie.',
                'Pfff, bon, tenez ceci, vous avez tout de même accepté de m’aider. Merci beaucoup.',
            ],
        },
    },
    props: [
        { model: 'p_bloodsplat_s', coords: [594.75, 5552.92, 715.76], rotation: [-90, 0, 0] },
        { model: 'p_bloodsplat_s', coords: [597.65, 5553.05, 715.76], rotation: [-90, 0, 0] },
        { model: 'p_bloodsplat_s', coords: [600.25, 5551.26, 715.76], rotation: [-90, 0, 0] },
        { model: 'p_bloodsplat_s', coords: [602.78, 5553.44, 715.76], rotation: [-90, 0, 0] },
        { model: 'p_bloodsplat_s', coords: [602.26, 5556.87, 715.76], rotation: [-90, 0, 0] },
        { model: 'p_bloodsplat_s', coords: [603.01, 5559.93, 715.76], rotation: [-90, 0, 0] },
        { model: 'p_bloodsplat_s', coords: [600.63, 5561.16, 715.76], rotation: [-90, 0, 0] },
        { model: 'p_bloodsplat_s', coords: [597.86, 5563.14, 715.76], rotation: [-90, 0, 0] },
        { model: 'p_bloodsplat_s', coords: [595.08, 5560.92, 715.76], rotation: [-90, 0, 0] },
        { model: 'p_bloodsplat_s', coords: [592.68, 5559.43, 715.76], rotation: [-90, 0, 0] },
        { model: 'p_bloodsplat_s', coords: [593.48, 5555.8, 715.76], rotation: [-90, 0, 0] },
        { model: 'p_bloodsplat_s', coords: [592.93, 5552.86, 715.76], rotation: [-90, 0, 0] },
        { model: 'p_bloodsplat_s', coords: [599.03, 5559.13, 715.76], rotation: [-90, 0, 0] },
        { model: 'p_bloodsplat_s', coords: [596.55, 5556.69, 715.76], rotation: [-90, 0, 0] },
        { model: 'v_ilev_body_parts', coords: [595.67, 5554.19, 715.76], rotation: [0, 0, 0] },
        { model: 'v_ilev_body_parts', coords: [595.76, 5557.66, 715.76], rotation: [0, 0, 0] },
        { model: 'v_ilev_body_parts', coords: [599.34, 5561.47, 715.76], rotation: [0, 0, 0] },
        { model: 'v_ilev_body_parts', coords: [601.29, 5558.84, 715.76], rotation: [0, 0, 0] },
        { model: 'v_ilev_body_parts', coords: [604.25, 5558.55, 715.76], rotation: [0, 0, 0] },
        { model: 'v_ilev_body_parts', coords: [600.95, 5554.34, 715.76], rotation: [0, 0, 0] },
        { model: 'v_ilev_body_parts', coords: [596.7, 5551.71, 715.76], rotation: [0, 0, 0] },
    ],
};
