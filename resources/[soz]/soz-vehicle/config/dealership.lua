Config.DealershipTypes = {Pdm = "pdm", Luxury = "luxury", Cycle = "cycle", Moto = "moto", Air = "air", Boat = "boat"}

Config.CategoryTypes = {
    Boats = "Bateaux",
    Commercial = "Commercial",
    Compacts = "Compactes",
    Coupes = "Coupés",
    Cycles = "Vélos",
    Emergency = "Véhicules d'urgence",
    Helicopters = "Hélicoptères",
    Industrial = "Industriels",
    Military = "Militaires",
    Motorcycles = "Motos",
    Muscle = "Grosses Cylindrées",
    ["Off-road"] = "Tout-terrain",
    Openwheel = "Ultra-rapide",
    Planes = "Avions",
    Sedans = "Berlines",
    Service = "Service",
    Sportsclassic = "Sportives Classiques",
    Sports = "Sportives",
    Super = "Super-sportives",
    Suvs = "SUV",
    Trains = "Trains",
    Utility = "Utilitaires",
    Vans = "Vans",
}

Config.Dealerships = {
    [Config.DealershipTypes.Pdm] = {
        active = true,
        licence = "car",
        blip = {name = "Concessionnaire Auto", coords = vector3(-45.67, -1098.34, 26.42), sprite = 225, color = 46},
        ped = {
            model = "s_m_m_autoshop_01",
            coords = vector4(-56.61, -1096.58, 25.42, 30.0),
            zone = {
                center = vector3(-55.49, -1096.44, 26.92),
                length = 10,
                width = 10,
                options = {name = "car_dealership_zone", heading = 340, minZ = 25.92, maxZ = 29.92},
            },
        },
        vehicle = {spawn = vector4(-46.64, -1097.53, 25.44, 26.42), camera = vector3(-53.69, -1094.83, 27.0)},
    },
    [Config.DealershipTypes.Cycle] = {
        active = true,
        licence = nil,
        blip = {name = "Concessionnaire Vélo", coords = vector3(-1222.26, -1494.83, 4.34), sprite = 559, color = 46},
        ped = {
            model = "s_m_m_autoshop_01",
            coords = vector4(-1222.26, -1494.83, 3.34, 120.0),
            zone = {
                center = vector3(-1223.7, -1495.49, 4.37),
                length = 8,
                width = 10,
                options = {name = "cycle_dealership_zone", heading = 305, minZ = 3.37, maxZ = 7.37},
            },
        },
        vehicle = {spawn = vector4(-1221.96, -1498.45, 4.35, 210.0), camera = vector3(-1222.6, -1501.34, 5.37)},
    },
    [Config.DealershipTypes.Moto] = {
        active = true,
        licence = "motorcycle",
        blip = {name = "Concessionnaire Moto", coords = vector3(1224.79, 2727.25, 38.0), sprite = 522, color = 46},
        ped = {
            model = "s_m_m_autoshop_01",
            coords = vector4(1224.79, 2727.25, 37.0, 180.0),
            zone = {
                center = vector3(1224.99, 2725.22, 38.0),
                length = 8,
                width = 10,
                options = {name = "motorcycle_dealership_zone", heading = 0, minZ = 37.0, maxZ = 41.0},
            },
        },
        vehicle = {spawn = vector4(1224.66, 2706.15, 38.01, 120.0), camera = vector3(1224.5, 2701.63, 39.0)},
    },
    [Config.DealershipTypes.Air] = {
        active = true,
        licence = "heli",
        blip = {
            name = "Concessionnaire Hélicoptère",
            coords = vector3(1734.18, 3313.44, 41.22),
            sprite = 64,
            color = 46,
        },
        ped = {
            model = "s_m_m_autoshop_02",
            coords = vector4(1743.13, 3307.23, 40.22, 148.91),
            zone = {
                center = vector3(1732.15, 3308.31, 41.22),
                length = 23.8,
                width = 27.8,
                options = {name = "heli_dealership_zone", heading = 15, minZ = 40.22, maxZ = 44.22},
            },
        },
        vehicle = {spawn = vector4(1730.47, 3314.38, 40.22, 153.64), camera = vector4(1733.07, 3303.82, 42.22, 14.55)},
    },
    [Config.DealershipTypes.Boat] = {
        active = GetConvarInt("feature_dlc2_boat", 0) == 1,
        licence = "boat",
        blip = {name = "Concessionnaire Maritime", coords = vector3(-846.51, -1315.44, 5.0), sprite = 780, color = 46},
        ped = {
            model = "mp_m_boatstaff_01",
            coords = vector4(-847.93, -1312.15, 4.0, 296.25),
            zone = {
                center = vector3(-847.26, -1311.66, 5.0),
                length = 9.8,
                width = 7.4,
                options = {name = "boat_dealership_zone", heading = 21, minZ = 4.0, maxZ = 7.0},
            },
        },
        vehicle = {spawn = vector4(-857.02, -1327.72, 0.45, 110), camera = vector3(-871.61, -1342.65, 8.44)},
    },
}
