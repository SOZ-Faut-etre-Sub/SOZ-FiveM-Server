## 📝 Description

Application téléphone complète permettant aux joueurs de collectionner, échanger, acheter et exposer des cartes uniques directement depuis leur téléphone in-game. Système économique intégré avec compte bancaire dédié, taxation des échanges, packs payants et revente de sets à prix variable.

⚠️ Assets sur mon Fork :
- Logo Application
- Icône carte (`cards.webp`) pour le header de l'app
- Actuellement +3300 cartes disponibles générées aléatoirement par workflow ComfyUI utilisant un LoRA entraîné par mes soins
- Bordures de profil et images de badges
- `set_prices.csv` — cours des sets par archétype
- `tags.csv` — classification des cartes par archétype

---

## 🖼️ Fonctionnalités

### 📦 Collection & Cartes gratuites

- 1 carte gratuite par jour qui s'accumule automatiquement (max 7)
- 1 carte par clic, le compteur diminue à chaque ouverture (stress -2)
- Système de streak : 7 jours consécutifs de claim → bonus 2 cartes (tolérance 48h)
- Recherche par numéro ou nom de carte (icône loupe)
- Tri par date ou catégorie, filtre par archétype avec compteurs
- Protection de carte (🔒) empêchant la vente dans un set

---

### 💰 Économie

- **Compte bancaire `tcg-service`** : compte business avec 10M$ initial, créé automatiquement
- **Taxe 7%** sur les échanges argent entre joueurs, versée sur le compte TCG Service
- **Pack hebdomadaire** : 7 cartes du pool libre, 50 000$ le 1er de la semaine, 250 000$ les suivants, reset chaque lundi
- **Revente de set** : 7 cartes non protégées d'un même archétype, prix variable lu depuis `set_prices.csv`, versé depuis le compte TCG Service
- **Page "Cours"** : classement des 28 archétypes avec prix de rachat et tiers de rareté (RARE / À surveiller / COMMUNE)

---

### 👤 Profil & Personnalisation

- Pseudo unique alphanumérique (immuable)
- Bio éditable (50 caractères max)
- Avatar choisi depuis la collection de cartes (recherche par n°) ou galerie photos, avec crop interactif circulaire (drag + zoom)
- Bordures décoratives de profil (synced automatiquement depuis les assets)
- Vitrine personnelle : jusqu'à 4 cartes exposées avec descriptions
- Badges de progression (10 badges en 3 catégories : Collectionneur, Échangeur, Marchand)

---

### 👥 Contacts TCG

- Demande de contact avec message optionnel (50 caractères max)
- Recherche de pseudo → accès au profil public
- Noms cliquables vers le profil public dans toutes les sections (acceptés, en attente envoyées, en attente reçues)
- Accès à la collection d'un contact depuis son profil ("Sa Collection")
- Suppression de contact avec popup de confirmation

---

### 🔁 Échanges

- Proposer un échange : carte contre carte ou argent contre carte
- Taxe 7% affichée clairement (brut / taxe / net) dans la liste et "7% de taxe" dans la popup de proposition
- Le receveur peut accepter ou refuser (avec message optionnel)
- L'expéditeur peut annuler sa demande en attente
- Propositions liées (même carte demandée) groupées visuellement par couleur
- SMS de notification : acceptation, refus (avec motif), annulation

---

### 🖼️ Vitrine

- Jusqu'à 4 cartes exposées par joueur avec description optionnelle (30 caractères max)
- Intégrée à la page d'accueil en 2 onglets : Vitrine Globale / Vitrine Contacts
- Bouton refresh + scroll en bas → effet relax (stress -2, une fois par heure)
- Popup de remplacement quand la vitrine est pleine (4/4)
- Clic sur un pseudo/avatar → profil public du joueur

---

### 🎨 Interface

- **Header permanent** : Logo TCG (retour accueil) + icône carte avec double bulle de notifications (verte = cartes gratuites, rouge = échanges en attente) + icône Cours + icône Contacts
- **3 onglets** style réseau social : Vitrine Globale / Vitrine Contacts / Mon Profil
- **Page Hub** : claim + pack hebdo + vente de set + liste des échanges (accessible via l'icône carte)
- **Viewer plein écran** : "Mise en Vitrine" + Protéger (haut droite) + archétype affiché
- **Avatar centré** dans les barres titre des pages collection (clic = retour au profil)
- Contraste mode clair amélioré (textShadow)

---

## 🧩 Fichiers modifiés

| Fichier | Modification |
|---|---|
| `prisma/schema.prisma` | Ajout des modèles TCG (card, user_card, daily_claim, profile, contact, trade_request, showcase, trade_partner, border, set_price, weekly_pack) |
| `src/shared/event/nui.ts` | Ajout de 27 événements NUI `PhoneAppTcg*` |
| `src/shared/rpc.ts` | Ajout de 27 événements RPC `PHONE_APP_TCG_*` |
| `src/shared/tcg/tcg.types.ts` | Types, constantes et helpers partagés |
| `src/client/phone/phone.module.ts` | Import du module TCG client |
| `src/server.ts` | Import du module TCG serveur |
| `src/nui/components/Phone/system/apps/hooks/useApps.tsx` | Enregistrement de l'app TCG |
| `src/nui/components/Phone/apps/society-contacts/contacts.constant.ts` | Ajout du contact "TCG Service" |

---

## 🆕 Fichiers créés

| Fichier | Description |
|---|---|
| `src/shared/tcg/tcg.types.ts` | Types, constantes économie, helpers (taxe, catégories) |
| `src/client/phone/apps/phone.app.tcg.provider.ts` | Provider NUI client (bridge NUI → RPC, 27 events) |
| `src/server/tcg/tcg.module.ts` | Module serveur |
| `src/server/tcg/tcg.provider.ts` | Handlers RPC serveur (27 endpoints) |
| `src/server/tcg/tcg.service.ts` | Logique métier (~1200 lignes) |
| `src/server/tcg/tcg.repository.ts` | Accès base de données Prisma (~550 lignes) |
| `src/server/tcg/tcg.migration.provider.ts` | Création auto tables + sync cartes/bordures/prix au démarrage |
| `src/nui/components/Phone/apps/tcg/TcgApp.tsx` | Root — header redesigné + routing |
| `src/nui/components/Phone/apps/tcg/hooks/useTcg.ts` | Hooks React (15 hooks) |
| `src/nui/components/Phone/apps/tcg/icon.tsx` | Icône de l'app |
| `src/nui/components/Phone/apps/tcg/index.ts` | Export de l'app |
| `src/nui/components/Phone/apps/tcg/pages/TcgHome.tsx` | 3 onglets : Vitrine Globale / Contacts / Mon Profil |
| `src/nui/components/Phone/apps/tcg/pages/TcgHub.tsx` | Claim + Pack Hebdo + Vendre Set + Échanges |
| `src/nui/components/Phone/apps/tcg/pages/TcgCollection.tsx` | Collection personnelle (recherche, tri, filtre) |
| `src/nui/components/Phone/apps/tcg/pages/TcgContactCollection.tsx` | Collection d'un contact (recherche, proposition d'échange) |
| `src/nui/components/Phone/apps/tcg/pages/TcgContacts.tsx` | Gestion des contacts TCG |
| `src/nui/components/Phone/apps/tcg/pages/TcgProfile.tsx` | Profil complet (avatar, bordure, badges, bio, vitrine) |
| `src/nui/components/Phone/apps/tcg/pages/TcgMarket.tsx` | Page Cours (classement archétypes + prix) |
| `src/nui/components/Phone/apps/tcg/pages/TcgViewer.tsx` | Viewer plein écran (mise en vitrine, protection, remplacement) |
| `src/nui/components/Phone/apps/tcg/pages/TcgSetup.tsx` | Création du pseudo |

---

## 🗄️ Tables BDD créées

Les tables suivantes sont créées automatiquement au premier démarrage via `tcg.migration.provider.ts` (aucune migration Prisma manuelle requise) :

| Table | Description |
|---|---|
| `tcg_card` | Catalogue des cartes (image, archétype, active) |
| `tcg_user_card` | Cartes possédées par joueur (unicité par carte, protection) |
| `tcg_daily_claim` | Suivi des claims quotidiens |
| `tcg_profile` | Pseudo, bio, avatar, bordure, compteurs persistants, claim system |
| `tcg_contact` | Relations de contact entre joueurs (+ message) |
| `tcg_trade_request` | Propositions d'échange (carte ou argent) |
| `tcg_showcase` | Cartes exposées en vitrine (max 4) |
| `tcg_trade_partner` | Partenaires d'échange uniques (anti-farm badges) |
| `tcg_border` | Bordures de profil (synced depuis assets) |
| `tcg_set_price` | Prix de rachat par archétype (synced depuis `set_prices.csv`) |
| `tcg_weekly_pack` | Suivi des achats de packs hebdomadaires |
| Entrée `tcg-service` dans `bank_accounts` | Compte bancaire business (10M$ initial) |

---

## ✨ Améliorations possibles

### 🏢 Application gérée par une entreprise privée

- Exploitation commerciale de l'application TCG par un job dédié
- Bordures et fonds de profil exclusifs attribuables par l'entreprise à des joueurs spécifiques
- Événements spéciaux, packs exclusifs, offres limitées
- Prix dynamiques fixés par l'entreprise
- Commission modulable sur les échanges

### 🎃 Événements saisonniers

- Archétypes event (Halloween, Noël, etc.) avec cartes limitées
- Classification automatique via `tags.csv` et `set_prices.csv`

---

## ⚙️ Notes techniques

- Création automatique de toutes les tables au démarrage (pas de migration Prisma manuelle)
- Synchronisation des cartes, bordures et prix depuis les assets à chaque redémarrage
- Re-tag automatique des archétypes NULL depuis `tags.csv`
- Architecture respectant les conventions SOZ (Provider / Module / RPC / NUI)
- Intégration complète téléphone (app + SMS + contacts + annuaire entreprise)

---

## ✅ Impact

- Ajout d'une nouvelle application téléphone complète avec système économique
- Développement parlant : aucun impact sur les systèmes existants
- Gameplay parlant : impact le stress au niveau indiqué, sink économique via taxe 7% et achats de packs
- Feature isolée et extensible à une entreprise privée
