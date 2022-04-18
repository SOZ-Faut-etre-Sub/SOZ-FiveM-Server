local weaponToAttach = {}
local settingsWeaponOnBack = {
    --- Shotguns
    [GetHashKey("WEAPON_PUMPSHOTGUN")] = {
        model = "w_sg_pumpshotgun",
        position = vec3(0.173, -0.14, -0.02),
        rotation = vec3(0, 45, 0),
    },
    [GetHashKey("WEAPON_PUMPSHOTGUN_MK2")] = {
        model = "w_sg_pumpshotgunmk2",
        position = vec3(0.173, -0.14, -0.02),
        rotation = vec3(0, 45, 0),
    },
    [GetHashKey("WEAPON_HEAVYSHOTGUN")] = {
        model = "w_sg_heavyshotgun",
        position = vec3(0.173, -0.14, -0.02),
        rotation = vec3(0, 45, 0),
    },
    [GetHashKey("WEAPON_MUSKET")] = {
        model = "w_ar_musket",
        position = vec3(0.173, -0.14, -0.02),
        rotation = vec3(0, 45, 0),
    },
    --- Assault riffles
    [GetHashKey("WEAPON_ADVANCEDRIFLE")] = {
        model = "w_ar_advancedrifle",
        position = vec3(0.173, -0.14, -0.02),
        rotation = vec3(0, 0, 0),
    },
    [GetHashKey("WEAPON_ASSAULTRIFLE")] = {
        model = "w_ar_assaultrifle",
        position = vec3(0.173, -0.14, -0.02),
        rotation = vec3(0, 0, 0),
    },
    [GetHashKey("WEAPON_ASSAULTRIFLE_MK2")] = {
        model = "w_ar_assaultriflemk2",
        position = vec3(0.173, -0.14, -0.02),
        rotation = vec3(0, 0, 0),
    },
    [GetHashKey("WEAPON_CARBINERIFLE")] = {
        model = "w_ar_carbinerifle",
        position = vec3(0.173, -0.14, -0.02),
        rotation = vec3(0, 0, 0),
    },
    [GetHashKey("WEAPON_CARBINERIFLE_MK2")] = {
        model = "w_ar_carbineriflemk2",
        position = vec3(0.173, -0.14, -0.02),
        rotation = vec3(0, 0, 0),
    },
    --- Snipers
    [GetHashKey("WEAPON_SNIPERRIFLE")] = {
        model = "w_sr_sniperrifle",
        position = vec3(0.173, -0.14, -0.02),
        rotation = vec3(0, 20, 0),
    },
    [GetHashKey("WEAPON_HEAVYSNIPER")] = {
        model = "w_sr_heavysniper",
        position = vec3(0.173, -0.14, -0.02),
        rotation = vec3(0, 20, 0),
    },
    --- Launchers
    [GetHashKey("WEAPON_RPG")] = {model = "w_lr_rpg", position = vec3(0.173, -0.14, -0.02), rotation = vec3(0, 150, 0)},
}

--- Functions
local function AttachWeapon(weaponHash, weaponName)
    local bone = GetPedBoneIndex(PlayerPedId(), 24816)
    local weaponConfig = settingsWeaponOnBack[weaponHash]

    if weaponToAttach[weaponName].handle ~= nil or weaponToAttach[weaponName].toRemove == true then
        return
    end

    RequestModel(GetHashKey(weaponConfig.model))
    while not HasModelLoaded(GetHashKey(weaponConfig.model)) do
        Wait(100)
    end

    weaponToAttach[weaponName].handle = CreateObject(GetHashKey(weaponConfig.model), 1.0, 1.0, 1.0, true, true, false)
    AttachEntityToEntity(weaponToAttach[weaponName].handle, PlayerPedId(), bone, weaponConfig.position.x, weaponConfig.position.y, weaponConfig.position.z,
                         weaponConfig.rotation.x, weaponConfig.rotation.y, weaponConfig.rotation.z, 1, 1, 0, 0, 2, 1)
end

local function CleanWeaponsOnBack()
    for _, weapon in pairs(weaponToAttach) do
        if weapon.toRemove == true and weapon.handle then
            DeleteObject(weapon.handle)
            weapon.handle = nil
        end
    end
end

local function UpdateWeaponsToAttach(items)
    for _, weapon in pairs(weaponToAttach) do
        if weapon.handle then
            DeleteObject(weapon.handle)
        end
    end
    weaponToAttach = {}

    for _, item in pairs(items or {}) do
        local QBItem = QBCore.Shared.Items[item.name]

        if QBItem and QBItem.type == "weapon" and settingsWeaponOnBack[GetHashKey(QBItem.name)] then
            weaponToAttach[QBItem.name] = {hash = GetHashKey(QBItem.name)}
        end
    end
end

--- Events
RegisterNetEvent("QBCore:Player:SetPlayerData", function(PlayerData)
    UpdateWeaponsToAttach(PlayerData.items or {})
end)

--- Loop
CreateThread(function()
    while true do
        local player = PlayerPedId()

        if LocalPlayer.state.isLoggedIn then

            for weaponName, weapon in pairs(weaponToAttach) do
                if IsPedInAnyVehicle(player, false) or GetSelectedPedWeapon(player) == weapon.hash then
                    weaponToAttach[weaponName].toRemove = true
                else
                    weaponToAttach[weaponName].toRemove = false
                end

                AttachWeapon(weapon.hash, weaponName)
            end

            CleanWeaponsOnBack()
        end

        Wait(500)
    end
end)

UpdateWeaponsToAttach(QBCore.Functions.GetPlayerData().items or {})
