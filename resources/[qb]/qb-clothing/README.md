# qb-clothing
Clothing for QB-Core Framework :dress:

# License

    QBCore Framework
    Copyright (C) 2021 Joshua Eger

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>

## Dependencies
- [qb-core](https://github.com/qbcore-framework/qb-core)

## Screenshots
![Character Section](https://imgur.com/lqJ0QCV.png)
![Features Section](https://imgur.com/8Ipc1ej.png)
![Accessories Section](https://imgur.com/t7zMlve.png)
![Upper Body Camera Angle](https://imgur.com/hwaqJul.png)
![Body Camera Angle](https://imgur.com/4vrH3jQ.png)
![Lower Body Camera Angle](https://imgur.com/IPqymXf.png)

## Features
- Configurable Ped Selection
- Detailed nose, chin, jaw, cheek etc. configuration
- Camera Rotating
- 3 Different Camera Angles
- Clothing Stores
- Barbers
- Job Locker Rooms (Configurable Outfit Presets)
- Saveable Outfits
- /hat, /glasses, /mask (See the commands section below)

### Commands
- /skin (Admin Only) - Opens the clothing menu
- /hat - Toggles the hat on/off
- /mask - Toggles the hmaskat on/off
- /glasses - Toggles the glasses on/off

## Installation
### Manual
- Download the script and put it in the `[qb]` directory.
- Import `qb-clothing.sql` in your database
- Add the following code to your server.cfg/resouces.cfg
```
ensure qb-core
ensure qb-clothing
```

## Configuration
```
Config = Config or {}

Config.WomanPlayerModels = { -- Available peds for woman players.
    'mp_f_freemode_01',
}
    
Config.ManPlayerModels = { -- Available peds for man players.
    'mp_m_freemode_01',
}

Config.LoadedManModels = {} -- Don't touch
Config.LoadedWomanModels = {} -- Don't touch

Config.Stores = {
    [1] =   {shopType = "clothing", x = 1693.32,      y = 4823.48,     z = 41.06}, -- Clothing Store Locations
	[2] =   {shopType = "clothing", x = -712.215881,  y = -155.352982, z = 37.4151268},
	[3] =   {shopType = "clothing", x = -1192.94495,  y = -772.688965, z = 17.3255997},
	[4] =   {shopType = "clothing", x =  425.236,     y = -806.008,    z = 28.491},
	[5] =   {shopType = "clothing", x = -162.658,     y = -303.397,    z = 38.733},
	[6] =   {shopType = "clothing", x = 75.950,       y = -1392.891,   z = 28.376},
	[7] =   {shopType = "clothing", x = -822.194,     y = -1074.134,   z = 10.328},
	[8] =   {shopType = "clothing", x = -1450.711,    y = -236.83,     z = 48.809},
	[9] =   {shopType = "clothing", x = 4.254,        y = 6512.813,    z = 30.877},
	[10] =  {shopType = "clothing", x = 615.180,      y = 2762.933,    z = 41.088},
	[11] =  {shopType = "clothing", x = 1196.785,     y = 2709.558,    z = 37.222},
	[12] =  {shopType = "clothing", x = -3171.453,    y = 1043.857,    z = 19.863},
	[13] =  {shopType = "clothing", x = -1100.959,    y = 2710.211,    z = 18.107},
	[14] =  {shopType = "clothing", x = -1207.65,     y = -1456.88,    z = 4.3784737586975},
    [15] =  {shopType = "clothing", x = 121.76,       y = -224.6,      z = 53.56}, -- Barber Locations
	[16] =  {shopType = "barber",   x = -814.3,       y = -183.8,      z = 36.6},
	[17] =  {shopType = "barber",   x = 136.8,        y = -1708.4,     z = 28.3},
	[18] =  {shopType = "barber",   x = -1282.6,      y = -1116.8,     z = 6.0},
	[19] =  {shopType = "barber",   x = 1931.5,       y = 3729.7,      z = 31.8},
	[20] =  {shopType = "barber",   x = 1212.8,       y = -472.9,      z = 65.2},
	[21] =  {shopType = "barber",   x = -32.9,        y = -152.3,      z = 56.1},
	[22] =  {shopType = "barber",   x = -278.1,       y = 6228.5,      z = 30.7}
}

Config.ClothingRooms = { -- Job Based Locker Room Locations
    [1] = {requiredJob = "police", x = 1105.71, y = 115.26, z = 18.15, cameraLocation = {x = 1108.44, y = 115.43, z = 18.15, h = 92.24}},
    [2] = {requiredJob = "doctor", x = 1462.64, y = 693.23, z = 33.51, cameraLocation = {x = 1462.76, y = 695.59, z = 33.51, h = 175.01}},
    [3] = {requiredJob = "ambulance", x = 1462.64, y = 693.23, z = 33.51, cameraLocation = {x = 1462.76, y = 695.59, z = 33.51, h = 175.01}},
    [4] = {requiredJob = "police", x = 314.76, y = 671.78, z = 14.73, cameraLocation = {x = 317.62, y = 671.86, z = 14.73, h = 91.53}},
    [5] = {requiredJob = "ambulance", x = 338.70, y = 659.61, z = 14.71, cameraLocation = {x = 339.27, y = 661.63, z = 14.71, h = 315.5}},    
    [6] = {requiredJob = "doctor", x = 338.70, y = 659.61, z = 14.71, cameraLocation = {x = 339.27, y = 661.63, z = 14.71, h = 315.5}}, 
	[7] = {requiredJob = "ambulance", x = -1098.45, y = 1751.71, z = 23.35, cameraLocation = {x = -1097.15, y = 1750.19, z = 23.35, h = 38.70}},    
    [8] = {requiredJob = "doctor", x = -1098.45, y = 1751.71, z = 23.35, cameraLocation = {x = -1097.15, y = 1750.19, z = 23.35, h = 38.70}},
	[9] = {requiredJob = "police", x = -77.59, y = -129.17, z = 5.03, cameraLocation = {x = -80.36, y = -130.76, z = 5.03, h = 300.44}},
}

Config.Outfits = {
    ["police"] = {
        ["male"] = { -- Outfits for male players
            [1] = {
                outfitLabel = "short sleeve ", -- Will be shown at list
                outfitData = { -- Clothing details for outfit presets.
                    ["pants"]       = { item = 95, texture = 0},  -- PANTS
                    ["arms"]        = { item = 0, texture = 0},  -- ArmS
                    ["t-shirt"]     = { item = 58, texture = 0},  -- T Shirt
                    ["vest"]        = { item = 27, texture = 0},  -- VEST
                    ["torso2"]      = { item = 247, texture = 0},  -- JACKET
                    ["shoes"]       = { item = 51, texture = 0},  -- SHOES
                    -- ["decals"]      = { item = 7, texture = 0},  -- Decals
                    ["accessory"]   = { item = 6, texture = 0},  -- Neck
                    ["bag"]         = { item = 73, texture = 0},  -- BAG
                    ["hat"]         = { item = -1, texture = -1},  -- HAT
                    ["glass"]       = { item = 0, texture = 0},  -- GLASSES
            --      ["ear"]         = { item = 0, texture = 0},  -- EAR accessoires
                    ["mask"]        = { item = 141, texture = 0},  -- MASK
                },
            },
            [2] = {
                outfitLabel = "Long sleeve",
                outfitData = {
                    ["pants"]       = { item = 95, texture = 0},  -- Broek
                    ["arms"]        = { item = 1, texture = 0},  -- Armen
                    ["t-shirt"]     = { item = 55, texture = 0},  -- T Shirt
                    ["vest"]        = { item = 27, texture = 0},  -- Body Vest
                    ["torso2"]      = { item = 243, texture = 0},  -- Jas / Vesten
                    ["shoes"]       = { item = 51, texture = 0},  -- Schoenen
                    -- ["decals"]      = { item = 7, texture = 0},  -- Decals
                    ["accessory"]   = { item = 1, texture = 0},  -- Nek / Das
                    ["bag"]         = { item = 73, texture = 0},  -- Tas
                    ["hat"]         = { item = -1, texture = -1},  -- Pet
                    ["glass"]       = { item = 0, texture = 0},  -- Bril
            --      ["ear"]         = { item = 0, texture = 0},  -- Oor accessoires
                    ["mask"]         = { item = 141, texture = 0},  -- Masker
                },
            },
            [3] = {
                outfitLabel = "Trooper Tan",
                outfitData = {
                    ["pants"]       = { item = 95, texture = 0},  -- Broek
                    ["arms"]        = { item = 1, texture = 0},  -- Armen
                    ["t-shirt"]     = { item = 57, texture = 0},  -- T Shirt
                    ["vest"]        = { item = 27, texture = 0},  -- Body Vest
                    ["torso2"]      = { item = 248, texture = 1},  -- Jas / Vesten
                    ["shoes"]       = { item = 51, texture = 0},  -- Schoenen
                    -- ["decals"]      = { item = 7, texture = 0},  -- Decals
                    ["accessory"]   = { item = 6, texture = 0},  -- Nek / Das
                    ["bag"]         = { item = 73, texture = 0},  -- Tas
                    ["hat"]         = { item = 13, texture = 0},  -- Pet
                    ["glass"]       = { item = 0, texture = 0},  -- Bril
            --      ["ear"]         = { item = 0, texture = 0},  -- Oor accessoires
                    ["mask"]         = { item = 141, texture = 0},  -- Masker
                },
            },
            [4] = {
                outfitLabel = "Trooper Black",
                outfitData = {
                    ["pants"]       = { item = 95, texture = 0},  -- Broek
                    ["arms"]        = { item = 1, texture = 0},  -- Armen
                    ["t-shirt"]     = { item = 55, texture = 0},  -- T Shirt
                    ["vest"]        = { item = 27, texture = 0},  -- Body Vest
                    ["torso2"]      = { item = 248, texture = 0},  -- Jas / Vesten
                    ["shoes"]       = { item = 51, texture = 0},  -- Schoenen
                    -- ["decals"]      = { item = 7, texture = 0},  -- Decals
                    ["accessory"]   = { item = 1, texture = 0},  -- Nek / Das
                    ["bag"]         = { item = 73, texture = 0},  -- Tas
                    ["hat"]         = { item = 13, texture = 0},  -- Pet
                    ["glass"]       = { item = 0, texture = 0},  -- Bril
            --      ["ear"]         = { item = 0, texture = 0},  -- Oor accessoires
                    ["mask"]         = { item = 141, texture = 0},  -- Masker
                },
            },
            [5] = {
                outfitLabel = "Jacket",
                outfitData = {
                    ["pants"]       = { item = 95, texture = 0},  -- Broek
                    ["arms"]        = { item = 1, texture = 0},  -- Armen
                    ["t-shirt"]     = { item = 107, texture = 0},  -- T Shirt
                    ["vest"]        = { item = 0, texture = 0},  -- Body Vest
                    ["torso2"]      = { item = 244, texture = 0},  -- Jas / Vesten
                    ["shoes"]       = { item = 51, texture = 0},  -- Schoenen
                    -- ["decals"]      = { item = 7, texture = 0},  -- Decals
                    ["accessory"]   = { item = 1, texture = 0},  -- Nek / Das
                    ["bag"]         = { item = 0, texture = 0},  -- Tas
                    ["hat"]         = { item = 9, texture = 0},  -- Pet
                    ["glass"]       = { item = 0, texture = 0},  -- Bril
            --      ["ear"]         = { item = 0, texture = 0},  -- Oor accessoires
                    ["mask"]         = { item = 127, texture = 0},  -- Masker
                },
            },
            [6] = {
                outfitLabel = "Swat",
                outfitData = {
                    ["pants"]       = { item = 31, texture = 2},  -- Broek
                    ["arms"]        = { item = 17, texture = 0},  -- Armen
                    ["t-shirt"]     = { item = 15, texture = 0},  -- T Shirt
                    ["vest"]        = { item = 27, texture = 0},  -- Body Vest
                    ["torso2"]      = { item = 49, texture = 2},  -- Jas / Vesten
                    ["shoes"]       = { item = 24, texture = 0},  -- Schoenen
                    -- ["decals"]      = { item = 7, texture = 0},  -- Decals
                    ["accessory"]   = { item = 1, texture = 0},  -- Nek / Das
            --      ["bag"]         = { item = 0, texture = 0},  -- Tas
                    ["hat"]         = { item = 39, texture = 2},  -- Pet
                    ["glass"]       = { item = 25, texture = 4},  -- Bril
            --      ["ear"]         = { item = 0, texture = 0},  -- Oor accessoires
                    ["mask"]         = { item = 72, texture = 0},  -- Masker
                },
            },
            [7] = {
                outfitLabel = "Cadet",
                outfitData = {
                    ["pants"]       = { item = 95, texture = 1},  -- Broek
                    ["arms"]        = { item = 11, texture = 0},  -- Armen
                    ["t-shirt"]     = { item = 57, texture = 0},  -- T Shirt
                    ["vest"]        = { item = 18, texture = 0},  -- Body Vest
                    ["torso2"]      = { item = 246, texture = 1},  -- Jas / Vesten
                    ["shoes"]       = { item = 25, texture = 0},  -- Schoenen
                    -- ["decals"]      = { item = 7, texture = 0},  -- Decals
                    ["accessory"]   = { item = 6, texture = 0},  -- Nek / Das
                    ["bag"]         = { item = 0, texture = 0},  -- Tas
                    ["hat"]         = { item = 9, texture = 0},  -- Pet
                    ["glass"]       = { item = 0, texture = 0},  -- Bril
            --      ["ear"]         = { item = 0, texture = 0},  -- Oor accessoires
                    ["mask"]         = { item = 141, texture = 0},  -- Masker
                },
            },
        },
        ["female"] = {
            [1] = {
                outfitLabel = "Short Sleeve",
                outfitData = {
                    ["pants"]       = { item = 105, texture = 0},  -- Broek
                    ["arms"]        = { item = 14, texture = 0},  -- Armen
                    ["t-shirt"]     = { item = 3, texture = 0},  -- T Shirt
                    ["vest"]        = { item = 34, texture = 0},  -- Body Vest
                    ["torso2"]      = { item = 266, texture = 0},  -- Jas / Vesten
                    ["shoes"]       = { item = 55, texture = 0},  -- Schoenen
                    -- ["decals"]      = { item = 0, texture = 0},  -- Decals
                    ["accessory"]   = { item = 8, texture = 0},  -- Nek / Das
                    ["bag"]         = { item = 0, texture = 0},  -- Tas
                    ["hat"]         = { item = 32, texture = 0},  -- Pet
                    ["glass"]       = { item = 0, texture = 0},  -- Bril
            --      ["ear"]         = { item = 0, texture = 0},  -- Oor accessoires
                    ["mask"]        = { item = 141, texture = 0},  -- Masker
                },
            },
            [2] = {
                outfitLabel = "Trooper Tan",
                outfitData = {
                    ["pants"]       = { item = 105, texture = 0},  -- Broek
                    ["arms"]        = { item = 14, texture = 0},  -- Armen
                    ["t-shirt"]     = { item = 3, texture = 0},  -- T Shirt
                    ["vest"]        = { item = 0, texture = 0},  -- Body Vest
                    ["torso2"]      = { item = 264, texture = 0},  -- Jas / Vesten
                    ["shoes"]       = { item = 55, texture = 0},  -- Schoenen
                    ["decals"]      = { item = 0, texture = 0},  -- Decals
                    ["accessory"]   = { item = 1, texture = 0},  -- Nek / Das
                    ["bag"]         = { item = 0, texture = 0},  -- Tas
                    ["hat"]         = { item = 13, texture = 2},  -- Pet
                    ["glass"]       = { item = 0, texture = 0},  -- Bril
            --      ["ear"]         = { item = 0, texture = 0},  -- Oor accessoires
                    ["mask"]        = { item = 141, texture = 0},  -- Masker
                },
            },
            [3] = {
                outfitLabel = "Trooper Black",
                outfitData = {
                    ["pants"]       = { item = 105, texture = 0},  -- Broek
                    ["arms"]        = { item = 14, texture = 0},  -- Armen
                    ["t-shirt"]     = { item = 3, texture = 0},  -- T Shirt
                    ["vest"]        = { item = 0, texture = 0},  -- Body Vest
                    ["torso2"]      = { item = 264, texture = 1},  -- Jas / Vesten
                    ["shoes"]       = { item = 55, texture = 0},  -- Schoenen
                    ["decals"]      = { item = 0, texture = 0},  -- Decals
                    ["accessory"]   = { item = 8, texture = 0},  -- Nek / Das
                    ["bag"]         = { item = 0, texture = 0},  -- Tas
                    ["hat"]         = { item = 13, texture = 2},  -- Pet
                    ["glass"]       = { item = 0, texture = 0},  -- Bril
            --      ["ear"]         = { item = 0, texture = 0},  -- Oor accessoires
                    ["mask"]        = { item = 141, texture = 0},  -- Masker
                },
            },
            [4] = {
                outfitLabel = "Swat",
                outfitData = {
                    ["pants"]       = { item = 30, texture = 2},  -- Broek
                    ["arms"]        = { item = 18, texture = 0},  -- Armen
                    ["t-shirt"]     = { item = 3, texture = 0},  -- T Shirt
                    ["vest"]        = { item = 34, texture = 0},  -- Body Vest
                    ["torso2"]      = { item = 230, texture = 20},  -- Jas / Vesten
                    ["shoes"]       = { item = 24, texture = 0},  -- Schoenen
                    ["decals"]      = { item = 0, texture = 0},  -- Decals
                    ["accessory"]   = { item = 1, texture = 0},  -- Nek / Das
                    ["bag"]         = { item = 0, texture = 0},  -- Tas
                    ["hat"]         = { item = 59, texture = 9},  -- Pet
                    ["glass"]       = { item = 27, texture = 4},  -- Bril
            --      ["ear"]         = { item = 0, texture = 0},  -- Oor accessoires
                    ["mask"]        = { item = 72, texture = 0},  -- Masker
                },
            },
            [5] = {
                outfitLabel = "Cadet",
                outfitData = {
                    ["pants"]       = { item = 105, texture = 1},  -- Broek
                    ["arms"]        = { item = 9, texture = 0},  -- Armen
                    ["t-shirt"]     = { item = 2, texture = 0},  -- T Shirt
                    ["vest"]        = { item = 19, texture = 0},  -- Body Vest
                    ["torso2"]      = { item = 265, texture = 1},  -- Jas / Vesten
                    ["shoes"]       = { item = 25, texture = 0},  -- Schoenen
                    ["decals"]      = { item = 0, texture = 0},  -- Decals
                    ["accessory"]   = { item = 8, texture = 0},  -- Nek / Das
                    ["bag"]         = { item = 0, texture = 0},  -- Tas
                    ["hat"]         = { item = 38, texture = 0},  -- Pet
                    ["glass"]       = { item = 0, texture = 0},  -- Bril
            --      ["ear"]         = { item = 0, texture = 0},  -- Oor accessoires
                    ["mask"]        = { item = 141, texture = 0},  -- Masker
                },
            },
        }
    },
    ["ambulance"] = {
        ["male"] = {
            [1] = {
                outfitLabel = "T-Shirt",
                outfitData = {
                    ["pants"]       = { item = 49,texture = 0},  -- Broek
                    ["arms"]        = { item = 85, texture = 0},  -- Armen
                    ["t-shirt"]     = { item = 88, texture = 0},  -- T Shirt
                    ["vest"]        = { item = 0, texture = 0},  -- Body Vest
                    ["torso2"]      = { item = 32, texture = 6},  -- Jas / Vesten
                    ["shoes"]       = { item = 25, texture = 0},  -- Schoenen
                    ["decals"]      = { item = 0, texture = 0},  -- Decals
                    ["accessory"]   = { item = 0, texture = 0},  -- Nek / Das
                    ["bag"]         = { item = 0, texture = 0},  -- Tas
                    ["hat"]         = { item = -1, texture = -1},  -- Pet
                    ["glass"]       = { item = 0, texture = 0},  -- Bril
                    ["ear"]         = { item = 0, texture = 0},  -- Oor accessoires
                    ["mask"]        = { item = 121, texture = 0},  -- Masker
                },
            },
            [2] = {
                outfitLabel = "Polo",
                outfitData = {
                    ["pants"]       = { item = 49,texture = 0},  -- Broek
                    ["arms"]        = { item = 85, texture = 0},  -- Armen
                    ["t-shirt"]     = { item = 88, texture = 0},  -- T Shirt
                    ["vest"]        = { item = 0, texture = 0},  -- Body Vest
                    ["torso2"]      = { item = 93, texture = 2},  -- Jas / Vesten
                    ["shoes"]       = { item = 25, texture = 0},  -- Schoenen
                    ["decals"]      = { item = 0, texture = 0},  -- Decals
                    ["accessory"]   = { item = 0, texture = 0},  -- Nek / Das
                    ["bag"]         = { item = 0, texture = 0},  -- Tas
                    ["hat"]         = { item = -1, texture = -1},  -- Pet
                    ["glass"]       = { item = 0, texture = 0},  -- Bril
                    ["ear"]         = { item = 0, texture = 0},  -- Oor accessoires
                    ["mask"]        = { item = 121, texture = 0},  -- Masker
                },
            },
			[3] = {
                outfitLabel = "Placeholder",
                outfitData = {
                    ["pants"]       = { item = 59,texture = 5},  -- Broek
                    ["arms"]        = { item = 86, texture = 0},  -- Armen
                    ["t-shirt"]     = { item = 135, texture = 0},  -- T Shirt
                    ["vest"]        = { item = 0, texture = 0},  -- Body Vest
                    ["torso2"]      = { item = 151, texture = 4},  -- Jas / Vesten
                    ["shoes"]       = { item = 25, texture = 0},  -- Schoenen
                    ["decals"]      = { item = 0, texture = 0},  -- Decals
                    ["accessory"]   = { item = 0, texture = 0},  -- Nek / Das
                    ["bag"]         = { item = 0, texture = 0},  -- Tas
                    ["hat"]         = { item = 79, texture = 0},  -- Pet
                    ["glass"]       = { item = 0, texture = 0},  -- Bril
                    ["ear"]         = { item = 0, texture = 0},  -- Oor accessoires
                    ["mask"]        = { item = 121, texture = 0},  -- Masker	
				},
			},
			[4] = {
                outfitLabel = "Placeholder",
                outfitData = {
                    ["pants"]       = { item = 49,texture = 0},  -- Broek
                    ["arms"]        = { item = 85, texture = 0},  -- Armen
                    ["t-shirt"]     = { item = 88, texture = 0},  -- T Shirt
                    ["vest"]        = { item = 18, texture = 0},  -- Body Vest
                    ["torso2"]      = { item = 32, texture = 6},  -- Jas / Vesten
                    ["shoes"]       = { item = 25, texture = 0},  -- Schoenen
                    ["decals"]      = { item = 0, texture = 0},  -- Decals
                    ["accessory"]   = { item = 0, texture = 0},  -- Nek / Das
                    ["bag"]         = { item = 0, texture = 0},  -- Tas
                    ["hat"]         = { item = -1, texture = -1},  -- Pet
                    ["glass"]       = { item = 0, texture = 0},  -- Bril
                    ["ear"]         = { item = 0, texture = 0},  -- Oor accessoires
                    ["mask"]        = { item = 121, texture = 0},  -- Masker
                },
            },
            [5] = {
                outfitLabel = "Placeholder",
                outfitData = {
                    ["pants"]       = { item = 49,texture = 0},  -- Broek
                    ["arms"]        = { item = 85, texture = 0},  -- Armen
                    ["t-shirt"]     = { item = 88, texture = 0},  -- T Shirt
                    ["vest"]        = { item = 18, texture = 0},  -- Body Vest
                    ["torso2"]      = { item = 93, texture = 2},  -- Jas / Vesten
                    ["shoes"]       = { item = 25, texture = 0},  -- Schoenen
                    ["decals"]      = { item = 0, texture = 0},  -- Decals
                    ["accessory"]   = { item = 0, texture = 0},  -- Nek / Das
                    ["bag"]         = { item = 0, texture = 0},  -- Tas
                    ["hat"]         = { item = -1, texture = -1},  -- Pet
                    ["glass"]       = { item = 0, texture = 0},  -- Bril
                    ["ear"]         = { item = 0, texture = 0},  -- Oor accessoires
                    ["mask"]        = { item = 121, texture = 0},  -- Masker
                },
            },
        },
        ["female"] = {
            [1] = {
                outfitLabel = "short sleeve white polo ",
                outfitData = {
                    ["pants"]       = { item = 34, texture = 0},  -- PANTS
                    ["arms"]        = { item = 98, texture = 0},  -- ArmS
                    ["t-shirt"]     = { item = 6, texture = 0},  -- T Shirt
                    ["vest"]        = { item = 20, texture = 0},  -- VEST
                    ["torso2"]      = { item = 237, texture = 1},  -- JACKET
                    ["shoes"]       = { item = 52, texture = 0},  -- SHOES
                    -- ["decals"]      = { item = 0, texture = 0},  -- Decals
                    ["accessory"]   = { item = 96, texture = 0},  -- Neck
                    ["bag"]         = { item = 0, texture = 0},  -- BAG
                    ["hat"]         = { item = -1, texture = -0},  -- HAT
            --      ["glass"]       = { item = 5, texture = 0},  -- GLASSES
            --      ["ear"]         = { item = -1, texture = 0},  -- EAR accessoires
                    ["mask"]        = { item = 0, texture = 0},  -- MASK
                },
            },
            [2] = {
                outfitLabel = "short sleeve blue polo ",
                outfitData = {
                    ["pants"]       = { item = 34, texture = 0},  -- PANTS
                    ["arms"]        = { item = 98, texture = 0},  -- ArmS
                    ["t-shirt"]     = { item = 6, texture = 0},  -- T Shirt
                    ["vest"]        = { item = 20, texture = 0},  -- VEST
                    ["torso2"]      = { item = 237, texture = 0},  -- JACKET
                    ["shoes"]       = { item = 52, texture = 0},  -- SHOES
                    -- ["decals"]      = { item = 0, texture = 0},  -- Decals
                    ["accessory"]   = { item = 96, texture = 0},  -- Neck
                    ["bag"]         = { item = 0, texture = 0},  -- BAG
                    ["hat"]         = { item = -1, texture = -0},  -- HAT
            --      ["glass"]       = { item = 5, texture = 0},  -- GLASSES
            --      ["ear"]         = { item = -1, texture = 0},  -- EAR accessoires
                    ["mask"]        = { item = 0, texture = 0},  -- MASK
                },
            },
            [3] = {
                outfitLabel = "short sleeve white button up ",
                outfitData = {
                    ["pants"]       = { item = 34, texture = 0},  -- PANTS
                    ["arms"]        = { item = 98, texture = 0},  -- ArmS
                    ["t-shirt"]     = { item = 6, texture = 0},  -- T Shirt
                    ["vest"]        = { item = 20, texture = 0},  -- VEST
                    ["torso2"]      = { item = 238, texture = 1},  -- JACKET
                    ["shoes"]       = { item = 52, texture = 0},  -- SHOES
                    -- ["decals"]      = { item = 0, texture = 0},  -- Decals
                    ["accessory"]   = { item = 96, texture = 0},  -- Neck
                    ["bag"]         = { item = 0, texture = 0},  -- BAG
                    ["hat"]         = { item = -1, texture = -0},  -- HAT
            --      ["glass"]       = { item = 5, texture = 0},  -- GLASSES
            --      ["ear"]         = { item = -1, texture = 0},  -- EAR accessoires
                    ["mask"]        = { item = 0, texture = 0},  -- MASK
                },
            },
            [4] = {
                outfitLabel = "short sleeve blue button up ",
                outfitData = {
                    ["pants"]       = { item = 34, texture = 0},  -- PANTS
                    ["arms"]        = { item = 98, texture = 0},  -- ArmS
                    ["t-shirt"]     = { item = 6, texture = 0},  -- T Shirt
                    ["vest"]        = { item = 20, texture = 0},  -- VEST
                    ["torso2"]      = { item = 238, texture = 0},  -- JACKET
                    ["shoes"]       = { item = 52, texture = 0},  -- SHOES
                    -- ["decals"]      = { item = 0, texture = 0},  -- Decals
                    ["accessory"]   = { item = 96, texture = 0},  -- Neck
                    ["bag"]         = { item = 0, texture = 0},  -- BAG
                    ["hat"]         = { item = -1, texture = -0},  -- HAT
            --      ["glass"]       = { item = 5, texture = 0},  -- GLASSES
            --      ["ear"]         = { item = -1, texture = 0},  -- EAR accessoires
                    ["mask"]        = { item = 0, texture = 0},  -- MASK
                },
            },
        },
    },
    ["doctor"] = {
        ["male"] = {
            [1] = {
                outfitLabel = "Placeholder",
                outfitData = {
                    ["pants"]       = { item = 49,texture = 0},  -- Broek
                    ["arms"]        = { item = 86, texture = 0},  -- Armen
                    ["t-shirt"]     = { item = 88, texture = 0},  -- T Shirt
                    ["vest"]        = { item = 0, texture = 0},  -- Body Vest
                    ["torso2"]      = { item = 118, texture = 7},  -- Jas / Vesten
                    ["shoes"]       = { item = 25, texture = 0},  -- Schoenen
                    ["decals"]      = { item = 0, texture = 0},  -- Decals
                    ["accessory"]   = { item = 0, texture = 0},  -- Nek / Das
                    ["bag"]         = { item = 0, texture = 0},  -- Tas
                    ["hat"]         = { item = -1, texture = -1},  -- Pet
                    ["glass"]       = { item = 0, texture = 0},  -- Bril
                    ["ear"]         = { item = 0, texture = 0},  -- Oor accessoires
                    ["mask"]        = { item = 121, texture = 0},  -- Masker
				},
			},
			[2] = {
                outfitLabel = "Placeholder",
                outfitData = {
                    ["pants"]       = { item = 49,texture = 0},  -- Broek
                    ["arms"]        = { item = 85, texture = 0},  -- Armen
                    ["t-shirt"]     = { item = 88, texture = 0},  -- T Shirt
                    ["vest"]        = { item = 18, texture = 0},  -- Body Vest
                    ["torso2"]      = { item = 32, texture = 6},  -- Jas / Vesten
                    ["shoes"]       = { item = 25, texture = 0},  -- Schoenen
                    ["decals"]      = { item = 0, texture = 0},  -- Decals
                    ["accessory"]   = { item = 0, texture = 0},  -- Nek / Das
                    ["bag"]         = { item = 0, texture = 0},  -- Tas
                    ["hat"]         = { item = -1, texture = -1},  -- Pet
                    ["glass"]       = { item = 0, texture = 0},  -- Bril
                    ["ear"]         = { item = 0, texture = 0},  -- Oor accessoires
                    ["mask"]        = { item = 121, texture = 0},  -- Masker
				},
			},			
			[3] = {
                outfitLabel = "Placeholder",
                outfitData = {
                    ["pants"]       = { item = 49,texture = 4},  -- Broek
                    ["arms"]        = { item = 86, texture = 0},  -- Armen
                    ["t-shirt"]     = { item = 51, texture = 0},  -- T Shirt
                    ["vest"]        = { item = 0, texture = 0},  -- Body Vest
                    ["torso2"]      = { item = 151, texture = 2},  -- Jas / Vesten
                    ["shoes"]       = { item = 25, texture = 0},  -- Schoenen
                    ["decals"]      = { item = 0, texture = 0},  -- Decals
                    ["accessory"]   = { item = 0, texture = 0},  -- Nek / Das
                    ["bag"]         = { item = 0, texture = 0},  -- Tas
                    ["hat"]         = { item = -1, texture = -1},  -- Pet
                    ["glass"]       = { item = 0, texture = 0},  -- Bril
                    ["ear"]         = { item = 0, texture = 0},  -- Oor accessoires
                    ["mask"]        = { item = 121, texture = 0},  -- Masker
				},
			},
			[4] = {
                outfitLabel = "Placeholder",
                outfitData = {
                    ["pants"]       = { item = 59,texture = 5},  -- Broek
                    ["arms"]        = { item = 86, texture = 0},  -- Armen
                    ["t-shirt"]     = { item = 135, texture = 0},  -- T Shirt
                    ["vest"]        = { item = 0, texture = 0},  -- Body Vest
                    ["torso2"]      = { item = 151, texture = 3},  -- Jas / Vesten
                    ["shoes"]       = { item = 25, texture = 0},  -- Schoenen
                    ["decals"]      = { item = 0, texture = 0},  -- Decals
                    ["accessory"]   = { item = 0, texture = 0},  -- Nek / Das
                    ["bag"]         = { item = 0, texture = 0},  -- Tas
                    ["hat"]         = { item = 79, texture = 0},  -- Pet
                    ["glass"]       = { item = 0, texture = 0},  -- Bril
                    ["ear"]         = { item = 0, texture = 0},  -- Oor accessoires
                    ["mask"]        = { item = 121, texture = 0},  -- Masker	
				},
			},
			[5] = {
                outfitLabel = "Placeholder",
                outfitData = {
                    ["pants"]       = { item = 59,texture = 5},  -- Broek
                    ["arms"]        = { item = 86, texture = 0},  -- Armen
                    ["t-shirt"]     = { item = 135, texture = 0},  -- T Shirt
                    ["vest"]        = { item = 0, texture = 0},  -- Body Vest
                    ["torso2"]      = { item = 151, texture = 5},  -- Jas / Vesten
                    ["shoes"]       = { item = 25, texture = 0},  -- Schoenen
                    ["decals"]      = { item = 0, texture = 0},  -- Decals
                    ["accessory"]   = { item = 0, texture = 0},  -- Nek / Das
                    ["bag"]         = { item = 0, texture = 0},  -- Tas
                    ["hat"]         = { item = 79, texture = 0},  -- Pet
                    ["glass"]       = { item = 0, texture = 0},  -- Bril
                    ["ear"]         = { item = 0, texture = 0},  -- Oor accessoires
                    ["mask"]        = { item = 121, texture = 0},  -- Masker	
				},
			},
			[6] = {
                outfitLabel = "Placeholder",
                outfitData = {
                    ["pants"]       = { item = 59,texture = 5},  -- Broek
                    ["arms"]        = { item = 86, texture = 0},  -- Armen
                    ["t-shirt"]     = { item = 135, texture = 0},  -- T Shirt
                    ["vest"]        = { item = 0, texture = 0},  -- Body Vest
                    ["torso2"]      = { item = 151, texture = 4},  -- Jas / Vesten
                    ["shoes"]       = { item = 25, texture = 0},  -- Schoenen
                    ["decals"]      = { item = 0, texture = 0},  -- Decals
                    ["accessory"]   = { item = 0, texture = 0},  -- Nek / Das
                    ["bag"]         = { item = 0, texture = 0},  -- Tas
                    ["hat"]         = { item = 79, texture = 0},  -- Pet
                    ["glass"]       = { item = 0, texture = 0},  -- Bril
                    ["ear"]         = { item = 0, texture = 0},  -- Oor accessoires
                    ["mask"]        = { item = 121, texture = 0},  -- Masker	
				},
			},		
		},		
        ["female"] = {
            [1] = {
                outfitLabel = "Doctor",
                outfitData = {
                    ["pants"]       = { item = 52, texture = 2},  -- PANTS
                    ["arms"]        = { item = 101, texture = 1},  -- ArmS
                    ["t-shirt"]     = { item = 38, texture = 1},  -- T Shirt
                    ["vest"]        = { item = 20, texture = 0},  -- VEST
                    ["torso2"]      = { item = 139, texture = 2},  -- JACKET
                    ["shoes"]       = { item = 62, texture = 20},  -- SHOES
                    -- ["decals"]      = { item = 0, texture = 0},  -- Decals
                    ["accessory"]   = { item = 96, texture = 0},  -- Neck
                    ["bag"]         = { item = 0, texture = 0},  -- BAG
                    ["hat"]         = { item = -1, texture = -0},  -- HAT
            --      ["glass"]       = { item = 5, texture = 0},  -- GLASSES
            --      ["ear"]         = { item = -1, texture = 0},  -- EAR accessoires
                    ["mask"]        = { item = 0, texture = 0},  -- MASK
				},
            },
            [2] = {
                outfitLabel = "short sleeve white polo",
                outfitData = {
                    ["pants"]       = { item = 34, texture = 0},  -- PANTS
                    ["arms"]        = { item = 98, texture = 0},  -- ArmS
                    ["t-shirt"]     = { item = 6, texture = 0},  -- T Shirt
                    ["vest"]        = { item = 20, texture = 0},  -- VEST
                    ["torso2"]      = { item = 237, texture = 1},  -- JACKET
                    ["shoes"]       = { item = 52, texture = 0},  -- SHOES
                    -- ["decals"]      = { item = 0, texture = 0},  -- Decals
                    ["accessory"]   = { item = 96, texture = 0},  -- Neck
                    ["bag"]         = { item = 0, texture = 0},  -- BAG
                    ["hat"]         = { item = -1, texture = -0},  -- HAT
            --      ["glass"]       = { item = 5, texture = 0},  -- GLASSES
            --      ["ear"]         = { item = -1, texture = 0},  -- EAR accessoires
                    ["mask"]        = { item = 0, texture = 0},  -- MASK
				},
            },
            [3] = {
                outfitLabel = "short sleeve blue polo",
                outfitData = {
                    ["pants"]       = { item = 34, texture = 0},  -- PANTS
                    ["arms"]        = { item = 98, texture = 0},  -- ArmS
                    ["t-shirt"]     = { item = 6, texture = 0},  -- T Shirt
                    ["vest"]        = { item = 20, texture = 0},  -- VEST
                    ["torso2"]      = { item = 237, texture = 0},  -- JACKET
                    ["shoes"]       = { item = 52, texture = 0},  -- SHOES
                    -- ["decals"]      = { item = 0, texture = 0},  -- Decals
                    ["accessory"]   = { item = 96, texture = 0},  -- Neck
                    ["bag"]         = { item = 0, texture = 0},  -- BAG
                    ["hat"]         = { item = -1, texture = -0},  -- HAT
            --      ["glass"]       = { item = 5, texture = 0},  -- GLASSES
            --      ["ear"]         = { item = -1, texture = 0},  -- EAR accessoires
                    ["mask"]        = { item = 0, texture = 0},  -- MASK
				},
            },
            [4] = {
                outfitLabel = "short sleeve white button up",
                outfitData = {
                    ["pants"]       = { item = 34, texture = 0},  -- PANTS
                    ["arms"]        = { item = 98, texture = 0},  -- ArmS
                    ["t-shirt"]     = { item = 6, texture = 0},  -- T Shirt
                    ["vest"]        = { item = 20, texture = 0},  -- VEST
                    ["torso2"]      = { item = 238, texture = 1},  -- JACKET
                    ["shoes"]       = { item = 52, texture = 0},  -- SHOES
                    -- ["decals"]      = { item = 0, texture = 0},  -- Decals
                    ["accessory"]   = { item = 96, texture = 0},  -- Neck
                    ["bag"]         = { item = 0, texture = 0},  -- BAG
                    ["hat"]         = { item = -1, texture = -0},  -- HAT
            --      ["glass"]       = { item = 5, texture = 0},  -- GLASSES
            --      ["ear"]         = { item = -1, texture = 0},  -- EAR accessoires
                    ["mask"]        = { item = 0, texture = 0},  -- MASK
				},
            },
            [5] = {
                outfitLabel = "Placeholder",
                outfitLabel = "short sleeve blue button up",
                outfitData = {
                    ["pants"]       = { item = 34, texture = 0},  -- PANTS
                    ["arms"]        = { item = 98, texture = 0},  -- ArmS
                    ["t-shirt"]     = { item = 6, texture = 0},  -- T Shirt
                    ["vest"]        = { item = 20, texture = 0},  -- VEST
                    ["torso2"]      = { item = 238, texture = 0},  -- JACKET
                    ["shoes"]       = { item = 52, texture = 0},  -- SHOES
                    -- ["decals"]      = { item = 0, texture = 0},  -- Decals
                    ["accessory"]   = { item = 96, texture = 0},  -- Neck
                    ["bag"]         = { item = 0, texture = 0},  -- BAG
                    ["hat"]         = { item = -1, texture = -0},  -- HAT
            --      ["glass"]       = { item = 5, texture = 0},  -- GLASSES
            --      ["ear"]         = { item = -1, texture = 0},  -- EAR accessoires
                    ["mask"]        = { item = 0, texture = 0},  -- MASK
				},
            },
        },
    },
}
```
