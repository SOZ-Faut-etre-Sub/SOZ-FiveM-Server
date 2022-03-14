Config = {}

Config.AllowedJobInteraction = {"lspd", "lscs"}

Config.Badge = GetHashKey("prop_fib_badge")

Config.Locations = {
    ["stations"] = {
        ["LSPD"] = {
            label = "Los Santos Police Department",
            blip = {sprite = 60, color = 29},
            coords = vector3(632.76, 7.31, 82.63),
        },
        ["LSCS"] = {
            label = "Los Santos Country Sheriff",
            blip = {sprite = 60, color = 21},
            coords = vector3(-447.66, 6013.5, 31.72),
        },
    },
}

Config.RadarAllowedVehicle = {"ambulance", "police", "police2", "police3", "policeb", "pbus", "sheriff", "sheriff2"}

Config.Radars = {
    -- [1] = {
    --    props = vector4(-54.77, 6338.8, 30.33, 155.46),
    --    zone = vector3(-60.35, 6321.91, 31.3),
    --    station = "lscs",
    --    isOnline = true,
    --    zoneRadius = 8,
    --    speed = 90,
    -- },
}
