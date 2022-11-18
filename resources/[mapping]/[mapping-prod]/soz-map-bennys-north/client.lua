Citizen.CreateThread(function()
    RequestIpl("soz_bennys_north_milo_")

    local InteriorId = GetInteriorAtCoords(1902.43555, 3077.643, 45.91612)

    --  Walls
    --ActivateInteriorEntitySet(InteriorId, "walls_01")
    ActivateInteriorEntitySet(InteriorId, "walls_02")

    print(IsInteriorEntitySetActive(InteriorId, "walls_02"))

    --  Furnishing
    --ActivateInteriorEntitySet(InteriorId, "furnishings_01")
    ActivateInteriorEntitySet(InteriorId, "furnishings_02")

    --  Decorative
    --ActivateInteriorEntitySet(InteriorId, "decorative_01")
    ActivateInteriorEntitySet(InteriorId, "decorative_02")

    -- Mod Booth
    --ActivateInteriorEntitySet(InteriorId, "mod_booth")
    ActivateInteriorEntitySet(InteriorId, "no_mod_booth")

    -- Mural
    --ActivateInteriorEntitySet(InteriorId, "mural_01")
    --ActivateInteriorEntitySet(InteriorId, "mural_02")
    --ActivateInteriorEntitySet(InteriorId, "mural_03")
    --ActivateInteriorEntitySet(InteriorId, "mural_04")
    --ActivateInteriorEntitySet(InteriorId, "mural_05")
    --ActivateInteriorEntitySet(InteriorId, "mural_06")
    --ActivateInteriorEntitySet(InteriorId, "mural_07")
    --ActivateInteriorEntitySet(InteriorId, "mural_08")
    ActivateInteriorEntitySet(InteriorId, "mural_09")

    -- Gun Locker
    ActivateInteriorEntitySet(InteriorId, "gun_locker")
    --ActivateInteriorEntitySet(InteriorId, "no_gun_locker")

    -- Other
    --ActivateInteriorEntitySet(InteriorId, "cash_small")
    --ActivateInteriorEntitySet(InteriorId, "cash_medium")
    --ActivateInteriorEntitySet(InteriorId, "cash_large")
    --ActivateInteriorEntitySet(InteriorId, "counterfeit_small")
    --ActivateInteriorEntitySet(InteriorId, "counterfeit_medium")
    --ActivateInteriorEntitySet(InteriorId, "counterfeit_large")
    --ActivateInteriorEntitySet(InteriorId, "id_small")
    --ActivateInteriorEntitySet(InteriorId, "id_medium")
    --ActivateInteriorEntitySet(InteriorId, "id_large")
    --ActivateInteriorEntitySet(InteriorId, "weed_small")
    --ActivateInteriorEntitySet(InteriorId, "weed_medium")
    --ActivateInteriorEntitySet(InteriorId, "weed_large")
    --ActivateInteriorEntitySet(InteriorId, "coke_small")
    --ActivateInteriorEntitySet(InteriorId, "coke_medium")
    --ActivateInteriorEntitySet(InteriorId, "coke_large")
    --ActivateInteriorEntitySet(InteriorId, "meth_small")
    --ActivateInteriorEntitySet(InteriorId, "meth_medium")
    --ActivateInteriorEntitySet(InteriorId, "meth_large")
    ActivateInteriorEntitySet(InteriorId, "lower_walls_default")

    RefreshInterior(InteriorId)
end)
