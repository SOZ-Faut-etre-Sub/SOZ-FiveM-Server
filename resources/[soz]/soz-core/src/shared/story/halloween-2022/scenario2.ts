import { Story } from '../story';

export const Halloween2022Scenario2: Story = {
    name: 'L’homme au phare',
    dialog: {
        part1: {
            audio: '',
            text: [
                'Ooooh, bonsoir jeunes gens. Une nuit bien sombre, n’est-ce pas ?',
                'Laissez moi vous conter une petite histoire. Vous n’allez pas le regretter !',
                'Une légende raconte que l’une des îles éclairées par le phare abrite une maison inachevée…',
                'Les auteurs de cette habitation serait un jeune couple, qui,',
                'fous amoureux, rêvaient de bâtir ensemble leur logement, loin de la ville.',
                'Mais soudainement, la mer se déchaîna, leur hurlant d’arrêter la construction !',
                'Refusant d’écouter les voix qu’ils entendaient,',
                'ils se firent emporter par la marée, laissant comme seul avertissement,',
                'la barque avec laquelle le couple avait pu rejoindre l’île, ainsi que le reste d’une maison…',
                'Depuis lors, jamais personne n’y est retourné !',
                'La légende dit qu’en guise d’avertissement, la mer a laissé sur place,',
                'quelque part sur l’île, le pied de l’une des victimes…',
            ],
        },
        part2: {
            audio: '',
            text: [
                'Mon chéri, mon homme, mon amour… Je suis désolé…',
                'Je t’ai forcé à rester sur cette île pour qu’on continue à construire notre doux foyer…',
                'On aurait dû l’écouter.. Oui, on aurait dû écouter  les voix que tu disais entendre…',
                'Je ne t’ai pas cru, et regarde où nous en sommes…',
                'Oh, j’ai si soif que j’en boirais un chaudron magique …',
            ],
        },
        part3: {
            audio: '',
            text: [
                'Je ne savais pas quoi faire… La mer était si déchaînée ! Je t’ai vu te faire emporter !',
                'Je suis désolé, je n’ai rien pu faire !.. J’aimerais tant te rejoindre…',
                'Je te sens, tout au Sud, sur l’une des plus grandes îles …',
            ],
        },
        part4: {
            audio: '',
            text: [
                'Salaud ! Je l’aimais ! Tu as voulu te débarrasser de moi !',
                'Quand la mer s’est déchaînée, tu en as profité pour me jeter à l’eau !',
                "Mais le karma t'a rattrapé, la mer t’a punie de ton acte !",
                'De toute façon, j’avais caché la relique que tu désirais tant dans une cabane abandonnée sur une île.',
                'Jamais tu l’aurais trouvé !',
            ],
        },
        part5: {
            audio: '',
            text: [
                'Mais quelle histoire ! J’ai bien l’impression que vous avez résolu cette légende.',
                'La vérité est bien différente de ce que j’ai pu entendre, oh oh oh.',
                'Merci beaucoup d’avoir éclairé d’un vieux monsieur. Tenez ceci en échange !',
                'Bonne continuation à vous, jeunes gens.',
            ],
        },
    },
    zones: [
        {
            name: 'hand',
            part: 'part1',
            label: 'Chercher',
            icon: 'fas fa-search',
            center: [3739.34, 4903.36, 17.49],
            length: 1,
            width: 1,
            heading: 0,
            minZ: 17,
            maxZ: 18,
        },
    ],
};
