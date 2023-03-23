Citizen.CreateThread(function()
    RequestIpl("soz_hei_sm_16_interior_v_bahama_milo_")

    local interiorID = GetInteriorAtCoords(-1395.68066, -600.0405, 29.7488689)

    if IsValidInterior(interiorID) then
        RemoveIpl("hei_sm_16_interior_v_bahama_milo_")
        RefreshInterior(interiorID)
    end
end)
