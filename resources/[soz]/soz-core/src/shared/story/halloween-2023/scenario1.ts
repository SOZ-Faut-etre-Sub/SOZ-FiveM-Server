import { BoxZone } from '@public/shared/polyzone/box.zone';

import { Story } from '../story';

export const Halloween2023Scenario1Alcool = ['horror_cauldron', 'halloween_bloody_mary', 'halloween_spectral_elixir'];

export const Halloween2023Scenario1: Story = {
    name: 'Les échoués',
    dialog: {
        part1: {
            audio: 'audio/halloween-2023/scenario1/part1.mp3',
            text: [
                'Écartez-vous, écartez-vous ! Veuillez garder votre calme !',
                'Tout ce que nous savons, c’est que depuis ce matin,',
                'plusieurs animaux marins géants se sont échoués sur San Andreas.',
                'Ils ressemblent fortement à des animaux préhistoriques,',
                'qui jusqu’à maintenant, étaient totalement éteint.',
                'Nous ne sommes pas en mesure de vous transmettre plus d’informations.',
                'Nos experts scientifiques de Human Labs travaillent actuellement sur ce nouveau mystère.',
                'Veuillez vous renseigner auprès des personnes compétentes ! Calmez-vous maintenant !',
            ],
            timing: [3500, 2500, 3500, 3000, 2000, 3000, 4500, 4000],
        },
        part2: {
            audio: 'audio/halloween-2023/scenario1/part2.mp3',
            text: [
                "Bonjour bonjour ! J'en déduis que vous devez être notre nouvel enquêteur ?",
                'Très bien, très bien.',
                "Selon nos dernières analyses, ce phénomène fait suite à l'éruption d'un volcan.",
                'Un volcan qui aurait coulé entièrement une île voisine !',
                'Vous y croyez vous ? Une vraie catastrophe !',
                'Les échoués proviendraient du fond marin de cette île,',
                'qui suite à l’éruption, aurait été déplacé jusqu’à San Andreas.',
                'Très étrange, je le conçois…',
                'J’aurais besoin que vous me trouviez plusieurs éléments pour pouvoir continuer mon analyse.',
                'Le premier élément se trouve sur une baleine échoué, proche de Cayo Perico.',
                'Récoltez le et rapportez le moi. Pour le second élément, j’aurais besoin de vingt poissons,',
                'ils me serviront à analyser les fonds marins. Allez, au boulot !',
            ],
            timing: [4125, 1125, 4000, 3000, 3000, 2750, 3125, 1500, 4500, 3750, 4125, 3500],
        },
        part3: {
            audio: 'audio/halloween-2023/scenario1/part3.mp3',
            text: [
                'Excellent, excellent ! Je vous remercie de m’avoir rapporté tout cela.',
                'Je vais pouvoir effectuer de plus profondes analyses afin de mieux observer ce phénomène.',
                'Ooh, je vais aussi avoir besoin de Joël, un vieil ami !',
                'Il serait en mesure de m’aider à approfondir le sujet.',
                'Ses talents et sa perspicacité nous seront utiles.',
                'Je n’ai cependant aucune idée d’où il se trouve actuellement..',
                'Aux dernières nouvelles, il était capitaine d’un cargo près des docs. Allez vous renseigner !',
            ],
            timing: [4000, 4000, 3500, 2750, 3000, 3000, 5000],
        },
        part4: {
            audio: 'audio/halloween-2023/scenario1/part4.mp3',
            text: [
                "Joël ? C'est bien moi oui.",
                "Vous voulez pas une choppine pendant qu'vous m'racontez votre histoire ?",
                "Y'en a plein sur le navire.",
                'Mmh ... je comprends mieux ...',
                "Cela n'me dérange pas d'vous aider, mais ce cargo ne peut pas partir sans son capitaine !",
                'Vous allez devoir me trouver un remplaçant, sans ça, impossible de vous venir en aide.',
                "J'en connais un qui devrait être intéressé ... même s'il est retraité.",
                'Allez le voir, il a pour habitude de pêcher près du marais de San Andreas !',
            ],
            timing: [2500, 3500, 1500, 2500, 6000, 5000, 5000, 4000],
        },
        part5: {
            audio: 'audio/halloween-2023/scenario1/part5.mp3',
            text: [
                'Attendez… Attendez… Je vais l’avoir, taisez-vous… … Purée zut, je l’ai encore raté !',
                'Oh... Ecoutez, je suis un homme simple',
                'je veux bien piloter ce cargo pour que Joël vous aide,',
                'mais rapportez-moi l’un des cocktails exclusifs !',
            ],
            timing: [7500, 4000, 2000, 2500],
        },
        part6: {
            audio: 'audio/halloween-2023/scenario1/part6.mp3',
            text: [
                'Hé bien parfait ! Merci pour ce cocktail...',
                'Mmmmh, Mmmmmh. MMMMH IL EST DELICIEUX ! Oh... Oh, Prévenez Joël, je le remplace !',
            ],
            timing: [3000, 6000],
        },
        part7: {
            audio: 'audio/halloween-2023/scenario1/part7.mp3',
            text: [
                'Il a accepté ? Merveilleux !',
                'Oh, petit conseil, rendez-vous au cristal un peu plus tard, voir demain !...',
            ],
            timing: [3000, 7000],
        },
    },
    zones: [
        {
            name: 'deadwhale',
            part: 2,
            label: 'Récolter',
            icon: 'fas fa-search',
            ...new BoxZone([4768.34, -4725.53, 1.78], 3.6, 11.8, {
                heading: 141.49,
                minZ: 0.78,
                maxZ: 2.78,
            }),
        },
    ],
};
