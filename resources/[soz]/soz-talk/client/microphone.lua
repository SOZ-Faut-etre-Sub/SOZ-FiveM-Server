local microphoneInUse, microphoneProp = false, nil

--- Functions
local function toggleMicrophoneAnimation(pState)
    QBCore.Functions.RequestAnimDict("anim@mp_player_intselfiethumbs_up")
    if pState then
        TaskPlayAnim(PlayerPedId(), "anim@mp_player_intselfiethumbs_up", "idle_a", 2.0, 3.0, -1, 49, 0, 0, 0, 0)
        microphoneProp = CreateObject(GetHashKey("prop_microphone_02"), 1.0, 1.0, 1.0, 1, 1, 0)
        SetNetworkIdCanMigrate(ObjToNet(microphoneProp), false)
        AttachEntityToEntity(microphoneProp, PlayerPedId(), GetPedBoneIndex(PlayerPedId(), 36029), 0.08, 0.025, 0.034, 30.0, 95.0, 50.0, 1, 0, 0, 0, 2, 1)
    else
        StopAnimTask(PlayerPedId(), "anim@mp_player_intselfiethumbs_up", "idle_a", 1.0)
        ClearPedTasks(PlayerPedId())
        if microphoneProp ~= nil then
            DeleteObject(microphoneProp)
            microphoneProp = nil
        end
    end
end

local function useMicrophone()
    exports["soz-voip"]:SetPlayerMicrophoneInUse(true)
end

local function resetMicrophone()
    exports["soz-voip"]:SetPlayerMicrophoneInUse(false)
end

local function toggleMicrophone(toggle)
    microphoneInUse = toggle

    if microphoneInUse then
        useMicrophone()
    else
        resetMicrophone()
    end

    toggleMicrophoneAnimation(microphoneInUse)
end

RegisterNetEvent("talk:microphone:reset", function()
    toggleMicrophone(false)
end)

--- Events
RegisterNetEvent("talk:microphone:use", function()
    local player = PlayerPedId()
    if DoesEntityExist(player) and not PlayerData.metadata["isdead"] and not PlayerData.metadata["ishandcuffed"] and not PlayerData.metadata["inlaststand"] and
        not IsPauseMenuActive() then
        toggleMicrophone(not microphoneInUse)
    end
end)

RegisterNetEvent("QBCore:Player:SetPlayerData", function(PlayerData)
    local haveItem = false

    for _, item in pairs(PlayerData.items or {}) do
        if item.name == "microphone" then
            haveItem = true
            break
        end
    end

    if microphoneInUse and not haveItem then
        resetMicrophone()
    end
end)

