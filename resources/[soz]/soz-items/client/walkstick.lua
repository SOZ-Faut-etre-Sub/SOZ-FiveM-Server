local walkStick = {
    enabled = false,
    object = nil
}

RegisterNetEvent('items:walkstick:toggle', function()
    walkStick.enabled = not walkStick.enabled
    if not walkStick.enabled then
        local ped = PlayerPedId()
        SetPedMovementClipset(ped, 'move_heist_lester', 1.0)
        TriggerServerEvent("QBCore:Server:SetMetaData", "walk", "move_heist_lester")
        walkStick.object = CreateObject(GetHashKey("prop_cs_walking_stick"), 0, 0, 0, true, true, true)
        AttachEntityToEntity(walkStick.object, ped, GetPedBoneIndex(ped, 57005), 0.16, 0.06, 0.0, 335.0, 300.0, 120.0, true, true, false, true, 5, true)
    else
        ResetPedMovementClipset(PlayerPedId())
        TriggerServerEvent("QBCore:Server:SetMetaData", "walk", "")
        DetachEntity(walkStick.object, 0, 0)
        DeleteEntity(walkStick.object)
    end
end)
