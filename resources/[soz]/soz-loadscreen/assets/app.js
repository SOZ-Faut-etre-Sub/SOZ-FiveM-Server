const app = document.getElementById('app');
const musique = app.querySelector('audio');
const volume = app.querySelector('#volume');
const serverRuleElement = document.getElementById('server-rule');
const VOLUME_MAX_MULT = 0.8;

const rules = [
    '<u>Pour toute problématique et questionnement RP ou HRP :</u> <b>Contacte nous par ticket</b>. Tu ne dois pas régler tes problèmes par toi-même : Tu es ici pour passer un bon moment, nous nous occupons du reste.',
    '<u>Le serveur :</u> <b>Tu dois obligatoirement être majeur pour jouer sur SOZ, et le streaming / VODs sont totalement interdits</b>',
    '<u>Le Personnage :</u> Tu arrives à San Andreas seul ou avec partenaire, et ne connaîssant aucun habitant de l\'île. Ton nom et prénom ne doit pas être identique à une personnalité IRL.</br><b> Les Troubles dissociatif de l\'identité (TDI) ne sont pas autorisés.</b>',
    '<u>Le HRP :</u> Il est interdit de t\'accorder avec un autre Joueur en HRP, tout comme il est prohibé de parler en HRP dès lors où tu es en jeu. Être en jeu et sur un vocal externe est aussi interdit.<br>Toutes les scènes / bug doivent être joué et considéré en RP et quitter le jeu pour éviter une scène n\'est pas autorisé.',
    '<u>Absence :</u> Tu dois nous prévenir lors d\'une absence supérieure à deux semaines, via ticket. Dans le cas contraire, ton compte sera automatiquement désactivé à vie.<br> - Après 21 Jours d\'inactivité, ton véhicule est envoyé en fourrière. Un véhicule restant en fourrière 7 Jours est supprimé.<br> - Lors de longues pauses (vacances, arrêts maladie, …), le métier doit être retiré.',
    '<b>Les actes sexuels (RPQ, Viols, Attouchement, …) et contenus NSFW sont strictement interdits, même en privé</b>. <i>Dans le cas où tu décides d\'enfreindre cette règle, nous te bannirons du serveur et de la chaîne Twitch de ZeratoR.</i>',
    '<u>L\'imaginaire RP :</u> Est autorisé, mais les joueurs en face de toi ne sont pas obligés de s\'y plier. S\'ils refusent, ne force pas ! <br> - Décrire des actions qu\'un autre joueur doit effectuer est autorisé, notamment lorsque tu as ce personnage sous ton contrôle (faire rentrer dans un véhicule, mettre la ceinture, transporter un patient inconscient, ...).',
    '<u>La violence :</u> <br> - Insulter un autre personnage en RP (de manière mesurée et contextuelle) est autorisé. <br> - Les propos à tendance discriminante, homophobe sont prohibés. <i>Ce n\'est pas parce que vous n\'êtes pas en Live, que vous ne devez pas être Twitch Friendly.</i><br> - Le CarKill ainsi que le FreeKill sont prohibés.',
    '<u>Anonymat :</u> <br> - Tu deviens anonyme dès lors où tu te recouvres d\'un masque ou d\'un casque intégral. <br> - Il n\'est pas possible de reconnaitre une voix en radio (sauf les personnes censées être sur la radio)',
    '<u>Les Zones Admin et IA :</u><br> - Voler des véhicules militaires, fédéral et policier de l\'IA est interdit.<br> - Survoler/Visiter les zones suivantes est interdit : base militaire, Humane Labs, Bâtiments fédéraux (Parking FIB).',
    '<b>Les communications RP en dehors du jeu sont totalement prohibées.</b><br>Aucun Discord, aucun MP, aucun Message Privé n\'est considéré en RP dès qu\'il sort du jeu. Exception faite pour les quelques salons des Discord Entreprise où le Staff y est présent. ',
    '<u>Les véhicules :</u><br> - Suite à un gros accident, un voyant moteur peut apparaitre, s\'affichant orange ou rouge. Dès lors, il t\'est obligatoire de te rendre à New Gahray.<br> - Jouer le Pain RP suite à un accident est obligatoire.<br> - Rouler en off-road avec un véhicule inadapté est interdit.<br> - Utiliser un véhicule tiers pour remettre le tien sur ses roues ou le débloquer est interdit.',
    'Lorsque tu abandonnes ton véhicule et qu\'il disparaît, cela lui fait perdre une vie et l\'envoie en fourrière. Il en dispose de trois à l\'achat ! <b>Perdre les trois vies de ton véhicule engendre sa destruction.</b> <u>Il est inutile de faire un ticket pour t\'en plaindre.</u>',
    '<b>Quelle que soit la perte en jeu, il n\'y aura jamais de remboursement !</b>',
    '<b>Lorsque la barre de vie de ton personnage tombe à zéro, tu tombes dans le coma !</b> Pas d\'inquiétude, ton personnage ne meurt pas pour autant. <i>Psst... Lorsque tu es dans le coma, il est obligatoire de te mute.</i>',
    '<u>Lors d\'un coma :</u> Tu oublies tous les éléments qui t\'ont amené à celui-ci ! <i>Une personne présente peut te redonner tes souvenirs.</i>',
    '<b>Il est interdit d\'utiliser l\'UHU ou d\'envoyer ta position au LSMC tant qu\'une scène est en cours. </b>',
    '<b>Il est obligatoire pour l\'agresseur de ne pas abandonner la victime sans que les secours ne soient appelés.</b> <i>En anonyme s\'il le faut.</i>',
    'Dès lors où tu subis des blessures, il est obligatoire d\'engager une scène avec le LSMC.',
    'Le coma éthylique rend tes derniers souvenirs flous et incohérents. Joue sur ça !',
    'Quand le LSMC te prend en charge suite à un accident, <b>donne leur un maximum d\'indices, sans pour autant leur dire quoi faire.</b> <i>En MP HRP s\'il faut, afin qu\'il puisse jouer l\'autopsie !</i>',
    '<b>Les tentatives de suicide sont prohibées.</b> Il est aussi interdit d\'y faire mention.',
    '<b>Si le LSMC décide de te mettre une incapacité due à une blessure, il t\'est obligatoire de la jouer et elle ne se négocie pas.</b> <i>Main foulée, blessure à la tête, ..</i> ',
    '<b>La basse et moyenne criminalité est actuellement autorisée sur SOZ !</b> Tu dois être prêt à en assumer les conséquences. <br>En tant que jeune criminel : Il est important de considérer les FDO. Le FearRP est de mise et doit être adapté à la situation.',
    '<b>Limite toi lorsque tu voles quelqu\'un.</b> Que ça soit un Joueur ou une entreprise, ne prend pas la totalité des biens ! <b>Il est interdit de farmer les joueurs.</b>',
    '<b>Il est interdit de forcer quelqu\'un à vous donner de l\'argent.</b> <i>Si vous désirez voler un individu, zipez le et prenez lui.</i><br>Limitez vous à 50% de la somme.',
    '<b>Détruire ou voler</b> le véhicule d\'un Joueur sans raison est interdit.',
    '<b>Lors d\'un vol de véhicule appartennant à un Joueur ou une Entreprise, il est obligatoire de le revendiquer.</b><br>Il est aussi autorisé de volontairement alerter les FDO, en faisant flasher le véhicule à plusieurs reprises, en étant toujours en mouvement, en contactant la victime, ....',
    '<b>Prend le temps de discuter, de faire monter la pression et d\'y aller crescendo.</b> Les violences doivent toujours être adaptées au RP.',
    '<b>La corruption FDO est autorisée.<br>Tu dois cependant nous alerter en ticket de tes attentions et objectifs afin que ça soit validé.</b>',
    '<b>La corruption LSMC est autorisée.</b><br>Tu as le droit de tout, sauf laisser volontairement un Joueur au sol alors que tu aurais pu le réanimer.',
    '<b>Il est interdit de sortir des Radio quelle que soit votre entreprise.</b>',
    'Il n\'est <b>pas autorisé</b> de <b>forcer quelqu\'un à réaliser une action que tu ne peux pas toi-même faire.</b><br><u>Cas exceptionnel :</u> Demander à quelqu\'un de sortir un objet du coffre de son entreprise est autorisé.',
    '<b>Braquer ou voler sur un point de récolte</b> d\'une entreprise <b>est autorisé.</b><br> Une réserve est de mise, harceler plusieurs fois la même entreprise - le même point de récolte est prohibé.',
    '<b>Racoler les nouveaux arrivants à des fins criminelles</b> comme l\'existence des contrats <b>est interdit.</b> <br> Laissez les découvrir en étant d\'abord recruté dans l\'une des entreprises avant de vouloir les influencer à peine sorti du nid.',
    '<b>La Pacific Bank est considérée comme une zone sûre.</b> On ne peut y perpétrer quelconque acte criminel, étant la banque centrale de Los Santos.',
    '<b>L\'attachement à un groupe se fait à l\'aide d\'une culture commune et non en devenant des clones. S\'identifier comme un gang ouvertement est interdit.</b>',
    'Mets toi en tête que tu n\'es pas en ranked immortal sur Valorant. <b>Une arme ne doit être utilisée qu\'en dernier recours, lorsque tu es dos au mur.</b> <u>Attention ! Si tu décides de tirer sans aucune discussion ou raison, tu rentres dans la réglementation du FreeKill.</u> ',
    '<b>Ton personnage pouvant mourir, tu dois donc considérer la vie de celui-ci. Il est important de vouloir rester en vie coûte que coûte.</b> Si le Staff considère qu\'il y a absence abusive de Fear RP, tu risques un bannissement ou une Mort RP, c\'est-à-dire, le fait de supprimer son personnage du jeu.',
    '<b>Lorsque que tu es menacé d’une arme, il est obligatoire de privilégier le dialogue avec ton agresseur. Fais en sorte de jouer ta vie !</b> <i>Si tu es mis en joue par un autre personnage, sortir ton arme tel un cowboy s\'apparente à du NoFear.</i>',
    '<u>L\'informateur :</u> <i>Correspond au fait de dévoiler des informations de notre organisation d\'appartenance envers une autre organisation.</i><br><u>L\'indic :</u> <i>Correspond au fait de rejoindre une organisation opposée à la nôtre, dans le seul but de faire fuiter des informations et de nuire à son équilibre.</i><br><u>Restriction :</u> <b>Il est obligatoire d\'y aller crescendo jusqu\'à que vous vous fassiez prendre ou non.</b><br>Mandatory: <b>Ne sont pas autorisés a être Informateur ou Indic</b>.<br> Le LSMC, STONK, le LSPD et le BCSO: <b>Peuvent devenir Informateur ou Indic sous leur propre impulsion, mais doivent laisser suffisament de piste pour ne pas être un fantome.</b>',
    'Le départ correspond à la disparition définitive de ton personnage dans le paysage de San Andreas. <i>Il aura bien vécu !</i>',
    '<b>Si tu souhaites partir de l\'île de San Andreas, contacte nous par ticket !</b><br><u>Plusieurs options sont disponibles :</u><br><b>Prendre l\'avion:</b> Si vous souhaitez que votre personnage parte en vie de Los Santos.<br><b>L\'arrêt cardiaque:</b> Si vous souhaitez faire mourir votre personnage plutôt que de le voir partir de Los Santos.',
    '<u>Lors du départ, il est interdit de :</u><br> - Faire hériter ou faire don de son argent et/ou ses biens avant son départ.<br> - Partager des informations sensibles à d\'autres personnes.',
    '<b>La demande d\'assassinat est autorisée.</b><br>Avant toute demande, il est obligatoire que votre personnage ait subit un grief relativement important ou que des actions abusives aient été constaté. <i>Celle-ci doit être réalisée à l\'aide d\'un ticket et doit être motivée des différentes raisons menant à la demande.</i>',
    'Tu as lu beaucoup de règles et de codes, n\'est ce pas ? <b>Ne t\'inquiéte pas, on ne procédera pas à des bans uniquement car tu es néophyte. Plusieurs rappels à l\'ordre seront toujours énoncés avant d\'agir !</b>',
    'Le RP se résume à vivre une aventure, à découvrir des joueurs (autant en jeu, qu\'en dehors), à partager des histoires ensemble. <b>Quel que soit l\'archétype de ton  personnage, pense aux sentiments de la personne que tu as en face de toi.</b> N\'hésite pas à remercier les joueurs lors de scènes intenses, et à discuter après avoir vécu quelque chose.',
    '<b>C\'est en faisant attention aux sentiments de l\'autre que tu vas t\'éviter bon nombre de problèmes.</b> Ne laisse pas l\'envie de gagner te dominer, quitte à sacrifier ton propre plaisir de jeu. <b>S\'il y a bien une chose qu\'RPZ a dû t\'apprendre, en tant que viewer, c\'est que “perdre” t\'amène bien plus souvent de RP que tout autre chose.</b>'
];

function getVolume() {
    return localStorage.getItem('sozLoadScreenVolume') || 100
}
function setVolume(volume) {
    localStorage.setItem('sozLoadScreenVolume', volume);
    musique.volume = (volume / 100) * VOLUME_MAX_MULT;
}

function bootstrap() {
    // Load volume from localStorage
    musique.volume = (getVolume() / 100) * VOLUME_MAX_MULT;
    volume.value = getVolume();

    // Change volume
    volume.addEventListener('input', (event) => {
      setVolume(event.currentTarget.value);
    });

    musique.play()

    serverRuleElement.innerHTML = rules[Math.floor(Math.random()*rules.length)];
}

window.addEventListener('message', function(e) {
    if (e.data.eventName === 'initFunctionInvoking' && e.data.name === 'FinalizeLoad') {
        document.getElementById('video').style.opacity = '0';

        setInterval(function () {
            if (musique.volume > 0.01) {
                musique.volume -= 0.01;
            }
        }, 50);
    }
});

bootstrap();
