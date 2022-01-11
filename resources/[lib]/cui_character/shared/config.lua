Config = {}

--[[ 
    This enables/disables the post-loading animation where camera starts in the clouds, 
    above the city like when switching characters in GTA V Story Mode.
--]]
Config.EnterCityAnimation = true

-- Setting these to false will enable all colors available in the game.
Config.UseNaturalHairColors = true
Config.UseNaturalEyeColors = true

-- Map Locations
Config.EnableClothingShops = false 
Config.ClothingShops = {
    vector3(72.3, -1399.1, 28.4),
    vector3(-703.8, -152.3, 36.4),
    vector3(-167.9, -299.0, 38.7),
    vector3(428.7, -800.1, 28.5),
    vector3(-829.4, -1073.7, 10.3),
    vector3(-1447.8, -242.5, 48.8),
    vector3(11.6, 6514.2, 30.9),
    vector3(123.6, -219.4, 53.6),
    vector3(1696.3, 4829.3, 41.1),
    vector3(618.1, 2759.6, 41.1),
    vector3(1190.6, 2713.4, 37.2),
    vector3(-1193.4, -772.3, 16.3),
    vector3(-3172.5, 1048.1, 19.9),
    vector3(-1108.4, 2708.9, 18.1)
}

Config.EnableBarberShops = true
Config.BarberShops = {
    vector3(-814.3, -183.8, 36.6),
    vector3(136.8, -1708.4, 28.3),
    vector3(-1282.6, -1116.8, 6.0),
    vector3(1931.5, 3729.7, 31.8),
    vector3(1212.8, -472.9, 65.2),
    vector3(-32.9, -152.3, 56.1),
    vector3(-278.1, 6228.5, 30.7)
}

Config.EnablePlasticSurgeryUnits = false
Config.PlasticSurgeryUnits = {
    vector3(338.8, -1394.5, 31.5),      -- Central Los Santos Medical Center
    -- vector3(240.2, -1380.0, 33.7),   -- Los Santos General Hospital (Coroner)
    -- vector3(1152.2, -1528.0, 34.8),  -- St Fiacre Hospital for East Los Santos
    vector3(-874.7, -307.5, 38.5),      -- Portola Trinity Medical Center
    vector3(-676.7, 311.5, 82.5),       -- Eclipse Medical Tower
    vector3(-449.8, -341.0, 33.7),      -- Mount Zonah Medical Center
    vector3(298.7, -584.6, 42.2),       -- Pillbox Hill Medical Center
    -- vector3(1839.5, 3672.5, 33.2),   -- Sandy Shores Medical Center
    -- vector3(-246.9, 6330.5, 31.4)    -- The Bay Care Center (Paleto)
}

Config.EnableNewIdentityProviders = false
Config.NewIdentityProviders = {
    -- vector3(233.2, -410.1, 47.3),    -- Los Santos City Hall
    vector3(1118.32,50.35,15.85),      -- Rockford Hills City Hall
    -- vector3(328.5, -1581.8, 31.9),   -- Davis City Hall
    -- vector3(-1283.4, -565.1, 31.0)   -- Del Perro City Hall
}

Config.ExtendedMode = false
Config.UseSteamID = false
Config.StandAlone = true