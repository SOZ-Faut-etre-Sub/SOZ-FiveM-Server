--- Register Menu
CreateThread(function()
    PoliceJob.Menus["sasp"] = {
        menu = MenuV:CreateMenu(nil, "L'ordre et la justice !", "menu_job_sasp", "soz", "sasp:menu"),
    }
end)

--- Register Targets
CreateThread(function()
    exports["qb-target"]:AddBoxZone("sasp:duty", vector3(-563.57, -611.13, 34.68), 0.60, 1.00, {
        name = "sasp:duty",
        heading = 0.0,
        minZ = 33.68,
        maxZ = 35.68,
    }, {options = PoliceJob.Functions.GetDutyAction("sasp"), distance = 2.5})
end)
