Citizen.CreateThread(function()
    RequestIpl("soz_upw_location")

    local interiorID = GetInteriorAtCoords(617.226, 2759.21631, 25.0350819)

    if IsValidInterior(interiorID) then
        RemoveIpl("lr_cs4_13_interior_v_clothesmid_milo_")
        RefreshInterior(interiorID)
    end
end)
