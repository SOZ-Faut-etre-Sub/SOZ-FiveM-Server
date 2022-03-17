Config = {}

Config.Blacklist = { -- Integers | Blacklist classes from being towed.
    16, -- Planes
    21, -- Trains
}

Config.Flatbeds = {
    {
        Hash = "flatbed3", -- String | Hash Of The Vehicle
        Extras = {
            [1] = false, -- Integer | Enable/Disable Extra's When Used
        },
        Marker = vector3(-1.85, 0.4, -1.2), -- X, Y, Z | Marker Location
        Attach = vector2(0.0, 1.0), -- X, Y | Attach/Weld Location
        Radius = 3.0, -- Integer | ClosestVehicle Radius
        Default = {
            Pos = vector3(0.0, -3.8, 0.35), -- X, Y(Runs Second), Z(Runs First) | Default Offset Position
            Rot = vector3(0.0, 0.0, 0.0), -- X, Y, Z | Default Rotation
        },
        Active = {
            Pos = vector3(0.0, -8.20, -0.75), -- X, Y(Runs First), Z(Runs Second) | Lowered Offset Position
            Rot = vector3(16.0, 0.0, 0.0), -- X, Y, Z | Lowered Rotation
        },
    },
}

Config.BedProp = "inm_flatbed_base" -- String | Hash Of The Bed Prop
