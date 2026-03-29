Fork Initial : SOZ-FiveM-Server ft dAIly

## 25.03.20206

+ Application TCG

## 🖹 Description

Nouvelle application téléphone permettant aux joueurs de collectionner, échanger et exposer des cartes uniques directement depuis leur téléphone in-game.

---

## 🖼️ Fonctionnalités actuelles 

### 📦 Collection & Cartes quotidiennes
- 2 cartes gratuites par jour (variable modifiable) parmis les cartes disponibles. (stress -2)
- Collection personnelle consultable

---

### 👤 Profil & Contacts TCG
- Pseudo unique différent du nom du personnage
- Système de demandes de contact avec message optionnel (50 caractères max)
- Accéder à la collection d’un contact

---

### 🔁 Échanges avec contact
- Proposer un échange : carte contre carte ou argent contre carte
- Le receveur peut accepter ou refuser (avec message optionnel)
- L’expéditeur peut annuler sa demande en attente
- Propositions liées (même carte demandée) groupées visuellement par couleur

---

### 🖼️ Vitrine publique
- Exposer jusqu’à 3 cartes avec description optionnelle (30 caractères max)
- Scroll en bas de la vitrine → effet relax (stress -2, une fois par heure max)
- Clic sur un pseudo → popup : ajouter contact / voir collection / demander échange

---

## TCG v1.1 — Patch Notes (29/03/2026)

 
🎨 PROFIL JOUEUR
- Avatar personnalisable : choix depuis la collection de cartes OU la galerie photos du téléphone
- Crop interactif circulaire (drag pour repositionner, +/- pour zoomer)
- Bordures de profil décoratives (synced automatiquement depuis les assets)
- Bio éditable inline (50 chars, même pattern que le champ contact)
- Bouton "Mon Profil" ajouté sur la page d'accueil
- Avatar affiché correctement dans le cadre de bordure (118px dans conteneur 130px)
 
👥 CONTACTS
- Avatar affiché (40px) à côté de chaque contact dans la liste
- Bouton "Supprimer des contacts" (rouge) sur le profil d'un contact accepté, avec confirmation
- Nettoyage du code (import inutile fetchNui retiré)
 
🏪 VITRINE
- Avatar du joueur (40px) affiché à gauche du bloc texte
- Description en cyan à droite du username sur la même ligne
- Layout repensé : avatar | username + description / nom carte / archétype
 
📋 COLLECTION
- Archétype affiché en violet sous le nom de chaque carte
- Bouton rouge ✕ séparé pour retirer le filtre rapidement
- Plus de ✕ dans le bouton filtre (affiche juste le nom de l'archétype)
- Mêmes améliorations sur la collection d'un contact
- Revente de set
- Remise en "daily claim" des sets vendus
 
🏆 BADGES
- 10 badges avec barres de progression (propre profil)
- Badges groupés par catégorie : Collectionneur / Échangeur / Marchand
- Support images .webp par badge ID, fallback emoji si absent
- Profils des autres : seul le badge le plus élevé par catégorie affiché
 
💬 SMS & NOTIFICATIONS
- SMS envoyé au demandeur lors du REFUS d'un échange (avec motif si fourni)
- SMS envoyé au receveur lors de l'ANNULATION d'un échange
- (Acceptation déjà notifiée aux deux parties)
 
🗂️ ORGANISATION ASSETS
- Cartes déplacées vers phone/apps/tcg/cards/
- tags.csv déplacé vers phone/apps/tcg/
- Bordures dans phone/apps/tcg/borders/
- Badges dans phone/apps/tcg/badges/
- Structure unifiée sous phone/apps/tcg/
 
🔧 TECHNIQUE
- schema.prisma : ajout archetype sur tcg_card, protected sur tcg_user_card, tcg_border model
- Daily claim passé de 2 à 3 cartes/jour
- Fix: archétypes NULL en BDD (colonne manquante dans schema.prisma)
- Fix: bordures non créées (model tcg_border manquant dans Prisma)
 
 
============================================================
  FICHIERS MODIFIÉS
============================================================
 
NUI (src/nui/components/Phone/apps/tcg/) :
  - pages/TcgProfile.tsx      ← avatar, bordure, badges, bio, suppression contact
  - pages/TcgHome.tsx          ← bouton "Mon Profil"
  - pages/TcgContacts.tsx      ← avatars dans la liste
  - pages/TcgShowcase.tsx      ← avatar + layout refait
  - pages/TcgCollection.tsx    ← archétype affiché, bouton rouge filtre
  - pages/TcgContactCollection.tsx ← idem collection contact
  - hooks/useTcg.ts            ← hooks avatar, border, bio
 
Shared (src/shared/) :
  - tcg/tcg.types.ts           ← TcgShowcaseItem.avatar, TcgBorderData, avatar types
  - event/nui.ts               ← +3 events (SetAvatar, RemoveAvatar, SetBorder)
  - rpc.ts                     ← +3 events RPC correspondants
 
Client :
  - phone/apps/phone.app.tcg.provider.ts ← handlers avatar, border
 
Serveur (src/server/tcg/) :
  - tcg.provider.ts            ← RPC avatar, border
  - tcg.service.ts             ← avatar, border, SMS refus/annulation, showcase avatars
  - tcg.repository.ts          ← getAvatarsByCitizenIds, borders, avatar methods
  - tcg.migration.provider.ts  ← chemins assets réorganisés, sync borders, badges
 
Prisma :
  - prisma/schema.prisma       ← archetype, protected, tcg_border model



## ✨ Améliorations possibles

### ✨ Système de rareté
- Introduction de niveaux de rareté (Common, Rare, Epic, Legendary, etc.)
- Possibilité d’effets visuels différenciants :
  - Bordures
  - Couleurs (Carte chromatique, etc)


---

## 🧭 Axes économiques possibles

### 🏛️ Application appartenant à l'État

- Vente de cartes directement via l’application

- Prix fixés par l’État :
  - Sert de référence pour le marché joueur ↔ joueur

- Mise en place d’une taxe sur les transactions :
  - Taxe appliquée lors des échanges monétaires entre joueurs
  - Sink économique pour réguler l’inflation

- Contrôle global :
  - Permet d’éviter les dérives de prix
  - Cadre RP cohérent avec une économie régulée

---

### 🏢 Application gérée par une entreprise privée

- Exploitation commerciale de l’application TCG

- Nécessité de proposer des services complémentaires :
  - Événements spéciaux
  - Packs exclusifs
  - Offres limitées

- Système de prix :
  - Fixé par l’entreprise
  - Peut évoluer dynamiquement selon la demande

- Taxation des échanges :
  - Commission prélevée par l’entreprise
  - Source de revenus directe

- Dynamique de marché :
  - Plus libre, potentiellement plus volatile
  - Encourage la spéculation et le trading actif

Mes cartes sont disponibles ici https://github.com/DailyMok/SOZ-FiveM-Assets
