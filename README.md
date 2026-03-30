Fork Initial : SOZ-FiveM-Server ft dAIly

# 🃏 TCG v2.0 — Économie & Refonte UX - Patch Notes (30/03/2026)

## 💰 Économie

- Compte bancaire TCG Service (tcg-service) — compte business avec 10M$ initial, créé automatiquement au démarrage
- Taxe 7% sur les échanges argent — déduite automatiquement, versée sur le compte TCG Service. Le sender paie le brut, le receiver reçoit le net. Affichée clairement dans la liste des échanges (brut / taxe / net) et dans la popup de proposition ("7% de taxe sera prélevée")
- Pack hebdomadaire — 7 cartes aléatoires du pool libre. 50 000$ le premier de la semaine, 250 000$ les suivants. Reset chaque lundi. Paiement vers le compte TCG Service
- Revente de set avec prix variable — prix par archétype lu depuis set_prices.csv (RARE = 313 578,COMMUNE=100000, COMMUNE = 100 000
,COMMUNE=100000). L'argent est versé depuis le compte TCG Service vers le joueur

- Page "Cours" — classement des 28 archétypes du plus rare au plus commun, avec prix de rachat et tiers de rareté (RARE / À surveiller / COMMUNE)

## 🎨 Refonte UX complète

- Nouveau header — Logo TCG (retour accueil) + icône carte avec double bulle de notifications (verte = cartes gratuites, rouge = échanges en attente) + icône Cours + icône Contacts
- 3 onglets style Twitter — Vitrine Globale / Vitrine Contacts / Mon Profil. La vitrine est maintenant intégrée à la page d'accueil avec scroll et bouton refresh
- Vitrine Contacts — affiche uniquement les cartes exposées par vos contacts acceptés
- Page Hub — regroupe claim, pack hebdo, vente de set et liste des échanges sur une seule page (accessible via l'icône carte)
- Vitrine passe à 4 cartes — grille 4 colonnes avec descriptions visibles sous chaque carte
- Popup de remplacement — quand la vitrine est pleine (4/4), un popup permet de choisir quelle carte retirer avant d'en ajouter une nouvelle
- "Mise en Vitrine" remplace "Exposer" dans le viewer pour plus de clarté
- Protéger/Protégée déplacé en haut droite du viewer (à gauche de la croix)

## 🔍 Recherche & Navigation

- Recherche par n° ou nom de carte — icône loupe dans Ma Collection et Sa Collection
- Recherche par n° de carte dans le sélecteur d'avatar du profil
- Noms cliquables vers le profil public dans les contacts, y compris les demandes en attente (envoyées et reçues)
- Avatar centré dans les barres titre des pages collection (clic = retour au profil)
- Bouton "Ma Collection" / "Sa Collection" à droite de l'avatar dans les pages profil
- "Proposer un échange" remplace "Proposer" dans la collection d'un contact

## 🏅 Profil amélioré

- Badges agrandis — grille 3 colonnes, taille maximale possible
- Onglet Mon Profil complet avec avatar, bio, vitrine, badges et bouton "Éditer mon profil"
- Plus de titre "Profil" affiché (superflu)
- Profil d'un contact : seul le bouton rouge "Supprimer des contacts" reste en bas (l'accès collection est via le bouton à côté de l'avatar)

## 🔧 Technique

- 3 nouvelles tables BDD : tcg_set_price, tcg_weekly_pack, compte tcg-service dans bank_accounts
- Re-tag automatique des archétypes NULL depuis tags.csv à chaque démarrage
- Sync des prix depuis set_prices.csv à chaque démarrage (upsert)
- Contraste mode clair amélioré (textShadow sur les textes principaux)
- TcgShowcase.tsx et TcgTrades.tsx supprimés (intégrés dans TcgHome et TcgHub)
- Nouveau fichier asset requis : set_prices.csv dans le dossier TCG assets

## TCG v1.5 — Patch Notes (29/03/2026)

 
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


## TCG v1.5 — Patch Notes (29/03/2026)

 
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

## 25.03.20206 V1.0

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
 
 


## ✨ Améliorations possibles


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
