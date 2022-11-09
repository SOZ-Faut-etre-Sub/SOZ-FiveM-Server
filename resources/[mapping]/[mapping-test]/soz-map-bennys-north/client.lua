Citizen.CreateThread(function()
    RequestIpl("soz_bennys_north_milo_")

    local InteriorId = GetInteriorAtCoords(1913.56555, 3079.32568, 45.4842529)

    --  Walls
    --ActivateInteriorEntitySet(InteriorId, "walls_01")
    ActivateInteriorEntitySet(InteriorId, "walls_02")

    --  Furnishing
    ActivateInteriorEntitySet(InteriorId, "furnishings_01")
    ActivateInteriorEntitySet(InteriorId, "furnishings_02")

    --  Decorative
    ActivateInteriorEntitySet(InteriorId, "decorative_01")
    ActivateInteriorEntitySet(InteriorId, "decorative_02")

    -- Mod Booth
    ActivateInteriorEntitySet(InteriorId, "mod_booth")
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
    --ActivateInteriorEntitySet(InteriorId, "2714198362")
    --ActivateInteriorEntitySet(InteriorId, "1346358457")
    --ActivateInteriorEntitySet(InteriorId, "2709301048")
    --ActivateInteriorEntitySet(InteriorId, "1410070161")
    --ActivateInteriorEntitySet(InteriorId, "2660593274")
    --ActivateInteriorEntitySet(InteriorId, "2826404130")
    --ActivateInteriorEntitySet(InteriorId, "2351446632")
    --ActivateInteriorEntitySet(InteriorId, "2306124891")
    --ActivateInteriorEntitySet(InteriorId, "532222976")
    --ActivateInteriorEntitySet(InteriorId, "1548398432")
    --ActivateInteriorEntitySet(InteriorId, "308517329")
    --ActivateInteriorEntitySet(InteriorId, "3226340253")
    --ActivateInteriorEntitySet(InteriorId, "3380120703")
    --ActivateInteriorEntitySet(InteriorId, "2523817106")
    --ActivateInteriorEntitySet(InteriorId, "191529812")
    --ActivateInteriorEntitySet(InteriorId, "2750277723")
    --ActivateInteriorEntitySet(InteriorId, "3706839737")
    --ActivateInteriorEntitySet(InteriorId, "3516660704")
    ActivateInteriorEntitySet(InteriorId, "1450487160")
end)
