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

