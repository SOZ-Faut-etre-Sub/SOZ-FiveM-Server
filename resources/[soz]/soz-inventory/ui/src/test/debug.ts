import { NuiEventPlayerInventory } from '../types/event';

export const debugPlayerInventory: NuiEventPlayerInventory = {
    action: "openPlayerInventory",
    playerMoney: 5000,
    playerInventory: {
        "label": "Arthur Price",
        "users": [],
        "type": "player",
        "time": 1670166782,
        "owner": "TLY79462",
        "weight": 7900,
        "slots": 10000,
        "datastore": false,
        "maxWeight": 20000,
        "id": "1",
        "changed": false,
        "items": [
            {
                "description": "Pour retrouver ton chez toi !",
                "amount": 1,
                "shouldClose": true,
                "name": "house_map",
                "unique": true,
                "slot": 1,
                "type": "item",
                "weight": 100,
                "useable": false,
                "label": "Carte des habitations"
            },
            {
                "description": "Un revolver classique, de quoi se sentir un peu cowboy.",
                "amount": 1,
                "name": "weapon_revolver",
                "useable": false,
                "slot": 2,
                "type": "weapon",
                "weight": 2000,
                "label": "Revolver",
                "metadata": {
                    "health": 2000,
                    "ammo": 32,
                    "tint": 5,
                    "serial": "12xaA0fF703OfvJ",
                    "attachments": {
                        "clip": "COMPONENT_REVOLVER_CLIP_01"
                    },
                    "maxHealth": 2000
                },
                "unique": true
            },
            {
                "description": "Arme électrique de corps à corps, causant une paralysie.",
                "amount": 1,
                "name": "weapon_stungun",
                "useable": false,
                "slot": 3,
                "type": "weapon",
                "weight": 500,
                "label": "Taser",
                "metadata": {
                    "health": 2000,
                    "ammo": -1,
                    "serial": "32UZw1fM961miqn",
                    "maxHealth": 2000
                },
                "unique": true
            },
            {
                "description": "Trouve ton chemin facilement !",
                "amount": 1,
                "shouldClose": true,
                "name": "gps",
                "unique": true,
                "slot": 4,
                "type": "item",
                "weight": 200,
                "useable": false,
                "label": "GPS"
            },
            {
                "description": "Peut servir pour parler a une foule... A déjà permis de faire plusieurs exploits mondiaux",
                "amount": 1,
                "shouldClose": true,
                "name": "megaphone",
                "unique": false,
                "slot": 5,
                "type": "item",
                "weight": 1000,
                "useable": true,
                "label": "Mégaphone"
            },
            {
                "description": "Un poing en métal.",
                "amount": 1,
                "name": "weapon_knuckle",
                "useable": false,
                "slot": 6,
                "type": "weapon",
                "weight": 500,
                "label": "Poing americain",
                "metadata": {
                    "health": 2000,
                    "ammo": 0,
                    "serial": "15Ytp6QG564HOzh",
                    "maxHealth": 2000
                },
                "unique": true
            },
            {
                "description": "Arme de prédilection des officiers de police.",
                "amount": 1,
                "name": "weapon_nightstick",
                "useable": false,
                "slot": 7,
                "type": "weapon",
                "weight": 500,
                "label": "Matraque",
                "metadata": {
                    "health": 2000,
                    "ammo": 0,
                    "serial": "89SPe1gK628TmBt",
                    "maxHealth": 2000
                },
                "unique": true
            },
            {
                "description": "Pour surveiller des oiseaux... Ou espionner des voisins.",
                "amount": 1,
                "shouldClose": true,
                "name": "binoculars",
                "unique": false,
                "slot": 8,
                "type": "item",
                "weight": 2000,
                "useable": true,
                "label": "Jumelles"
            },
            {
                "description": "Munitions pour pistolets.",
                "amount": 1,
                "shouldClose": true,
                "name": "pistol_ammo",
                "unique": false,
                "slot": 9,
                "type": "weapon_ammo",
                "weight": 500,
                "useable": true,
                "label": "Munition de Pistolet"
            },
            {
                "description": "Alooo ?",
                "amount": 1,
                "shouldClose": true,
                "name": "radio",
                "unique": false,
                "slot": 12,
                "type": "item",
                "weight": 500,
                "useable": true,
                "label": "Radio"
            },
            {
                "description": "Pour ne jamais perdre le Nord !",
                "amount": 1,
                "shouldClose": true,
                "name": "compass",
                "unique": true,
                "slot": 15,
                "type": "item",
                "weight": 100,
                "useable": false,
                "label": "Boussole"
            }
        ]
    }
}

export const debugStorageInventory: NuiEventPlayerInventory = {
    action: "openInventory",
    playerMoney: 5000,
    playerInventory: {
        "label": "Arthur Price",
        "users": [],
        "type": "player",
        "time": 1670166782,
        "owner": "TLY79462",
        "weight": 7900,
        "slots": 10000,
        "datastore": false,
        "maxWeight": 20000,
        "id": "1",
        "changed": false,
        "items": [
            {
                "description": "Pour retrouver ton chez toi !",
                "amount": 1,
                "shouldClose": true,
                "name": "house_map",
                "unique": true,
                "slot": 1,
                "type": "item",
                "weight": 100,
                "useable": false,
                "label": "Carte des habitations"
            },
            {
                "description": "Un revolver classique, de quoi se sentir un peu cowboy.",
                "amount": 1,
                "name": "weapon_revolver",
                "useable": false,
                "slot": 2,
                "type": "weapon",
                "weight": 2000,
                "label": "Revolver",
                "metadata": {
                    "health": 2000,
                    "ammo": 32,
                    "tint": 5,
                    "serial": "12xaA0fF703OfvJ",
                    "attachments": {
                        "clip": "COMPONENT_REVOLVER_CLIP_01"
                    },
                    "maxHealth": 2000
                },
                "unique": true
            },
            {
                "description": "Arme électrique de corps à corps, causant une paralysie.",
                "amount": 1,
                "name": "weapon_stungun",
                "useable": false,
                "slot": 3,
                "type": "weapon",
                "weight": 500,
                "label": "Taser",
                "metadata": {
                    "health": 2000,
                    "ammo": -1,
                    "serial": "32UZw1fM961miqn",
                    "maxHealth": 2000
                },
                "unique": true
            },
            {
                "description": "Trouve ton chemin facilement !",
                "amount": 1,
                "shouldClose": true,
                "name": "gps",
                "unique": true,
                "slot": 4,
                "type": "item",
                "weight": 200,
                "useable": false,
                "label": "GPS"
            },
            {
                "description": "Peut servir pour parler a une foule... A déjà permis de faire plusieurs exploits mondiaux",
                "amount": 1,
                "shouldClose": true,
                "name": "megaphone",
                "unique": false,
                "slot": 5,
                "type": "item",
                "weight": 1000,
                "useable": true,
                "label": "Mégaphone"
            },
            {
                "description": "Un poing en métal.",
                "amount": 1,
                "name": "weapon_knuckle",
                "useable": false,
                "slot": 6,
                "type": "weapon",
                "weight": 500,
                "label": "Poing americain",
                "metadata": {
                    "health": 2000,
                    "ammo": 0,
                    "serial": "15Ytp6QG564HOzh",
                    "maxHealth": 2000
                },
                "unique": true
            },
            {
                "description": "Arme de prédilection des officiers de police.",
                "amount": 1,
                "name": "weapon_nightstick",
                "useable": false,
                "slot": 7,
                "type": "weapon",
                "weight": 500,
                "label": "Matraque",
                "metadata": {
                    "health": 2000,
                    "ammo": 0,
                    "serial": "89SPe1gK628TmBt",
                    "maxHealth": 2000
                },
                "unique": true
            },
            {
                "description": "Pour surveiller des oiseaux... Ou espionner des voisins.",
                "amount": 1,
                "shouldClose": true,
                "name": "binoculars",
                "unique": false,
                "slot": 8,
                "type": "item",
                "weight": 2000,
                "useable": true,
                "label": "Jumelles"
            },
            {
                "description": "Munitions pour pistolets.",
                "amount": 1,
                "shouldClose": true,
                "name": "pistol_ammo",
                "unique": false,
                "slot": 9,
                "type": "weapon_ammo",
                "weight": 500,
                "useable": true,
                "label": "Munition de Pistolet"
            },
            {
                "description": "Alooo ?",
                "amount": 1,
                "shouldClose": true,
                "name": "radio",
                "unique": false,
                "slot": 12,
                "type": "item",
                "weight": 500,
                "useable": true,
                "label": "Radio"
            },
            {
                "description": "Pour ne jamais perdre le Nord !",
                "amount": 1,
                "shouldClose": true,
                "name": "compass",
                "unique": true,
                "slot": 15,
                "type": "item",
                "weight": 100,
                "useable": false,
                "label": "Boussole"
            }
        ]
    },
    targetInventory: {
        "label": "Arthur Price",
        "users": [],
        "type": "fridge",
        "time": 1670166782,
        "owner": "TLY79462",
        "weight": 7900,
        "slots": 10000,
        "datastore": false,
        "maxWeight": 20000,
        "id": "1",
        "changed": false,
        "items": [
            {
                "description": "Pour retrouver ton chez toi !",
                "amount": 1,
                "shouldClose": true,
                "name": "house_map",
                "unique": true,
                "slot": 1,
                "type": "item",
                "weight": 100,
                "useable": false,
                "label": "Carte des habitations"
            },
            {
                "description": "Un revolver classique, de quoi se sentir un peu cowboy.",
                "amount": 1,
                "name": "weapon_revolver",
                "useable": false,
                "slot": 2,
                "type": "weapon",
                "weight": 2000,
                "label": "Revolver",
                "metadata": {
                    "health": 2000,
                    "ammo": 32,
                    "tint": 5,
                    "serial": "12xaA0fF703OfvJ",
                    "attachments": {
                        "clip": "COMPONENT_REVOLVER_CLIP_01"
                    },
                    "maxHealth": 2000
                },
                "unique": true
            },
            {
                "description": "Arme électrique de corps à corps, causant une paralysie.",
                "amount": 1,
                "name": "weapon_stungun",
                "useable": false,
                "slot": 3,
                "type": "weapon",
                "weight": 500,
                "label": "Taser",
                "metadata": {
                    "health": 2000,
                    "ammo": -1,
                    "serial": "32UZw1fM961miqn",
                    "maxHealth": 2000
                },
                "unique": true
            },
            {
                "description": "Trouve ton chemin facilement !",
                "amount": 1,
                "shouldClose": true,
                "name": "gps",
                "unique": true,
                "slot": 4,
                "type": "item",
                "weight": 200,
                "useable": false,
                "label": "GPS"
            },
            {
                "description": "Peut servir pour parler a une foule... A déjà permis de faire plusieurs exploits mondiaux",
                "amount": 1,
                "shouldClose": true,
                "name": "megaphone",
                "unique": false,
                "slot": 5,
                "type": "item",
                "weight": 1000,
                "useable": true,
                "label": "Mégaphone"
            },
            {
                "description": "Un poing en métal.",
                "amount": 1,
                "name": "weapon_knuckle",
                "useable": false,
                "slot": 6,
                "type": "weapon",
                "weight": 500,
                "label": "Poing americain",
                "metadata": {
                    "health": 2000,
                    "ammo": 0,
                    "serial": "15Ytp6QG564HOzh",
                    "maxHealth": 2000
                },
                "unique": true
            },
            {
                "description": "Arme de prédilection des officiers de police.",
                "amount": 1,
                "name": "weapon_nightstick",
                "useable": false,
                "slot": 7,
                "type": "weapon",
                "weight": 500,
                "label": "Matraque",
                "metadata": {
                    "health": 2000,
                    "ammo": 0,
                    "serial": "89SPe1gK628TmBt",
                    "maxHealth": 2000
                },
                "unique": true
            },
            {
                "description": "Pour surveiller des oiseaux... Ou espionner des voisins.",
                "amount": 1,
                "shouldClose": true,
                "name": "binoculars",
                "unique": false,
                "slot": 8,
                "type": "item",
                "weight": 2000,
                "useable": true,
                "label": "Jumelles"
            },
            {
                "description": "Munitions pour pistolets.",
                "amount": 1,
                "shouldClose": true,
                "name": "pistol_ammo",
                "unique": false,
                "slot": 9,
                "type": "weapon_ammo",
                "weight": 500,
                "useable": true,
                "label": "Munition de Pistolet"
            },
            {
                "description": "Alooo ?",
                "amount": 1,
                "shouldClose": true,
                "name": "radio",
                "unique": false,
                "slot": 12,
                "type": "item",
                "weight": 500,
                "useable": true,
                "label": "Radio"
            },
            {
                "description": "Pour ne jamais perdre le Nord !",
                "amount": 1,
                "shouldClose": true,
                "name": "compass",
                "unique": true,
                "slot": 15,
                "type": "item",
                "weight": 100,
                "useable": false,
                "label": "Boussole"
            }
        ]
    },
}
