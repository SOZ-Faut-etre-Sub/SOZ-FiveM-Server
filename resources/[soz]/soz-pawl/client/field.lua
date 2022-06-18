local function TreeInteraction(identifier, position)
    local zoneName = ("storage:%s:%s"):format(identifier, position.x .. position.y)
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
                label = "Récolter",
                icon = "c:inventory/ouvrir_le_stockage.png",
                event = "pawl:client:harvestTree",
                item = Config.Harvest.RequiredWeapon,
                canInteract = function()
                    return PlayerData.job.onduty
                end,
                --- metadata
                identifier = identifier,
                position = position,
            },
        },
        distance = 2.5,
    })
end

local function CanHarvestField(identifier)
    local hit, maxHit = 0, Config.Fields[identifier].capacity
    for _, time in pairs(FieldHarvest[identifier] or {}) do
        if GetGameTimer() - time <= Config.Fields[identifier].refillDelay then
            hit = hit + 1
            if hit >= maxHit then
                return false
            end
        end
    end
    return true
end

RegisterNetEvent("pawl:client:harvestTree", function(data)
    if not CanHarvestField(data.identifier) then
        exports["soz-hud"]:DrawNotification("Vous avez ~r~dépassé~s~ le quota de coupe d’arbre.", "error")
        return
    end

    exports["soz-hud"]:DrawNotification("Vous êtes en train de ~g~couper l’arbre~s~.")
    local success, _ = exports["soz-utils"]:Progressbar("harvest-tree", "Vous récoltez...", Config.Harvest.Duration, false, true,
                                                        {disableMovement = true, disableCombat = true},
                                                        {
        animDict = "melee@hatchet@streamed_core",
        anim = "plyr_front_takedown",
        flags = 17,
    }, {}, {})

    if success then
        local cutTree = QBCore.Functions.TriggerRpc("pawl:server:harvestTree", data.identifier, data.position)
        if cutTree then
            if FieldHarvest[data.identifier] == nil then
                FieldHarvest[data.identifier] = {}
            end
            table.insert(FieldHarvest[data.identifier], GetGameTimer())

            exports["soz-hud"]:DrawNotification("Vous avez ~g~découpé~s~ l’arbre.")
        else
            exports["soz-hud"]:DrawNotification("Vous avez ~r~raté~s~ la découpe de l’arbre.")
        end
    end
end)

RegisterNetEvent("pawl:client:syncField", function(identifier, data)
    local field = FieldTrees[identifier]
    if field == nil then
        FieldTrees[identifier] = {}
        field = FieldTrees[identifier]
    end
    local model = Config.Fields[identifier].model

    --- Delete existing trees
    for k, v in pairs(field or {}) do
        DeleteObject(v)
        field[k] = nil
    end

    for _, v in pairs(data) do
        local tree = CreateObjectNoOffset(model, v.position.x, v.position.y, v.position.z, false, false, false)
        SetEntityHeading(tree, v.w or 0.0)
        FreezeEntityPosition(tree, true)

        field[#field + 1] = tree
        TreeInteraction(identifier, v.position)
    end
end)
