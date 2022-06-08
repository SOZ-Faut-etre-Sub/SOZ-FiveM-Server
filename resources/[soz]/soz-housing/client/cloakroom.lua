RegisterNetEvent("soz-housing:client:cloakroom", function()
    local clothes = QBCore.Functions.TriggerRpc("soz-character:server:GetPlayerCloakroom")
    local menu = Housing.Menus["housing"].menu

    menu:ClearItems()

    menu:AddButton({
        icon = "➕",
        label = "Sauvegarder la tenue",
        select = function()
            local name = exports["soz-hud"]:Input("Nom de la tenue", 64)

            if name == nil or name == "" then
                exports["soz-hud"]:DrawNotification("Veuillez entrer un nom pour votre tenue.", "error")
                return
            end

            local success = QBCore.Functions.TriggerRpc("soz-character:server:SavePlayerClothe", name)
            if success then
                exports["soz-hud"]:DrawNotification("Votre tenue a été sauvegardée.")
            else
                exports["soz-hud"]:DrawNotification("Une erreur est survenue.", "error")
            end
            menu:Close()
        end,
    })

    for _, clothe in pairs(clothes) do
        menu:AddSlider({
            icon = "👕",
            label = clothe.name,
            value = nil,
            values = {{label = "Se changer", value = "apply"}, {label = "Supprimer", value = "delete"}},
            select = function(_, value)
                if value == "apply" then
                    QBCore.Functions.Progressbar("switch_clothes", "Changement d'habits...", 5000, false, true, {
                        disableMovement = true,
                        disableCombat = true,
                    }, {
                        animDict = "anim@mp_yacht@shower@male@",
                        anim = "male_shower_towel_dry_to_get_dressed",
                        flags = 16,
                    }, {}, {}, function() -- Done
                        TriggerServerEvent("soz-character:server:SetPlayerClothes", clothe.cloth)
                    end)
                elseif value == "delete" then
                    local success = QBCore.Functions.TriggerRpc("soz-character:server:DeletePlayerClothe", clothe.id)
                    if success then
                        exports["soz-hud"]:DrawNotification("Votre tenue a été supprimée.")
                    else
                        exports["soz-hud"]:DrawNotification("Une erreur est survenue.", "error")
                    end
                end
                menu:Close()
            end,
        })
    end

    menu:Open()
end)

RegisterNetEvent("soz-housing:client:SetCloakroom", function(GlobalZone)
    Citizen.CreateThread(function()
        for _, zone in pairs(GlobalZone) do
            if zone.identifier and zone.closet_position then
                local closet = json.decode(zone.closet_position)

                exports["qb-target"]:AddBoxZone(zone.identifier .. "_closet", vector3(closet["x"], closet["y"], closet["z"]), closet["sx"], closet["sy"], {
                    name = zone.identifier .. "_closet",
                    heading = closet["heading"],
                    minZ = closet["minZ"],
                    maxZ = closet["maxZ"],
                }, {
                    options = {
                        {label = "Penderie", icon = "c:jobs/habiller.png", event = "soz-housing:client:cloakroom"},
                    },
                    distance = 2.5,
                })
            end
        end
    end)
end)
