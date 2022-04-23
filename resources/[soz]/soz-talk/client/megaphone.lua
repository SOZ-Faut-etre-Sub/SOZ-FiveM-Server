local megaphoneInUse, megaphoneProp = false, nil

--- Functions
local function toggleMegaphoneAnimation(pState)
    QBCore.Functions.RequestAnimDict("anim@random@shop_clothes@watches")
    if pState then
        TaskPlayAnim(PlayerPedId(), "anim@random@shop_clothes@watches", "base", 2.0, 3.0, -1, 49, 0, 0, 0, 0)
        megaphoneProp = CreateObject(GetHashKey("prop_megaphone_01"), 1.0, 1.0, 1.0, 1, 1, 0)
        AttachEntityToEntity(megaphoneProp, PlayerPedId(), GetPedBoneIndex(PlayerPedId(), 60309), 0.10, 0.05, 0.012, 20.0, 110.0, 70.0, 1, 0, 0, 0, 2, 1)
    else
        StopAnimTask(PlayerPedId(), "anim@random@shop_clothes@watches", "base", 1.0)
        ClearPedTasks(PlayerPedId())
        if megaphoneProp ~= nil then
            DeleteObject(megaphoneProp)
            megaphoneProp = nil
        end
    end
end

local function useMegaphone()
    LocalPlayer.state:set("useMegaphone", true, true)
    exports["soz-voip"]:overrideProximityRange(Config.Megaphone.Range, true)
end

local function resetMegaphone()
    LocalPlayer.state:set("useMegaphone", false, true)
    exports["soz-voip"]:clearProximityOverride()
end

local function toggleMegaphone(toggle)
    megaphoneInUse = toggle

    if megaphoneInUse then
        useMegaphone()
    else
        resetMegaphone()
    end

    toggleMegaphoneAnimation(megaphoneInUse)
end

--- Events
RegisterNetEvent("talk:megaphone:use", function()
    local player = PlayerPedId()
    if DoesEntityExist(player) and not PlayerData.metadata["isdead"] and not PlayerData.metadata["ishandcuffed"] and not PlayerData.metadata["inlaststand"] and
        not IsPauseMenuActive() then
        toggleMegaphone(not megaphoneInUse)
    end
end)

RegisterNetEvent("QBCore:Player:SetPlayerData", function(PlayerData)
    local haveItem = false

    for _, item in pairs(PlayerData.items or {}) do
        if item.name == "megaphone" then
            haveItem = true
            break
        end
    end

    if not haveItem then
        resetMegaphone()
    end
end)

