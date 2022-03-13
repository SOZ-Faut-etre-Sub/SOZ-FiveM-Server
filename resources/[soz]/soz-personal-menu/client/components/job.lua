function JobEntry(menu)
    local SozJobCore = exports["soz-jobs"]:GetCoreObject()
    local job = SozJobCore.Jobs[PlayerData.job.id]

    if not job then
        return
    end

    if not SozJobCore.Functions.HasPermission(SozJobCore.JobPermission.ManageGrade) then
        return
    end

    local jobMenu = MenuV:InheritMenu(menu, {subtitle = "Gestion entreprise"})
    menu:AddButton({label = "Gestion entreprise", value = jobMenu, description = "Gérer votre entreprise"})

    local gradeMenu = MenuV:InheritMenu(jobMenu, {subtitle = "Gestion grades"})
    jobMenu:AddButton({label = "Gestion grade", value = gradeMenu, description = "Gérer vos grades"})

    gradeMenu:AddButton({label = "Ajouter un grade", value = "add_grade"}):On("select", function()
        local gradeName = exports["soz-hud"]:Input("Nom du grade :", 32)

        if gradeName == "" or gradeName == nil then
            return
        end

        TriggerServerEvent("job:grade:add", gradeName)
        gradeMenu:Close()
        jobMenu:Close()
        menu:Close()
    end)

    for gradeId, grade in pairs(job.grades) do
        local label = "Grade : " .. grade.name

        if grade.is_default == 1 then
            label = label .. " (Défaut)"
        end

        local gradeItemMenu = MenuV:InheritMenu(gradeMenu, {subtitle = label})
        gradeMenu:AddButton({
            label = label,
            value = gradeItemMenu,
            description = "Gérer le grade '" .. grade.name .. "'",
        })

        gradeItemMenu:AddConfirm({
            label = "Supprimer",
            description = ("Etes vous sur de vouloir supprimer le grade %s ?"):format(grade.name),
            value = "n",
        }):On("confirm", function()
            TriggerServerEvent("job:grade:remove", gradeId)
            gradeItemMenu:Close()
            gradeMenu:Close()
            jobMenu:Close()
            menu:Close()
        end)

        if grade.is_default == 0 then
            gradeItemMenu:AddButton({label = "Définir par défaut", value = "set_default"}):On("select", function()
                TriggerServerEvent("job:grade:set-default", gradeId)
                gradeItemMenu:Close()
                gradeMenu:Close()
                jobMenu:Close()
                menu:Close()
            end)
        end

        gradeItemMenu:AddButton({label = "Changer le salaire (" .. grade.salary .. ")", value = "set_salary"}):On("select", function()
            local salary = exports["soz-hud"]:Input("Nouveau salaire :", 32)

            if salary == "" or salary == nil then
                return
            end

            salary = tonumber(salary)

            if salary < 0 then
                return
            end

            TriggerServerEvent("job:grade:set-salary", gradeId, salary)
            gradeItemMenu:Close()
            gradeMenu:Close()
            jobMenu:Close()
            menu:Close()
        end)

        for permissionId, permission in pairs(job.permissions) do
            local label = "Permission : " .. permission.label
            local value = "n"

            for _, gradePermission in ipairs(grade.permissions) do
                if gradePermission == permissionId then
                    value = "y"
                    break
                end
            end

            local permissionConfirm = gradeItemMenu:AddConfirm({
                label = label,
                description = "Activer / Désactiver la permission ?",
                value = value,
            });

            permissionConfirm:On("confirm", function()
                TriggerServerEvent("job:grade:add-permission", gradeId, permissionId)
            end)

            permissionConfirm:On("deny", function()
                TriggerServerEvent("job:grade:remove-permission", gradeId, permissionId)
            end)
        end
    end
end
