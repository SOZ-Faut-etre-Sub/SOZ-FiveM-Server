Fork Initial : SOZ-FiveM-Server ft dAIly

##Ajout

+ Application TCG

## 🖹 Description

Nouvelle application téléphone permettant aux joueurs de collectionner, échanger et exposer des cartes uniques directement depuis leur téléphone in-game.

⚠️- Actuellement +1000 cartes disponibles généré aléatoirement (à l'aide d'une database de prompt détaillé à la fin) par workflow ComfyUI utilisant un LoRA entrainé par mes soins (exemples à la suite). 

---

## 🖼️ Fonctionnalités actuelles 

### 📦 Collection & Cartes quotidiennes
- 2 cartes gratuites par jour (variable modifiable) parmis les cartes disponibles. (stress -2)
- Collection personnelle consultable avec viewer plein écran du phone
- Définir une carte comme fond d'écran du téléphone tant que la carte est possédé

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

### ✨ Système de rareté
- Introduction de niveaux de rareté (Common, Rare, Epic, Legendary, etc.)
- Possibilité d’effets visuels différenciants :
  - Bordures
  - Couleurs (Carte chromatique, etc)

### 📚 Système de collection
- Ajout d’un système de progression lié à la collection :
  - % de complétion globale
  - Collections thématiques (sets)

- Récompenses liées à la complétion :
  - Bonus cosmétiques
  - Cartes exclusives

- Incitation à l’échange pour compléter les collections

### 🏆 Système de trophées
- Ajout d’objectifs / achievements :
  - Nombre de cartes possédées
  - Nombre d’échanges réalisés
  - Complétion de sets spécifiques

- Récompenses associées :
  - Titres visibles
  - Badges
  - Cartes spéciales

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

 ## 🎰 Prompt 
Le prompting est réalisé via un nœud custom crée par mes soins pour ComfyUI, qui vient se servir dans un .csv et sélectionné aléatoirement (enfaite c'est définie par une seed, donc par exemple le nombre 1000 donnera systématiquement le même prompt tant que le csv est inchangé) une valeur par colonne choisis. 
Sur une RTX 4080 la vitesse de génération est de 3img/min. Le post traitement (redimensionnement pour coller au format du phone, ajout du cadre et logo, conversion en .webp) n'a pas été mesuré mais est négligeable.

Pour ce projet TCG j'utilise ce type de variable : 

- [Ethnie] par exemple : Korean, East African, Easter European ,etc ... (Aucune n'est exclue)
- [Genre + Coupe de cheveux] : man with short dreadlocks hairstyle, woman with Long hairstyle, etc ... (Le fait que le nombre de coupe de cheveux féminine est nettement supérieur, le pourcentage d'homme sortie est nettement inférieur actuellement)
- [Physionomie] : slim body, fit body, curvy body, etc ... (Aucun n'est exclu)
- [Couleur d'yeux] : Ici sont utilisés de nombreuses couleurs "peu réaliste" tel que heterochromia pink and purple eyes, ainsi que les couleurs "plus conventionnelles" 
- [Couleur de cheveux] : Similaires au yeux, de nombreuses couleurs "peu conventionnelles" sont présentes
- [Pose] : Peu de variation de pose afin de garder l'esprit "Portrait" et limité les erreurs
- [Expression Faciale] : Peu de variation d'expressions afin de garder l'esprit "Portrait" et limité les erreurs
- [Archétype] : Des "archétypes" ont compilés spécialement pour le projet afin de garder une cohérence dans le portrait, tel que : wearing a hoodie and sneakers, standing in a dim urban alley, wearing a hotel staff uniform, standing in a luxurious lobby, etc....
- [Bonus] : Ajout de 20% de chance pour un bonus au hasard : ange/démon/elf/catears/foxears/wolfears parceque UwU

Actuellement les prompts sont sauvegardé sur un fichier text et sur un discord perso : il est possible de connecter la sortie du workflow a un webhook discord qui transmet toute les images généré avec les infos souhaité dans un channel.
En cas de souhait de vouloir implanté un système de rareté/note de carte qui serait définit par des membres de la communauté, ou de les nommé/catégorisé, ca rend la tache de partage automatique.

Exemples de cartes : 

![963](https://github.com/user-attachments/assets/49834b6b-61a5-4424-aabc-b09dfbf81a8b)
![1101](https://github.com/user-attachments/assets/3a01c694-31b4-447b-b261-4a3ea603c988)
![127](https://github.com/user-attachments/assets/bdcfccdf-6064-4cda-9591-0162e6f3a031)
