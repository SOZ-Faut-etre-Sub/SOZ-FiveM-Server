--- Register Menu
CreateThread(function()
    PoliceJob.Menus["lspd"] = {
        menu = MenuV:CreateMenu(nil, "L'ordre et la justice !", "menu_job_lspd", "soz", "lspd:menu"),
    }
end)

--- Register Targets
CreateThread(function()
    exports["qb-target"]:AddBoxZone("lspd:duty", vector3(615.900574, 15.299749, 82.797417), 0.45, 0.35,
                                    {name = "lspd:duty", heading = 58.0, minZ = 82.697417, maxZ = 82.897417},
                                    {options = PoliceJob.Functions.GetDutyAction("lspd"), distance = 2.5})

    exports["qb-target"]:AddBoxZone("lspd:prisonerCloakroom", vector3(580.91, -29.72, 76.63), 0.6, 9.0,
                                    {name = "lspd:prisonerCloakroom", heading = 350, minZ = 75.63, maxZ = 78.63},
                                    {options = PoliceJob.Functions.GetCloakroomPrisonerAction(), distance = 2.5})
end)
