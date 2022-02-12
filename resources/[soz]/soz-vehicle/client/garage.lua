local QBCore = exports["qb-core"]:GetCoreObject()
local PlayerData = {}
local PlayerGang = {}
local PlayerJob = {}
local currentHouseGarage = nil
local inGarageRange = false
local OutsideVehicles = {}

local ParkingPublicList = MenuV:CreateMenu(nil, nil, "menu_garage_public", "soz", "parkingpublic:vehicle:car")
local VehiculeParkingPublic = MenuV:InheritMenu(ParkingPublicList, {
    Title = nil,
})

local ParkingPriveList = MenuV:CreateMenu(nil, nil, "menu_garage_private", "soz", "parkingprive:vehicle:car")
local VehiculeParkingPrive = MenuV:InheritMenu(ParkingPriveList, {
    Title = nil,
})

local ParkingFourriereList = MenuV:CreateMenu(nil, nil, "menu_garage_pound", "soz", "parkingfourriere:vehicle:car")
local VehiculeParkingFourriere = MenuV:InheritMenu(ParkingFourriereList, {
    Title = nil,
})

-- ZONES

Zonesprives = {
    ["motelgarage"] = BoxZone:Create(vector3(280.87, -337.05, 44.92), 40, 30, {
        name = "motelgarage_z",
        heading = 70,
        minZ = 43.92,
        maxZ = 47.92,
    }),
    ["spanishave"] = BoxZone:Create(vector3(-1161.21, -744.72, 21.17), 85, 45, {
        name = "spanishave_z",
        heading = 45,
        minZ = 16.00,
        maxZ = 24.00,
    }),
    ["greatoceanp"] = BoxZone:Create(vector3(1417.53, 6562.75, 18.18), 70, 110, {
        name = "greatoceanp_z",
        heading = 0,
        minZ = 8.18,
        maxZ = 21.18,
    }),
    ["sandyshores"] = BoxZone:Create(vector3(1503.17, 3755.71, 33.35), 130, 23, {
        name = "sandyshores_z",
        heading = 300,
        minZ = 32.35,
        maxZ = 37.35,
    }),
    ["airportprivate"] = BoxZone:Create(vector3(-973.0, -2704.32, 13.83), 43, 28, {
        name = "airportprivate_z",
        heading = 60,
        minZ = 12.83,
        maxZ = 16.83,
    }),
    ["chumashp"] = BoxZone:Create(vector3(-3148.58, 1091.96, 20.66), 70, 30, {
        name = "chumashp_z",
        heading = 350,
        minZ = 19.66,
        maxZ = 23.66,
    }),
    ["stadiump"] = BoxZone:Create(vector3(-79.37, -2007.77, 18.02), 73, 50, {
        name = "stadiump_z",
        heading = 265,
        minZ = 17.02,
        maxZ = 21.02,
    }),
    ["diamondp"] = BoxZone:Create(vector3(889.36, -44.0, 78.76), 80, 100, {
        name = "diamondp_z",
        heading = 330,
        minZ = 77.76,
        maxZ = 81.76,
    }),
    ["lagunapi"] = BoxZone:Create(vector3(374.07, 280.75, 103.3), 35.2, 40, {
        name = "lagunapi_z",
        heading = 340,
        minZ = 102.3,
        maxZ = 106.3,
    }),
    ["beachp"] = BoxZone:Create(vector3(-1188.34, -1489.01, 4.38), 40, 36, {
        name = "beachp_z",
        heading = 35,
        minZ = 3.38,
        maxZ = 7.38,
    }),
    ["themotorhotel"] = BoxZone:Create(vector3(1117.04, 2659.48, 38.05), 45, 30, {
        name = "themotorhotel_z",
        heading = 270,
        minZ = 37.00,
        maxZ = 41.00,
    }),
    ["marinadrive"] = BoxZone:Create(vector3(946.56, 3614.86, 32.62), 25, 25, {
        name = "marinadrive_z",
        heading = 0,
        minZ = 31.62,
        maxZ = 35.62,
    }),
    ["shambles"] = BoxZone:Create(vector3(1013.95, -2330.82, 30.51), 80, 35, {
        name = "shambles_z",
        heading = 355,
        minZ = 29.51,
        maxZ = 33.51,
    }),
    ["pillboxgarage"] = BoxZone:Create(vector3(237.0, -775.97, 30.51), 80, 50, {
        name = "pillboxgarage_z",
        heading = 340,
        minZ = 28.7,
        maxZ = 32.7,
    }),
}

Zonespublic = {
    ["haanparking"] = BoxZone:Create(vector3(44.46, 6353.65, 31.24), 150, 55, {
        name = "haanparking_z",
        heading = 315,
        minZ = 30.24,
        maxZ = 34.24,
    }),
    ["airportpublic"] = BoxZone:Create(vector3(-605.04, -2169.65, 6.0), 116, 80, {
        name = "airportpublic_z",
        heading = 320,
        minZ = 5.0,
        maxZ = 9.0,
    }),
}

Zonesfourriere = {
    ["fourriere"] = BoxZone:Create(vector3(497.97, -1316.59, 29.24), 10, 15, {
        name = "fourriere_z",
        heading = 305,
        minZ = 28.24,
        maxZ = 32.24,
    }),
}

PlacesPrives = {
    ["pillboxgarage1"] = BoxZone:Create(vector3(209.89, -791.11, 30.88), 6, 3, {
        name = "pillboxgarage1",
        heading = 250,
        minZ = 29.00,
        maxZ = 33.00,
    }),
    ["pillboxgarage2"] = BoxZone:Create(vector3(215.52, -776.01, 30.8), 6, 3, {
        name = "pillboxgarage2",
        heading = 250,
        minZ = 29.00,
        maxZ = 33.00,
    }),
    ["pillboxgarage3"] = BoxZone:Create(vector3(222.04, -786.87, 30.81), 6, 3, {
        name = "pillboxgarage3",
        heading = 250,
        minZ = 29.00,
        maxZ = 33.00,
    }),
    ["pillboxgarage4"] = BoxZone:Create(vector3(217.25, -799.32, 30.84), 6, 3, {
        name = "pillboxgarage4",
        heading = 70,
        minZ = 29.00,
        maxZ = 33.00,
    }),
    ["pillboxgarage5"] = BoxZone:Create(vector3(232.82, -773.78, 30.67), 6, 3, {
        name = "pillboxgarage5",
        heading = 70,
        minZ = 29.00,
        maxZ = 33.00,
    }),
    ["pillboxgarage6"] = BoxZone:Create(vector3(241.46, -782.54, 30.68), 6, 3, {
        name = "pillboxgarage6",
        heading = 70,
        minZ = 29.00,
        maxZ = 33.00,
    }),
    ["pillboxgarage7"] = BoxZone:Create(vector3(237.55, -810.04, 30.22), 6, 3, {
        name = "pillboxgarage7",
        heading = 70,
        minZ = 29.00,
        maxZ = 33.00,
    }),
    ["pillboxgarage8"] = BoxZone:Create(vector3(234.97, -800.2, 30.61), 6, 3, {
        name = "pillboxgarage8",
        heading = 250,
        minZ = 29.00,
        maxZ = 33.00,
    }),
    ["shambles1"] = BoxZone:Create(vector3(1002.62, -2319.83, 30.51), 6, 3, {
        name = "shambles1",
        heading = 265,
        minZ = 29.51,
        maxZ = 33.51,
    }),
    ["shambles2"] = BoxZone:Create(vector3(1000.92, -2332.31, 30.51), 6, 3, {
        name = "shambles2",
        heading = 265,
        minZ = 29.51,
        maxZ = 33.51,
    }),
    ["shambles3"] = BoxZone:Create(vector3(1000.07, -2350.93, 30.51), 5.8, 3, {
        name = "shambles3",
        heading = 85,
        minZ = 29.51,
        maxZ = 33.51,
    }),
    ["shambles4"] = BoxZone:Create(vector3(1027.69, -2322.57, 30.51), 6, 3, {
        name = "shambles4",
        heading = 265,
        minZ = 29.51,
        maxZ = 33.51,
    }),
    ["shambles5"] = BoxZone:Create(vector3(1025.61, -2347.78, 30.51), 6, 3, {
        name = "shambles5",
        heading = 85,
        minZ = 29.51,
        maxZ = 33.51,
    }),
    ["shambles6"] = BoxZone:Create(vector3(1026.17, -2336.52, 30.51), 6, 3, {
        name = "shambles6",
        heading = 85,
        minZ = 29.51,
        maxZ = 33.51,
    }),
    ["shambles7"] = BoxZone:Create(vector3(1003.86, -2305.89, 30.51), 6, 3, {
        name = "shambles7",
        heading = 265,
        minZ = 29.51,
        maxZ = 33.51,
    }),
    ["shambles8"] = BoxZone:Create(vector3(1028.36, -2312.23, 30.51), 6, 3, {
        name = "shambles8",
        heading = 265,
        minZ = 29.51,
        maxZ = 33.51,
    }),
    ["marinadrive1"] = BoxZone:Create(vector3(951.33, 3622.81, 32.44), 6, 4, {
        name = "marinadrive1",
        heading = 90,
        minZ = 31.44,
        maxZ = 35.44,
    }),
    ["marinadrive2"] = BoxZone:Create(vector3(951.31, 3619.1, 32.54), 6, 4, {
        name = "marinadrive2",
        heading = 90,
        minZ = 31.5,
        maxZ = 35.5,
    }),
    ["marinadrive3"] = BoxZone:Create(vector3(951.56, 3615.45, 32.6), 6, 4, {
        name = "marinadrive3",
        heading = 90,
        minZ = 31.6,
        maxZ = 35.6,
    }),
    ["themotorhotel1"] = BoxZone:Create(vector3(1135.32, 2647.61, 38.0), 6, 4, {
        name = "themotorhotel1",
        heading = 0,
        minZ = 37.00,
        maxZ = 41.00,
    }),
    ["themotorhotel2"] = BoxZone:Create(vector3(1127.67, 2647.67, 38.0), 6, 4, {
        name = "themotorhotel2",
        heading = 0,
        minZ = 37.00,
        maxZ = 41.00,
    }),
    ["themotorhotel3"] = BoxZone:Create(vector3(1120.49, 2647.63, 38.0), 6, 4, {
        name = "themotorhotel3",
        heading = 0,
        minZ = 37.00,
        maxZ = 41.00,
    }),
    ["themotorhotel4"] = BoxZone:Create(vector3(1112.09, 2654.12, 38.0), 6, 4, {
        name = "themotorhotel4",
        heading = 90,
        minZ = 37.00,
        maxZ = 41.00,
    }),
    ["themotorhotel5"] = BoxZone:Create(vector3(1105.58, 2663.18, 38.17), 6, 4, {
        name = "themotorhotel5",
        heading = 0,
        minZ = 37.00,
        maxZ = 41.00,
    }),
    ["themotorhotel6"] = BoxZone:Create(vector3(1098.11, 2663.28, 38.06), 6, 4, {
        name = "themotorhotel6",
        heading = 0,
        minZ = 37.00,
        maxZ = 41.00,
    }),
    ["beachp1"] = BoxZone:Create(vector3(-1177.07, -1491.71, 4.38), 6, 3, {
        name = "beachp1",
        heading = 305,
        minZ = 3.50,
        maxZ = 7.50,
    }),
    ["beachp2"] = BoxZone:Create(vector3(-1196.37, -1497.11, 4.38), 5.8, 3, {
        name = "beachp2",
        heading = 305,
        minZ = 3.50,
        maxZ = 7.50,
    }),
    ["beachp3"] = BoxZone:Create(vector3(-1191.87, -1470.34, 4.38), 6, 3, {
        name = "beachp3",
        heading = 305,
        minZ = 3.50,
        maxZ = 7.50,
    }),
    ["beachp4"] = BoxZone:Create(vector3(-1182.27, -1483.97, 4.38), 6, 3, {
        name = "beachp4",
        heading = 305,
        minZ = 3.50,
        maxZ = 7.50,
    }),
    ["beachp5"] = BoxZone:Create(vector3(-1184.78, -1492.95, 4.38), 6, 3, {
        name = "beachp5",
        heading = 305,
        minZ = 3.50,
        maxZ = 7.50,
    }),
    ["beachp6"] = BoxZone:Create(vector3(-1192.01, -1482.64, 4.38), 6, 3, {
        name = "beachp6",
        heading = 305,
        minZ = 3.50,
        maxZ = 7.50,
    }),
    ["lagunapi1"] = BoxZone:Create(vector3(382.73, 292.21, 103.09), 6, 4, {
        name = "lagunapi1",
        heading = 345,
        minZ = 102.09,
        maxZ = 106.09,
    }),
    ["lagunapi2"] = BoxZone:Create(vector3(391.74, 280.71, 103.0), 6, 4, {
        name = "lagunapi2",
        heading = 70,
        minZ = 102.0,
        maxZ = 106.0,
    }),
    ["lagunapi3"] = BoxZone:Create(vector3(374.87, 283.68, 103.19), 6, 4, {
        name = "lagunapi3",
        heading = 340,
        minZ = 102.00,
        maxZ = 106.00,
    }),
    ["lagunapi4"] = BoxZone:Create(vector3(375.86, 274.4, 103.06), 6, 4, {
        name = "lagunapi4",
        heading = 340,
        minZ = 102.00,
        maxZ = 106.00,
    }),
    ["lagunapi5"] = BoxZone:Create(vector3(363.89, 270.1, 103.19), 6, 4, {
        name = "lagunapi5",
        heading = 340,
        minZ = 102.00,
        maxZ = 106.00,
    }),
    ["lagunapi6"] = BoxZone:Create(vector3(358.75, 286.18, 103.37), 6, 4, {
        name = "lagunapi6",
        heading = 70,
        minZ = 102.00,
        maxZ = 106.00,
    }),
    ["diamondp1"] = BoxZone:Create(vector3(872.32, 9.04, 78.76), 6, 4, {
        name = "diamondp1",
        heading = 330,
        minZ = 77.76,
        maxZ = 81.76,
    }),
    ["diamondp2"] = BoxZone:Create(vector3(878.32, 5.4, 78.76), 6, 4, {
        name = "diamondp2",
        heading = 330,
        minZ = 77.76,
        maxZ = 81.76,
    }),
    ["diamondp3"] = BoxZone:Create(vector3(879.48, -21.8, 78.76), 6, 4, {
        name = "diamondp3",
        heading = 60,
        minZ = 77.76,
        maxZ = 81.76,
    }),
    ["diamondp4"] = BoxZone:Create(vector3(862.64, -23.5, 78.76), 6, 4, {
        name = "diamondp4",
        heading = 60,
        minZ = 77.76,
        maxZ = 81.76,
    }),
    ["diamondp5"] = BoxZone:Create(vector3(884.68, -53.54, 78.76), 6, 4, {
        name = "diamondp5",
        heading = 60,
        minZ = 77.76,
        maxZ = 81.76,
    }),
    ["diamondp6"] = BoxZone:Create(vector3(906.19, -34.53, 78.76), 6, 4, {
        name = "diamondp6",
        heading = 55,
        minZ = 77.76,
        maxZ = 81.76,
    }),
    ["diamondp7"] = BoxZone:Create(vector3(882.4, -31.85, 78.76), 6, 4, {
        name = "diamondp7",
        heading = 60,
        minZ = 77.76,
        maxZ = 81.76,
    }),
    ["diamondp8"] = BoxZone:Create(vector3(852.19, -25.13, 78.76), 6, 4, {
        name = "diamondp8",
        heading = 60,
        minZ = 77.76,
        maxZ = 81.76,
    }),
    ["stadiump1"] = BoxZone:Create(vector3(-93.46, -2009.54, 18.02), 6, 4, {
        name = "stadiump1",
        heading = 355,
        minZ = 17.02,
        maxZ = 21.02,
    }),
    ["stadiump2"] = BoxZone:Create(vector3(-97.17, -1986.03, 18.02), 6, 4, {
        name = "stadiump2",
        heading = 355,
        minZ = 17.02,
        maxZ = 21.02,
    }),
    ["stadiump3"] = BoxZone:Create(vector3(-77.06, -2028.21, 18.02), 6, 4, {
        name = "stadiump3",
        heading = 350,
        minZ = 17.02,
        maxZ = 21.02,
    }),
    ["stadiump4"] = BoxZone:Create(vector3(-67.19, -2008.96, 18.02), 6, 4, {
        name = "stadiump4",
        heading = 20,
        minZ = 17.02,
        maxZ = 21.02,
    }),
    ["stadiump5"] = BoxZone:Create(vector3(-50.57, -2001.02, 18.02), 6, 4, {
        name = "stadiump5",
        heading = 290,
        minZ = 17.02,
        maxZ = 21.02,
    }),
    ["stadiump6"] = BoxZone:Create(vector3(-88.86, -2003.37, 18.02), 6, 4, {
        name = "stadiump6",
        heading = 355,
        minZ = 17.02,
        maxZ = 21.02,
    }),
    ["chumashp1"] = BoxZone:Create(vector3(-3164.37, 1067.13, 20.68), 6, 4, {
        name = "chumashp1",
        heading = 280,
        minZ = 19.67,
        maxZ = 23.67,
    }),
    ["chumashp2"] = BoxZone:Create(vector3(-3139.69, 1078.75, 20.67), 6, 4, {
        name = "chumashp2",
        heading = 80,
        minZ = 19.67,
        maxZ = 23.67,
    }),
    ["chumashp3"] = BoxZone:Create(vector3(-3152.04, 1092.59, 20.7), 6, 4, {
        name = "chumashp3",
        heading = 280,
        minZ = 19.7,
        maxZ = 23.7,
    }),
    ["chumashp4"] = BoxZone:Create(vector3(-3137.17, 1094.5, 20.69), 6, 4, {
        name = "chumashp4",
        heading = 80,
        minZ = 19.69,
        maxZ = 23.69,
    }),
    ["chumashp5"] = BoxZone:Create(vector3(-3141.37, 1117.16, 20.69), 6, 4, {
        name = "chumashp5",
        heading = 280,
        minZ = 19.69,
        maxZ = 23.69,
    }),
    ["chumashp6"] = BoxZone:Create(vector3(-3158.21, 1081.02, 20.69), 6, 4, {
        name = "chumashp6",
        heading = 280,
        minZ = 19.67,
        maxZ = 23.67,
    }),
    ["airportprivate1"] = BoxZone:Create(vector3(-989.38, -2706.55, 13.83), 6, 4, {
        name = "airportprivate1",
        heading = 330,
        minZ = 12.83,
        maxZ = 16.83,
    }),
    ["airportprivate2"] = BoxZone:Create(vector3(-960.53, -2709.54, 13.83), 6, 4, {
        name = "airportprivate2",
        heading = 10,
        minZ = 12.83,
        maxZ = 16.83,
    }),
    ["airportprivate3"] = BoxZone:Create(vector3(-976.07, -2691.2, 13.85), 6, 4, {
        name = "airportprivate3",
        heading = 330,
        minZ = 12.85,
        maxZ = 16.85,
    }),
    ["airportprivate4"] = BoxZone:Create(vector3(-970.34, -2694.46, 13.85), 6, 4, {
        name = "airportprivate4",
        heading = 330,
        minZ = 12.85,
        maxZ = 16.85,
    }),
    ["airportprivate5"] = BoxZone:Create(vector3(-961.64, -2699.48, 13.83), 6, 4, {
        name = "airportprivate5",
        heading = 330,
        minZ = 12.83,
        maxZ = 16.83,
    }),
    ["airportprivate6"] = BoxZone:Create(vector3(-976.82, -2710.44, 13.87), 6, 4, {
        name = "airportprivate6",
        heading = 350,
        minZ = 12.87,
        maxZ = 16.87,
    }),
    ["sandyshores1"] = BoxZone:Create(vector3(1542.85, 3780.37, 34.05), 6, 4, {
        name = "sandyshores1",
        heading = 30,
        minZ = 33.05,
        maxZ = 37.05,
    }),
    ["sandyshores2"] = BoxZone:Create(vector3(1523.44, 3767.25, 34.05), 6, 4, {
        name = "sandyshores2",
        heading = 45,
        minZ = 33.05,
        maxZ = 37.05,
    }),
    ["sandyshores3"] = BoxZone:Create(vector3(1516.91, 3763.2, 34.05), 6, 4, {
        name = "sandyshores3",
        heading = 15,
        minZ = 33.05,
        maxZ = 37.05,
    }),
    ["sandyshores4"] = BoxZone:Create(vector3(1497.69, 3760.17, 33.91), 6, 4, {
        name = "sandyshores4",
        heading = 35,
        minZ = 32.91,
        maxZ = 36.91,
    }),
    ["sandyshores5"] = BoxZone:Create(vector3(1484.04, 3751.61, 33.77), 6, 4, {
        name = "sandyshores5",
        heading = 30,
        minZ = 32.77,
        maxZ = 36.77,
    }),
    ["sandyshores6"] = BoxZone:Create(vector3(1458.49, 3737.92, 33.52), 6, 4, {
        name = "sandyshores6",
        heading = 30,
        minZ = 32.52,
        maxZ = 36.52,
    }),
    ["sandyshores7"] = BoxZone:Create(vector3(1446.82, 3732.24, 33.44), 6, 4, {
        name = "sandyshores7",
        heading = 20,
        minZ = 32.44,
        maxZ = 36.44,
    }),
    ["sandyshores8"] = BoxZone:Create(vector3(1549.85, 3784.22, 34.12), 6, 4, {
        name = "sandyshores8",
        heading = 30,
        minZ = 33.12,
        maxZ = 37.12,
    }),
    ["spanishave1"] = BoxZone:Create(vector3(-1202.06, -729.73, 21.16), 6, 4, {
        name = "spanishave1",
        heading = 310,
        minZ = 20.16,
        maxZ = 24.16,
    }),
    ["spanishave2"] = BoxZone:Create(vector3(-1186.35, -742.68, 20.1), 6, 4, {
        name = "spanishave2",
        heading = 310,
        minZ = 19.1,
        maxZ = 23.1,
    }),
    ["spanishave3"] = BoxZone:Create(vector3(-1141.51, -740.48, 20.11), 6, 4, {
        name = "spanishave3",
        heading = 290,
        minZ = 19.11,
        maxZ = 23.11,
    }),
    ["spanishave4"] = BoxZone:Create(vector3(-1143.48, -748.56, 19.2), 6, 4, {
        name = "spanishave4",
        heading = 290,
        minZ = 18.2,
        maxZ = 22.2,
    }),
    ["spanishave5"] = BoxZone:Create(vector3(-1131.74, -752.44, 19.58), 6, 4, {
        name = "spanishave5",
        heading = 290,
        minZ = 18.58,
        maxZ = 22.58,
    }),
    ["spanishave6"] = BoxZone:Create(vector3(-1131.07, -763.37, 18.57), 6, 4, {
        name = "spanishave6",
        heading = 290,
        minZ = 17.57,
        maxZ = 21.57,
    }),
    ["motelgarage1"] = BoxZone:Create(vector3(298.83, -333.19, 44.92), 6, 4, {
        name = "motelgarage1",
        heading = 70,
        minZ = 43.92,
        maxZ = 47.92,
    }),
    ["motelgarage2"] = BoxZone:Create(vector3(295.41, -342.99, 44.92), 6, 4, {
        name = "motelgarage2",
        heading = 70,
        minZ = 43.92,
        maxZ = 47.92,
    }),
    ["motelgarage3"] = BoxZone:Create(vector3(266.27, -332.19, 44.92), 6, 4, {
        name = "motelgarage3",
        heading = 70,
        minZ = 43.92,
        maxZ = 47.92,
    }),
    ["motelgarage4"] = BoxZone:Create(vector3(269.85, -322.48, 44.92), 6, 4, {
        name = "motelgarage4",
        heading = 70,
        minZ = 43.92,
        maxZ = 47.92,
    }),
    ["motelgarage5"] = BoxZone:Create(vector3(282.91, -323.71, 44.92), 6, 4, {
        name = "motelgarage5",
        heading = 70,
        minZ = 43.92,
        maxZ = 47.92,
    }),
    ["motelgarage6"] = BoxZone:Create(vector3(285.78, -335.88, 44.92), 6, 4, {
        name = "motelgarage6",
        heading = 70,
        minZ = 43.92,
        maxZ = 47.92,
    }),
    ["greatoceanp1"] = BoxZone:Create(vector3(1459.62, 6560.63, 13.42), 6, 4, {
        name = "greatoceanp1",
        heading = 275,
        minZ = 11.42,
        maxZ = 16.42,
    }),
    ["greatoceanp2"] = BoxZone:Create(vector3(1458.36, 6571.11, 13.52), 6, 4, {
        name = "greatoceanp2",
        heading = 275,
        minZ = 11.52,
        maxZ = 16.52,
    }),
    ["greatoceanp3"] = BoxZone:Create(vector3(1456.24, 6581.96, 12.63), 6, 4, {
        name = "greatoceanp3",
        heading = 310,
        minZ = 10.63,
        maxZ = 15.63,
    }),
    ["greatoceanp4"] = BoxZone:Create(vector3(1446.12, 6589.4, 12.73), 6, 4, {
        name = "greatoceanp4",
        heading = 350,
        minZ = 10.73,
        maxZ = 15.73,
    }),
    ["greatoceanp5"] = BoxZone:Create(vector3(1382.51, 6587.28, 13.21), 6, 4, {
        name = "greatoceanp5",
        heading = 35,
        minZ = 10.21,
        maxZ = 16.21,
    }),
    ["greatoceanp6"] = BoxZone:Create(vector3(1374.48, 6580.13, 13.08), 6, 4, {
        name = "greatoceanp6",
        heading = 65,
        minZ = 10.08,
        maxZ = 16.08,
    }),
    ["greatoceanp7"] = BoxZone:Create(vector3(1371.12, 6558.75, 14.47), 6, 4, {
        name = "greatoceanp7",
        heading = 275,
        minZ = 11.47,
        maxZ = 17.47,
    }),
    ["greatoceanp8"] = BoxZone:Create(vector3(1415.42, 6593.6, 13.19), 6, 4, {
        name = "greatoceanp8",
        heading = 0,
        minZ = 11.19,
        maxZ = 16.19,
    }),
}

PlacesPublic = {
    ["airportpublic1"] = BoxZone:Create(vector3(-604.14, -2220.94, 6.0), 8, 4, {
        name = "airportpublic1",
        heading = 5,
        minZ = 5.0,
        maxZ = 9.0,
    }),
    ["airportpublic2"] = BoxZone:Create(vector3(-623.71, -2204.67, 6.0), 8, 4, {
        name = "airportpublic2",
        heading = 5,
        minZ = 5.0,
        maxZ = 9.0,
    }),
    ["airportpublic3"] = BoxZone:Create(vector3(-643.02, -2188.49, 5.99), 8, 4, {
        name = "airportpublic3",
        heading = 5,
        minZ = 4.99,
        maxZ = 8.99,
    }),
    ["airportpublic4"] = BoxZone:Create(vector3(-649.01, -2173.48, 5.99), 8, 4, {
        name = "airportpublic4",
        heading = 5,
        minZ = 4.99,
        maxZ = 8.99,
    }),
    ["airportpublic5"] = BoxZone:Create(vector3(-595.38, -2201.37, 5.99), 8, 4, {
        name = "airportpublic5",
        heading = 5,
        minZ = 4.99,
        maxZ = 8.99,
    }),
    ["airportpublic6"] = BoxZone:Create(vector3(-635.07, -2157.95, 5.99), 8, 4, {
        name = "airportpublic6",
        heading = 5,
        minZ = 4.99,
        maxZ = 8.99,
    }),
    ["airportpublic7"] = BoxZone:Create(vector3(-593.41, -2167.22, 5.99), 8, 4, {
        name = "airportpublic7",
        heading = 5,
        minZ = 4.99,
        maxZ = 8.99,
    }),
    ["airportpublic8"] = BoxZone:Create(vector3(-560.09, -2166.96, 5.99), 8, 4, {
        name = "airportpublic8",
        heading = 5,
        minZ = 4.99,
        maxZ = 8.99,
    }),
    ["airportpublic9"] = BoxZone:Create(vector3(-606.81, -2165.66, 5.99), 8, 4, {
        name = "airportpublic9",
        heading = 5,
        minZ = 4.99,
        maxZ = 8.99,
    }),
    ["airportpublic10"] = BoxZone:Create(vector3(-602.71, -2140.87, 5.99), 8, 4, {
        name = "airportpublic10",
        heading = 5,
        minZ = 4.99,
        maxZ = 8.99,
    }),
    ["haanparking1"] = BoxZone:Create(vector3(78.24, 6398.73, 31.23), 6, 4, {
        name = "haanparking1",
        heading = 315,
        minZ = 30.23,
        maxZ = 34.23,
    }),
    ["haanparking2"] = BoxZone:Create(vector3(72.49, 6404.33, 31.23), 6, 4, {
        name = "haanparking2",
        heading = 315,
        minZ = 30.23,
        maxZ = 34.23,
    }),
    ["haanparking3"] = BoxZone:Create(vector3(59.16, 6400.94, 31.23), 6, 4, {
        name = "haanparking3",
        heading = 35,
        minZ = 30.23,
        maxZ = 34.23,
    }),
    ["haanparking4"] = BoxZone:Create(vector3(66.4, 6379.7, 31.24), 6, 4, {
        name = "haanparking4",
        heading = 35,
        minZ = 30.24,
        maxZ = 34.24,
    }),
    ["haanparking5"] = BoxZone:Create(vector3(94.84, 6372.93, 31.23), 6, 4, {
        name = "haanparking5",
        heading = 15,
        minZ = 30.23,
        maxZ = 34.23,
    }),
    ["haanparking6"] = BoxZone:Create(vector3(48.64, 6362.48, 31.24), 6, 4, {
        name = "haanparking6",
        heading = 35,
        minZ = 30.24,
        maxZ = 34.24,
    }),
    ["haanparking7"] = BoxZone:Create(vector3(24.84, 6367.01, 31.23), 6, 4, {
        name = "haanparking7",
        heading = 35,
        minZ = 30.23,
        maxZ = 34.23,
    }),
    ["haanparking8"] = BoxZone:Create(vector3(27.97, 6331.08, 31.23), 6, 4, {
        name = "haanparking8",
        heading = 20,
        minZ = 30.23,
        maxZ = 34.23,
    }),
    ["haanparking9"] = BoxZone:Create(vector3(11.35, 6352.97, 31.23), 6, 4, {
        name = "haanparking9",
        heading = 35,
        minZ = 30.23,
        maxZ = 34.23,
    }),
    ["haanparking10"] = BoxZone:Create(vector3(42.51, 6385.19, 31.23), 6, 4, {
        name = "haanparking10",
        heading = 35,
        minZ = 30.23,
        maxZ = 34.23,
    }),
}

PlacesFourriere = {
    ["fourriere1"] = BoxZone:Create(vector3(502.05, -1336.41, 29.33), 6, 4, {
        name = "fourriere1",
        heading = 0,
        minZ = 28.33,
        maxZ = 32.33,
    }),
    ["fourriere2"] = BoxZone:Create(vector3(497.44, -1336.5, 29.34), 6, 4, {
        name = "fourriere2",
        heading = 0,
        minZ = 28.34,
        maxZ = 32.34,
    }),
    ["fourriere3"] = BoxZone:Create(vector3(481.31, -1334.2, 29.33), 6, 4, {
        name = "fourriere3",
        heading = 230,
        minZ = 28.33,
        maxZ = 32.33,
    }),
}

local function doCarDamage(currentVehicle, veh)
    local engine = veh.engine + 0.0
    local body = veh.body + 0.0

    Wait(100)
    if body < 900.0 then
        SmashVehicleWindow(currentVehicle, 0)
        SmashVehicleWindow(currentVehicle, 1)
        SmashVehicleWindow(currentVehicle, 2)
        SmashVehicleWindow(currentVehicle, 3)
        SmashVehicleWindow(currentVehicle, 4)
        SmashVehicleWindow(currentVehicle, 5)
        SmashVehicleWindow(currentVehicle, 6)
        SmashVehicleWindow(currentVehicle, 7)
    end
    if body < 800.0 then
        SetVehicleDoorBroken(currentVehicle, 0, true)
        SetVehicleDoorBroken(currentVehicle, 1, true)
        SetVehicleDoorBroken(currentVehicle, 2, true)
        SetVehicleDoorBroken(currentVehicle, 3, true)
        SetVehicleDoorBroken(currentVehicle, 4, true)
        SetVehicleDoorBroken(currentVehicle, 5, true)
        SetVehicleDoorBroken(currentVehicle, 6, true)
    end
    if engine < 700.0 then
        SetVehicleTyreBurst(currentVehicle, 1, false, 990.0)
        SetVehicleTyreBurst(currentVehicle, 2, false, 990.0)
        SetVehicleTyreBurst(currentVehicle, 3, false, 990.0)
        SetVehicleTyreBurst(currentVehicle, 4, false, 990.0)
    end
    if engine < 500.0 then
        SetVehicleTyreBurst(currentVehicle, 0, false, 990.0)
        SetVehicleTyreBurst(currentVehicle, 5, false, 990.0)
        SetVehicleTyreBurst(currentVehicle, 6, false, 990.0)
        SetVehicleTyreBurst(currentVehicle, 7, false, 990.0)
    end
    SetVehicleEngineHealth(currentVehicle, engine)
    SetVehicleBodyHealth(currentVehicle, body)

end

local function CheckPlayers(vehicle, garage)
    for i = -1, 5, 1 do
        local seat = GetPedInVehicleSeat(vehicle, i)
        if seat then
            TaskLeaveVehicle(seat, vehicle, 0)
            if garage then
                SetEntityCoords(seat, garage.blipcoord.x, garage.blipcoord.y, garage.blipcoord.z)
            end
        end
    end
    SetVehicleDoorsLocked(vehicle)
    Wait(100)
    QBCore.Functions.DeleteVehicle(vehicle)
end
-- Functions

local function round(num, numDecimalPlaces)
    return tonumber(string.format("%." .. (numDecimalPlaces or 0) .. "f", num))
end

local function SortirMenu(type, garage, indexgarage)
    if type == "public" then
        VehiculeParkingPublic:ClearItems()
        MenuV:OpenMenu(VehiculeParkingPublic)

        VehiculeParkingPublic:AddButton({
            icon = "◀",
            label = "Retour au menu",
            value = ParkingPublicList,
            select = function()
                VehiculeParkingPublic:Close()
            end,
        })

        QBCore.Functions.TriggerCallback("qb-garage:server:GetGarageVehicles", function(result)
            if result == nil then
                QBCore.Functions.Notify(Lang:t("error.no_vehicles"), "error", 5000)
            else
                for k, v in pairs(result) do
                    local enginePercent = round(v.engine / 10, 0)
                    local bodyPercent = round(v.body / 10, 0)
                    local currentFuel = v.fuel
                    local vname = QBCore.Shared.Vehicles[v.vehicle].name
                    if v.state == 0 then
                        v.state = Lang:t("status.out")
                    elseif v.state == 1 then
                        v.state = Lang:t("status.garaged")
                    elseif v.state == 2 then
                        v.state = Lang:t("status.impound")
                    end
                    VehiculeParkingPublic:AddButton({
                        label = Lang:t("menu.header.public", {
                            value = vname,
                            value2 = v.plate,
                        }),
                        description = Lang:t("menu.text.garage", {
                            value = v.state,
                            value2 = currentFuel,
                            value3 = enginePercent,
                            value4 = bodyPercent,
                        }),
                        select = function()
                            VehiculeParkingPublic:Close()
                            TriggerEvent("qb-garages:client:takeOutGarage", v, type, garage, indexgarage)
                        end,
                    })
                end
            end
        end, indexgarage, type, garage.vehicle)
    elseif type == "private" then
        VehiculeParkingPrive:ClearItems()
        MenuV:OpenMenu(VehiculeParkingPrive)

        VehiculeParkingPrive:AddButton({
            icon = "◀",
            label = "Retour au menu",
            value = ParkingPriveList,
            select = function()
                VehiculeParkingPrive:Close()
            end,
        })
        QBCore.Functions.TriggerCallback("qb-garage:server:GetGarageVehicles", function(result, time)
            if result == nil then
                QBCore.Functions.Notify(Lang:t("error.no_vehicles"), "error", 5000)
            else
                for k, v in pairs(result) do
                    local enginePercent = round(v.engine / 10, 0)
                    local bodyPercent = round(v.body / 10, 0)
                    local currentFuel = v.fuel
                    local vname = QBCore.Shared.Vehicles[v.vehicle].name
                    local timediff = time - v.parkingtime
                    local price = math.floor(timediff / 3600)

                    if v.state == 0 then
                        v.state = Lang:t("status.out")
                    elseif v.state == 1 then
                        v.state = Lang:t("status.garaged")
                    elseif v.state == 2 then
                        v.state = Lang:t("status.impound")
                    end
                    VehiculeParkingPrive:AddButton({
                        label = Lang:t("menu.header.private", {
                            value = vname,
                            value2 = v.plate,
                            value3 = price,
                        }),
                        description = Lang:t("menu.text.garage", {
                            value = v.state,
                            value2 = currentFuel,
                            value3 = enginePercent,
                            value4 = bodyPercent,
                        }),
                        select = function()
                            VehiculeParkingPrive:Close()
                            TriggerEvent("qb-garages:client:TakeOutPrive", v, type, garage, indexgarage, price)
                        end,
                    })
                end
            end
        end, indexgarage, type, garage.vehicle)
    elseif type == "depot" then
        VehiculeParkingFourriere:ClearItems()
        MenuV:OpenMenu(VehiculeParkingFourriere)

        QBCore.Functions.TriggerCallback("qb-garage:server:GetGarageVehicles", function(result)
            if result == nil then
                QBCore.Functions.Notify(Lang:t("error.no_vehicles"), "error", 5000)
            else
                for k, v in pairs(result) do
                    local enginePercent = round(v.engine / 10, 0)
                    local bodyPercent = round(v.body / 10, 0)
                    local currentFuel = v.fuel
                    local vname = QBCore.Shared.Vehicles[v.vehicle].name
                    if v.state == 0 then
                        v.state = Lang:t("status.out")
                    elseif v.state == 1 then
                        v.state = Lang:t("status.garaged")
                    elseif v.state == 2 then
                        v.state = Lang:t("status.impound")
                    end
                    VehiculeParkingFourriere:AddButton({
                        label = Lang:t("menu.header.depot", {
                            value = vname,
                            value2 = v.plate,
                            value3 = v.depotprice,
                        }),
                        description = Lang:t("menu.text.depot", {
                            value = v.state,
                            value2 = currentFuel,
                            value3 = enginePercent,
                            value4 = bodyPercent,
                        }),
                        select = function()
                            VehiculeParkingFourriere:Close()
                            TriggerEvent("qb-garages:client:TakeOutDepot", v, type, garage, indexgarage)
                        end,
                    })
                end
            end
        end, indexgarage, type, garage.vehicle)
    end
end

RegisterNetEvent("qb-garages:client:takeOutGarage", function(vehicle, type, garage, indexgarage)
    local spawn = false

    if type == "depot" then -- If depot, check if vehicle is not already spawned on the map
        local VehExists = DoesEntityExist(OutsideVehicles[vehicle.plate])
        if not VehExists then
            spawn = true
        else
            QBCore.Functions.Notify(Lang:t("error.not_impound"), "error", 5000)
            spawn = false
        end
    else
        spawn = true
    end
    if spawn then
        local enginePercent = round(vehicle.engine / 10, 1)
        local bodyPercent = round(vehicle.body / 10, 1)
        local currentFuel = vehicle.fuel
        local location
        local heading
        local placedispo = 0

        if type == "public" then
            for indexpublic, publicpar in pairs(PlacesPublic) do
                if indexpublic:sub(1, -2) == indexgarage then
                    local vehicles2 = GetGamePool("CVehicle")
                    local inside = false
                    for _, vehicle2 in ipairs(vehicles2) do
                        if publicpar:isPointInside(GetEntityCoords(vehicle2)) then
                            inside = true
                        end
                    end
                    if inside == false then
                        placedispo = placedispo + 1
                        location = publicpar:getBoundingBoxCenter()
                        heading = publicpar:getHeading()
                    end
                end
            end
        elseif type == "private" then
            for indexprive, privepar in pairs(PlacesPrives) do
                if indexprive:sub(1, -2) == indexgarage then
                    local vehicles2 = GetGamePool("CVehicle")
                    local inside = false
                    for _, vehicle2 in ipairs(vehicles2) do
                        if privepar:isPointInside(GetEntityCoords(vehicle2)) then
                            inside = true
                        end
                    end
                    if inside == false then
                        placedispo = placedispo + 1
                        location = privepar:getBoundingBoxCenter()
                        heading = privepar:getHeading()
                    end
                end
            end
        elseif type == "depot" then
            for indexfourriere, fourrierepar in pairs(PlacesFourriere) do
                if indexfourriere:sub(1, -2) == indexgarage then
                    local vehicles2 = GetGamePool("CVehicle")
                    local inside = false
                    for _, vehicle2 in ipairs(vehicles2) do
                        if fourrierepar:isPointInside(GetEntityCoords(vehicle2)) then
                            inside = true
                        end
                    end
                    if inside == false then
                        placedispo = placedispo + 1
                        location = fourrierepar:getBoundingBoxCenter()
                        heading = fourrierepar:getHeading()
                    end
                end
            end
        end
        local newlocation = vec4(location.x, location.y, location.z, heading)
        if placedispo == 0 then
            QBCore.Functions.Notify("Déjà une voiture sur un des parking", "primary", 4500)
        else
            QBCore.Functions.SpawnVehicle(vehicle.vehicle, function(veh)
                QBCore.Functions.TriggerCallback("qb-garage:server:GetVehicleProperties", function(properties)
                    if vehicle.plate then
                        OutsideVehicles[vehicle.plate] = veh
                        TriggerServerEvent("qb-garages:server:UpdateOutsideVehicles", OutsideVehicles)
                    end
                    QBCore.Functions.SetVehicleProperties(veh, properties)
                    SetVehicleNumberPlateText(veh, vehicle.plate)
                    SetFuel(veh, currentFuel + 0.0)
                    doCarDamage(veh, vehicle)
                    SetEntityAsMissionEntity(veh, true, true)
                    TriggerServerEvent("qb-garage:server:updateVehicleState", 0, vehicle.plate, vehicle.garage)
                    TriggerEvent("vehiclekeys:client:SetOwner", QBCore.Functions.GetPlate(veh))
                    SetVehicleEngineOn(veh, true, true)
                end, vehicle.plate)
            end, newlocation, true)
            QBCore.Functions.Notify(Lang:t("success.vehicle_out"), "primary", 4500)
        end
    end
end)

local function enterVehicle(veh, indexgarage, type, garage)
    local plate = QBCore.Functions.GetPlate(veh)
    local vehicleCoords = GetEntityCoords(veh)
    local insideParking = false
    if type == "prive" then
        if Zonesprives[indexgarage]:isPointInside(vehicleCoords) then
            insideParking = true
        end
    elseif type == "public" then
        if Zonespublic[indexgarage]:isPointInside(vehicleCoords) then
            insideParking = true
        end
    end
    if insideParking then
        QBCore.Functions.TriggerCallback("qb-garage:server:checkOwnership", function(owned)
            if owned then
                local bodyDamage = math.ceil(GetVehicleBodyHealth(veh))
                local engineDamage = math.ceil(GetVehicleEngineHealth(veh))
                local totalFuel = GetVehicleFuelLevel(veh)
                local vehProperties = QBCore.Functions.GetVehicleProperties(veh)
                CheckPlayers(veh, garage)
                TriggerServerEvent("qb-garage:server:updateVehicle", 1, totalFuel, engineDamage, bodyDamage, plate, indexgarage, type)
                if plate then
                    OutsideVehicles[plate] = nil
                    TriggerServerEvent("qb-garages:server:UpdateOutsideVehicles", OutsideVehicles)
                end
                QBCore.Functions.Notify(Lang:t("success.vehicle_parked"), "primary", 4500)
            else
                QBCore.Functions.Notify(Lang:t("error.not_owned"), "error", 3500)
            end
        end, plate, type, indexgarage, PlayerGang.name)
    else
        QBCore.Functions.Notify(Lang:t("error.not_in_parking"), "error", 3500)
    end
end

AddEventHandler("QBCore:Client:OnPlayerLoaded", function()
    PlayerData = QBCore.Functions.GetPlayerData()
    PlayerGang = PlayerData.gang
    PlayerJob = PlayerData.job
end)

RegisterNetEvent("QBCore:Client:OnGangUpdate", function(gang)
    PlayerGang = gang
end)

RegisterNetEvent("QBCore:Client:OnJobUpdate", function(job)
    PlayerJob = job
end)

CreateThread(function()
    for _, garage in pairs(Garages) do
        if garage.showBlip then
            local Garage = AddBlipForCoord(garage.blipcoord.x, garage.blipcoord.y, garage.blipcoord.z)
            SetBlipSprite(Garage, garage.blipNumber)
            SetBlipDisplay(Garage, 4)
            SetBlipScale(Garage, 0.60)
            SetBlipAsShortRange(Garage, true)
            if garage.type == "private" then
                SetBlipColour(Garage, 5)
            else
                SetBlipColour(Garage, 3)
            end
            BeginTextCommandSetBlipName("STRING")
            AddTextComponentSubstringPlayerName(garage.blipName)
            EndTextCommandSetBlipName(Garage)
        end
    end
end)

RegisterNetEvent("qb-garages:client:TakeOutDepot", function(v, type, garage, indexgarage)
    if v.depotprice ~= 0 then
        TriggerServerEvent("qb-garage:server:PayDepotPrice", v, type, garage, indexgarage)
    else
        TriggerEvent("qb-garages:client:takeOutGarage", v, type, garage, indexgarage)
    end
end)

RegisterNetEvent("qb-garages:client:TakeOutPrive", function(v, type, garage, indexgarage, price)
    if price ~= 0 then
        TriggerServerEvent("qb-garage:server:PayPrivePrice", v, type, garage, indexgarage, price)
    else
        TriggerEvent("qb-garages:client:takeOutGarage", v, type, garage, indexgarage)
    end
end)

local function ParkingPanel(menu, type, garage, indexgarage)

    if type == "public" then
        local button = menu:AddButton({label = "Ranger véhicule"})
        button:On("select", function()
            local curVeh = GetPlayersLastVehicle()
            local vehClass = GetVehicleClass(curVeh)
            if garage.vehicle == "car" or not garage.vehicle then
                if vehClass ~= 14 and vehClass ~= 15 and vehClass ~= 16 then
                    ParkingPublicList:Close()
                    enterVehicle(curVeh, indexgarage, type)
                else
                    QBCore.Functions.Notify(Lang:t("error.not_correct_type"), "error", 3500)
                end
            end
        end)
        local button2 = menu:AddButton({label = "Sortir véhicule"})
        button2:On("select", function()
            ParkingPublicList:Close()
            SortirMenu(type, garage, indexgarage)
        end)
    elseif type == "private" then
        local button = menu:AddButton({label = "Ranger véhicule"})
        button:On("select", function()
            local curVeh = GetPlayersLastVehicle()
            local vehClass = GetVehicleClass(curVeh)
            if garage.vehicle == "car" or not garage.vehicle then
                if vehClass ~= 14 and vehClass ~= 15 and vehClass ~= 16 then
                    ParkingPriveList:Close()
                    enterVehicle(curVeh, indexgarage, type)
                else
                    QBCore.Functions.Notify(Lang:t("error.not_correct_type"), "error", 3500)
                end
            end
        end)
        local button2 = menu:AddButton({label = "Sortir véhicule"})
        button2:On("select", function()
            ParkingPriveList:Close()
            SortirMenu(type, garage, indexgarage)
        end)
    elseif type == "depot" then
        local button2 = menu:AddButton({label = "Sortir véhicule"})
        button2:On("select", function()
            ParkingFourriereList:Close()
            SortirMenu(type, garage, indexgarage)
        end)
    end
end

local function GenerateMenu(type, garage, indexgarage)
    if type == "public" then
        if ParkingPublicList.IsOpen then
            ParkingPublicList:Close()
        else
            ParkingPublicList:ClearItems()
            ParkingPanel(ParkingPublicList, type, garage, indexgarage)
            ParkingPublicList:Open()
        end
    end
    if type == "private" then
        if ParkingPriveList.IsOpen then
            ParkingPriveList:Close()
        else
            ParkingPriveList:ClearItems()
            ParkingPanel(ParkingPriveList, type, garage, indexgarage)
            ParkingPriveList:Open()
        end
    end
    if type == "depot" then
        if ParkingFourriereList.IsOpen then
            ParkingFourriereList:Close()
        else
            ParkingFourriereList:ClearItems()
            ParkingPanel(ParkingFourriereList, type, garage, indexgarage)
            ParkingFourriereList:Open()
        end
    end
end

RegisterNetEvent("qb-garage:client:Menu", function(type, garage, indexgarage)
    GenerateMenu(type, garage, indexgarage)
end)

for indexpriv, prive in pairs(Zonesprives) do
    prive:onPointInOut(PolyZone.getPlayerPosition, function(isPointInside, point)
        if isPointInside then
            exports["qb-target"]:AddTargetModel(346573975, {
                options = {
                    {
                        type = "client",
                        event = "qb-garage:client:Menu",
                        icon = "fas fa-receipt",
                        label = "Accéder au parking privé",
                        targeticon = "fas fa-parking",
                        action = function(entity)
                            if IsPedAPlayer(entity) then
                                return false
                            end
                            for indexgarage, garage in pairs(Garages) do
                                if indexgarage == indexpriv then
                                    TriggerEvent("qb-garage:client:Menu", garage.type, garage, indexgarage)
                                end
                            end
                        end,
                    },
                },
                distance = 2.5,
            })
        else
            exports["qb-target"]:RemoveTargetModel(346573975, "Accéder au parking privé")
        end
    end)
end

for indexpublic, public in pairs(Zonespublic) do
    public:onPointInOut(PolyZone.getPlayerPosition, function(isPointInside, point)
        if isPointInside then
            exports["qb-target"]:AddTargetModel(-9379002, {
                options = {
                    {
                        type = "client",
                        event = "qb-garage:client:Menu",
                        icon = "fas fa-receipt",
                        label = "Accéder au parking public",
                        targeticon = "fas fa-parking",
                        action = function(entity)
                            if IsPedAPlayer(entity) then
                                return false
                            end
                            for indexgarage, garage in pairs(Garages) do
                                if indexgarage == indexpublic then
                                    TriggerEvent("qb-garage:client:Menu", garage.type, garage, indexgarage)
                                end
                            end
                        end,
                    },
                },
                distance = 2.5,
            })
        else
            exports["qb-target"]:RemoveTargetModel(-9379002, "Accéder au parking public")
        end
    end)
end

for indexfourriere, fourriere in pairs(Zonesfourriere) do
    fourriere:onPointInOut(PolyZone.getPlayerPosition, function(isPointInside, point)
        if isPointInside then
            exports["qb-target"]:AddTargetModel(115679102, {
                options = {
                    {
                        type = "client",
                        event = "qb-garage:client:Menu",
                        icon = "fas fa-receipt",
                        label = "Accéder à la fourrière",
                        targeticon = "fas fa-car-crash",
                        action = function(entity)
                            if IsPedAPlayer(entity) then
                                return false
                            end
                            for indexgarage, garage in pairs(Garages) do
                                if indexgarage == indexfourriere then
                                    TriggerEvent("qb-garage:client:Menu", garage.type, garage, indexgarage)
                                end
                            end
                        end,
                    },
                },
                distance = 2.5,
            })
        else
            exports["qb-target"]:RemoveTargetModel(115679102, "Accéder à la fourrière")
        end
    end)
end
