function SetPlayerTattoo(tattooList)
    ClearPedDecorations(GetPlayerPed(-1))
    for _, v in pairs(tattooList or {}) do
        AddPedDecorationFromHashes(GetPlayerPed(-1), GetHashKey(v.collection), GetHashKey(v.overlay))
    end
end

-- TODO rework this after clothe update
RegisterNetEvent("cui_character:recievePlayerData", function()
    Wait(500)
    QBCore.Functions.GetPlayerData(function(playerData)
        SetPlayerTattoo(playerData.metadata.tattoo)
    end)
end)
