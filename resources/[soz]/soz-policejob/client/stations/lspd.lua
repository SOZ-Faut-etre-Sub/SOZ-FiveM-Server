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

    exports["qb-target"]:AddBoxZone("lspd:cloakroom:man", vector3(626.93, 2.18, 76.63), 7.0, 8.4,
                                    {name = "lspd:cloakroom:man", heading = 350, minZ = 75.62, maxZ = 78.62},
                                    {options = PoliceJob.Functions.GetCloakroomAction("lspd"), distance = 2.5})

    exports["qb-target"]:AddBoxZone("lspd:cloakroom:woman", vector3(624.58, -5.48, 76.63), 6.8, 6.4,
                                    {name = "lspd:cloakroom:woman", heading = 350, minZ = 75.62, maxZ = 78.62},
                                    {options = PoliceJob.Functions.GetCloakroomAction("lspd"), distance = 2.5})

    exports["qb-target"]:AddBoxZone("lspd:prisonerCloakroom", vector3(580.91, -29.72, 76.63), 0.6, 9.0,
                                    {name = "lspd:prisonerCloakroom", heading = 350, minZ = 75.63, maxZ = 78.63},
                                    {options = PoliceJob.Functions.GetCloakroomPrisonerAction(), distance = 2.5})
end)
