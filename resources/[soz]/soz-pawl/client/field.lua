local SapHarvestedTrees = {}
local harvesting = false

local function ConcatPosition(position)
    local x = math.floor(position.x)
    local y = math.floor(position.y)
    local z = math.floor(position.z)

    return table.concat({x, y, z}, "-")
end

local function TreeInteraction(identifier, position)
    local zoneName = ("pawl:%s:%s"):format(identifier, position.x .. position.y)
    exports["qb-target"]:RemoveZone(zoneName)
    exports["qb-target"]:AddBoxZone(zoneName, position, 8.0, 8.0,
                                    {
        name = zoneName,
        heading = position.w or 0.0,
        minZ = position.z,
        maxZ = position.z + 5.0,
        debugPoly = false,
    }, {
        options = {
            {
                color = "pawl",
                label = "Récolter",
                icon = "c:pawl/harvest.png",
                event = "pawl:client:harvestTree",
                item = Config.Harvest.RequiredWeapon,
                canInteract = function()
                    return not harvesting and PlayerData.job.onduty
                end,
                job = "pawl",
                blackoutGlobal = true,
                blackoutJob = "pawl",
                --- metadata
                identifier = identifier,
                position = position,
            },
            {
                color = "pawl",
                label = "Récolter la sève",
                icon = "c:pawl/harvest.png",
                event = "pawl:client:harvestTreeSap",
                item = Config.Harvest.RequiredWeapon,
                canInteract = function()
                    local treeKey = ConcatPosition(position)
                    if SapHarvestedTrees[treeKey] ~= nil then
                        return false
                    end

                    return not harvesting and PlayerData.job.onduty
                end,
                job = "pawl",
                blackoutGlobal = true,
                blackoutJob = "pawl",
                --- metadata
                identifier = identifier,
                position = position,
            },
        },
        distance = 2.5,
    })
end

RegisterNetEvent("pawl:client:harvestTree", function(data)
    harvesting = true
    local ped = PlayerPedId()

    local HatchetWeapon = GetHashKey(Config.Harvest.RequiredWeapon)
    GiveWeaponToPed(ped, HatchetWeapon, 1, false, true)
    SetCurrentPedWeapon(ped, HatchetWeapon, true)

    Wait(3000)

    exports["soz-hud"]:DrawNotification("Vous êtes en train de ~g~couper l’arbre~s~.")
    local success, _ = exports["soz-utils"]:Progressbar("harvest-tree", "Vous récoltez...", Config.Harvest.Duration, false, true,
                                                        {disableMovement = true, disableCombat = true},
                                                        {
        animDict = "melee@large_wpn@streamed_core",
        anim = "plyr_rear_takedown_bat_r_facehit",
        flags = 17,
    }, {}, {})

    if success then
        local cutTree = QBCore.Functions.TriggerRpc("pawl:server:harvestTree", data.identifier, data.position)
        if cutTree then
            table.insert(Config.Field.List[data.identifier], GetGameTimer())

            local treeKey = ConcatPosition(data.position)
            SapHarvestedTrees[treeKey] = nil

            exports["soz-hud"]:DrawNotification("Vous avez ~g~découpé~s~ l’arbre.")
        else
            exports["soz-hud"]:DrawNotification("Vous avez ~r~raté~s~ la découpe de l’arbre.")
        end
    end

    RemoveWeaponFromPed(ped, HatchetWeapon)
    harvesting = false
end)

RegisterNetEvent("pawl:client:harvestTreeSap", function(data)
    harvesting = true
    local ped = PlayerPedId()

    local HatchetWeapon = GetHashKey(Config.Harvest.RequiredWeapon)
    GiveWeaponToPed(ped, HatchetWeapon, 1, false, true)
    SetCurrentPedWeapon(ped, HatchetWeapon, true)

    Wait(3000)

    exports["soz-hud"]:DrawNotification("Vous êtes en train de ~g~récolter de la sève~s~.")
    local success, _ = exports["soz-utils"]:Progressbar("harvest-tree", "Vous récoltez...", Config.Harvest.SapDuration, false, true,
                                                        {disableMovement = true, disableCombat = true},
                                                        {
        animDict = "melee@large_wpn@streamed_core",
        anim = "plyr_rear_takedown_bat_r_facehit",
        flags = 17,
    }, {}, {})

    if success then
        local sapTree = QBCore.Functions.TriggerRpc("pawl:server:harvestTreeSap", data.identifier, data.position)
        if sapTree then
            local treeKey = ConcatPosition(data.position)
            SapHarvestedTrees[treeKey] = true

            exports["soz-hud"]:DrawNotification("Vous avez ~g~récolté~s~ de la sève.")
        else
            exports["soz-hud"]:DrawNotification("Vous avez ~r~raté~s~ la récolte de la sève.")
        end
    end

    RemoveWeaponFromPed(ped, HatchetWeapon)
    harvesting = false
end)

RegisterNetEvent("pawl:client:syncField", function(identifier, data)
    local field = FieldTrees[identifier]
    if field == nil then
        FieldTrees[identifier] = {}
        field = FieldTrees[identifier]
    end

    --- Delete existing trees
    for k, v in pairs(field or {}) do
        DeleteObject(v)
        field[k] = nil
    end

    local currentTime = exports["soz-utils"]:GetTimestamp() / 1000

    if data then
        for _, v in pairs(data) do
            if (currentTime - v.harvestTime) * 1000 >= Config.Field.RefillDelay then
                local tree = CreateObjectNoOffset(v.model, v.position.x, v.position.y, v.position.z, false, false, false)
                SetEntityHeading(tree, v.position.w or 0.0)
                FreezeEntityPosition(tree, true)

                field[#field + 1] = tree
                TreeInteraction(identifier, v.position)
            else
                local zoneName = ("pawl:%s:%s"):format(identifier, v.position.x .. v.position.y)
                exports["qb-target"]:RemoveZone(zoneName)
            end
        end
    end
end)
