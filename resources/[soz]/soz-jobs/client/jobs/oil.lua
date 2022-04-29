local societyMenu = MenuV:CreateMenu(nil, "", "menu_job_fueler", "soz", "fueler:menu")

--- Targets
CreateThread(function()
    exports["qb-target"]:AddGlobalPlayer({
        options = {
            {label = "Facturer", icon = "c:jobs/facture.png", event = "jobs:client:fueler:InvoicePlayer", job = "oil"},
        },
        distance = 1.5,
    })

    exports["qb-target"]:AddBoxZone("mtp:duty", vector3(-246.62, 6090.77, 32.25), 0.15, 1.2, {
        name = "mtp:duty",
        heading = 45,
        minZ = 32.1,
        maxZ = 33.4,
    }, {options = SozJobCore.Functions.GetDutyActions("news"), distance = 2.5})
end)

--- Threads
CreateThread(function()
    QBCore.Functions.CreateBlip("jobs:oil", {
        name = "Michel Transport Petrol",
        coords = vector3(-243.97, 6071.59, 32.32),
        sprite = 436,
        scale = 1.0,
    })
end)
