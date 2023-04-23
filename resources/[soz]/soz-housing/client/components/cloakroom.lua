Housing.Functions.Components.SetupCloakroomInteraction = function(propertyId, apartmentId, apartment)
    local closetZone = apartment:GetClosetCoord()
    local zoneName = "apartment_" .. apartmentId .. "_closet"

    Housing.Functions.TargetInteraction(zoneName, closetZone, {
        {
            label = "Penderie",
            icon = "c:jobs/habiller.png",
            event = "housing:client:cloakroom",
            canInteract = function()
                return not apartment:IsAvailable() and Housing.Functions.IsInsideApartment()
            end,
        },
    })
end

RegisterNetEvent("housing:client:cloakroom", function()
    local clothes = QBCore.Functions.TriggerRpc("soz-character:server:GetPlayerCloakroom")

    Housing.Functions.GenerateMenu(function(menu)
        menu:AddButton({
            icon = "➕",
            label = "Sauvegarder la tenue",
            select = function()
                local name = exports["soz-hud"]:Input("Nom de la tenue", 64)

                local error = QBCore.Functions.TriggerRpc("soz-character:server:SavePlayerClothe", name)
                if error == nil then
                    exports["soz-hud"]:DrawNotification("Votre tenue a été sauvegardée.")
                else
                    exports["soz-hud"]:DrawNotification(error, "error")
                    return
                end
                menu:Close()
            end,
        })

        for _, clothe in pairs(clothes) do
            menu:AddSlider({
                icon = "👕",
                label = clothe.name,
                value = nil,
                values = {
                    {label = "Se changer", value = "apply"},
                    {label = "Renommer", value = "rename"},
                    {label = "Supprimer", value = "delete"},
                },
                select = function(_, value)
                    if value == "apply" then
                        QBCore.Functions.Progressbar("switch_clothes", "Changement d'habits...", 5000, false, true,
                                                     {disableMovement = true, disableCombat = true},
                                                     {
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
                    elseif value == "rename" then
                        local name = exports["soz-hud"]:Input("Nom de la tenue", 64)

                        if name == nil or name == "" then
                            exports["soz-hud"]:DrawNotification("Veuillez entrer un nouveau nom pour votre tenue.", "error")
                            return
                        end

                        local success = QBCore.Functions.TriggerRpc("soz-character:server:RenamePlayerClothe", clothe.id, name)
                        if success then
                            exports["soz-hud"]:DrawNotification("Votre tenue a été renommée.")
                        else
                            exports["soz-hud"]:DrawNotification("Une erreur est survenue.", "error")
                        end
                    end
                    menu:Close()
                end,
            })
        end
    end)
end)
