FoodResell = {
    coords = vector4(-57.01, -2448.4, 7.24, 145.77), -- Must be vec4
    ZoneName = "Resell:LSPort:Food",
    SourceAccount = "farm_food",
    TargetAccount = "safe_food",
}

DMCResell = {
    primary = {
        coords = vector4(-132.70, -2383.92, 6.00, 174.18), -- Must be vec4
        ZoneName = "Resell:LSPort:Dmc",
        SourceAccount = "farm_dmc",
        TargetAccount = "safe_dmc",
    },
    secondary = {ZoneName = "Resell:LSCustom", SourceAccount = "farm_dmc", TargetAccount = "safe_dmc"},
}

FieldHealthStates = {[0] = "0000", [1] = "1000", [2] = "1100", [3] = "1110", [4] = "1111"}
