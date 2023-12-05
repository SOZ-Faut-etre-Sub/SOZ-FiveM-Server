RegisterServerEvent("job:recruit", function(target)
    local source = source
    local player = QBCore.Functions.GetPlayer(tonumber(source))

    if not CheckPlayerJobPermission(player.PlayerData, player.PlayerData.job.id, SozJobCore.JobPermission.ManageGrade) and
        not CheckPlayerJobPermission(player.PlayerData, player.PlayerData.job.id, SozJobCore.JobPermission.Enrollment) then
        return
    end

    local targetPlayer = QBCore.Functions.GetPlayer(tonumber(target))

    if targetPlayer.PlayerData.job.id ~= SozJobCore.JobType.Unemployed then
        TriggerClientEvent("soz-core:client:notification:draw", source, ("~g~%s~s~ n'est pas embauchable !"):format(targetPlayer.Functions.GetName()), "error")

        return
    end

    targetPlayer.Functions.SetJob(player.PlayerData.job.id, GetJobDefaultGrade(player.PlayerData.job.id))

    TriggerClientEvent("soz-core:client:notification:draw", source,
                       ("~g~%s~s~ fait maintenant partie de vos effectifs !"):format(targetPlayer.Functions.GetName()), "info")
    TriggerClientEvent("soz-core:client:notification:draw", targetPlayer.PlayerData.source, "Vous avez été ~g~embauché~s~ !", "info")
end)

RegisterServerEvent("job:fire", function(target)
    local source = source
    local player = QBCore.Functions.GetPlayer(tonumber(source))
    local playerGradeWeight = SozJobCore.Jobs[player.PlayerData.job.id].grades[tostring(player.PlayerData.job.grade)].weight

    if not CheckPlayerJobPermission(player.PlayerData, player.PlayerData.job.id, SozJobCore.JobPermission.ManageGrade) and
        not CheckPlayerJobPermission(player.PlayerData, player.PlayerData.job.id, SozJobCore.JobPermission.Enrollment) then
        return
    end

    local targetPlayer = QBCore.Functions.GetPlayer(tonumber(target))
    local targetGradeWeight = SozJobCore.Jobs[targetPlayer.PlayerData.job.id].grades[tostring(targetPlayer.PlayerData.job.grade)].weight

    if targetPlayer.PlayerData.job.id ~= player.PlayerData.job.id then
        TriggerClientEvent("soz-core:client:notification:draw", source, ("~g~%s~s~ n'est pas embauchable !"):format(targetPlayer.Functions.GetName()), "error")

        return
    end

    if targetGradeWeight > playerGradeWeight then
        TriggerClientEvent("soz-core:client:notification:draw", source, ("~r~%s~s~ ne peut pas être viré !"):format(targetPlayer.Functions.GetName()), "error")

        return
    end

    if targetPlayer.PlayerData.job.onduty then
        targetPlayer.Functions.SetJobDuty(false)
        TriggerClientEvent("QBCore:Client:SetDuty", targetPlayer.PlayerData.source, false)
        TriggerEvent("QBCore:Server:SetDuty", targetPlayer.PlayerData.job.id, false, targetPlayer.PlayerData.source)
    end

    targetPlayer.Functions.SetJob(SozJobCore.JobType.Unemployed, GetJobDefaultGrade(SozJobCore.JobType.Unemployed))

    TriggerClientEvent("soz-core:client:notification:draw", source,
                       ("~r~%s~s~ ne fait plus partie de vos effectifs !"):format(targetPlayer.Functions.GetName()), "info")
    TriggerClientEvent("soz-core:client:notification:draw", targetPlayer.PlayerData.source, "Vous avez été ~r~viré~s~ !", "info")
end)

RegisterServerEvent("job:promote", function(target, gradeId)
    local source = source
    local player = QBCore.Functions.GetPlayer(tonumber(source))
    local playerGradeWeight = SozJobCore.Jobs[player.PlayerData.job.id].grades[tostring(player.PlayerData.job.grade)].weight

    if not CheckPlayerJobPermission(player.PlayerData, player.PlayerData.job.id, SozJobCore.JobPermission.ManageGrade) and
        not CheckPlayerJobPermission(player.PlayerData, player.PlayerData.job.id, SozJobCore.JobPermission.Enrollment) then
        return
    end

    local targetPlayer = QBCore.Functions.GetPlayer(tonumber(target))
    local targetGradeWeight = SozJobCore.Jobs[targetPlayer.PlayerData.job.id].grades[tostring(targetPlayer.PlayerData.job.grade)].weight

    if targetPlayer.PlayerData.job.id ~= player.PlayerData.job.id then
        TriggerClientEvent("soz-core:client:notification:draw", source, ("~g~%s~s~ n'est pas embauchable !"):format(targetPlayer.Functions.GetName()), "error")

        return
    end

    local grade = SozJobCore.Jobs[targetPlayer.PlayerData.job.id].grades[tostring(gradeId)]

    if grade.weight > playerGradeWeight or targetGradeWeight > playerGradeWeight then
        TriggerClientEvent("soz-core:client:notification:draw", source, ("~r~%s~s~ ne peut pas être promu !"):format(targetPlayer.Functions.GetName()), "error")

        return
    end

    targetPlayer.Functions.SetJob(targetPlayer.PlayerData.job.id, gradeId)
    TriggerClientEvent("soz-core:client:notification:draw", source, ("~b~%s~s~ a été promu ~b~%s~s~ !"):format(targetPlayer.Functions.GetName(), grade.name),
                       "info")
    TriggerClientEvent("soz-core:client:notification:draw", targetPlayer.PlayerData.source, ("Vous avez été promu ~b~%s~s~ !"):format(grade.name), "info")
end)

RegisterServerEvent("job:grade:add", function(name)
    local source = source
    local player = QBCore.Functions.GetPlayer(tonumber(source))

    if not CheckPlayerJobPermission(player.PlayerData, player.PlayerData.job.id, SozJobCore.JobPermission.ManageGrade) then
        return
    end

    local job = SozJobCore.Jobs[player.PlayerData.job.id]

    if not job then
        return
    end

    MySQL.insert.await("INSERT INTO job_grades (jobId, name) VALUES (@jobId, @name)", {
        ["@jobId"] = player.PlayerData.job.id,
        ["@name"] = name,
    })

    TriggerClientEvent("soz-core:client:notification:draw", source, "Le grade a été ajouté !")
    SynchroniseJob()
end)

RegisterServerEvent("job:grade:remove", function(id)
    local source = source
    local player = QBCore.Functions.GetPlayer(tonumber(source))

    if not CheckPlayerJobPermission(player.PlayerData, player.PlayerData.job.id, SozJobCore.JobPermission.ManageGrade) then
        return
    end

    local job = SozJobCore.Jobs[player.PlayerData.job.id]

    if not job then
        return
    end

    local grade = job.grades[tostring(id)]

    if not grade then
        return
    end

    if grade.owner == 1 then
        TriggerClientEvent("soz-core:client:notification:draw", source, "Vous ne pouvez pas supprimer le grade de patron !", "error")

        return
    end

    if grade.is_default == 1 then
        TriggerClientEvent("soz-core:client:notification:draw", source, "Vous ne pouvez pas supprimer le grade par défaut !", "error")

        return
    end

    -- @TODO Check if there is player with this grade ?
    MySQL.execute.await("DELETE FROM `job_grades` WHERE `id` = @id", {["@id"] = id})
    TriggerClientEvent("soz-core:client:notification:draw", source, "Le grade a été supprimé ! !")
    SynchroniseJob()
end)

RegisterServerEvent("job:grade:set-default", function(id)
    local source = source
    local player = QBCore.Functions.GetPlayer(tonumber(source))

    if not CheckPlayerJobPermission(player.PlayerData, player.PlayerData.job.id, SozJobCore.JobPermission.ManageGrade) then
        return
    end

    local job = SozJobCore.Jobs[player.PlayerData.job.id]

    if not job then
        return
    end

    local grade = job.grades[tostring(id)]

    if not grade then
        return
    end

    MySQL.execute.await("UPDATE `job_grades` SET is_default = 0 WHERE jobId = @id", {["@id"] = player.PlayerData.job.id})
    MySQL.execute.await("UPDATE `job_grades` SET is_default = 1 WHERE id = @id", {["@id"] = id})
    TriggerClientEvent("soz-core:client:notification:draw", source, "Le grade a été défini par défaut !")
    SynchroniseJob()
end)

RegisterServerEvent("job:grade:set-salary", function(id, salary)
    local source = source
    local player = QBCore.Functions.GetPlayer(tonumber(source))

    if not CheckPlayerJobPermission(player.PlayerData, player.PlayerData.job.id, SozJobCore.JobPermission.ManageGrade) then
        return
    end

    local job = SozJobCore.Jobs[player.PlayerData.job.id]

    if not job then
        return
    end

    local grade = job.grades[tostring(id)]

    if not grade then
        return
    end

    salary = tonumber(salary)

    if salary == nil or salary < 0 then
        return
    end

    MySQL.execute.await("UPDATE `job_grades` SET salary = @salary WHERE id = @id", {["@id"] = id, ["@salary"] = salary})
    TriggerClientEvent("soz-core:client:notification:draw", source, "Le salaire a bien été défini !")
    SynchroniseJob()
end)

RegisterServerEvent("job:grade:set-weight", function(id, weight)
    local source = source
    local player = QBCore.Functions.GetPlayer(tonumber(source))

    if not CheckPlayerJobPermission(player.PlayerData, player.PlayerData.job.id, SozJobCore.JobPermission.ManageGrade) then
        return
    end

    local job = SozJobCore.Jobs[player.PlayerData.job.id]
    if not job then
        return
    end

    local grade = job.grades[tostring(id)]
    if not grade then
        return
    end

    weight = tonumber(weight)
    if weight == nil or weight < 0 then
        return
    end

    MySQL.execute.await("UPDATE `job_grades` SET weight = @weight WHERE id = @id", {["@id"] = id, ["@weight"] = weight})
    TriggerClientEvent("soz-core:client:notification:draw", source, "Le poids a bien été défini !")
    SynchroniseJob()
end)

RegisterServerEvent("job:grade:add-permission", function(id, permission)
    local source = source
    local player = QBCore.Functions.GetPlayer(tonumber(source))

    if not CheckPlayerJobPermission(player.PlayerData, player.PlayerData.job.id, SozJobCore.JobPermission.ManageGrade) then
        return
    end

    local job = SozJobCore.Jobs[player.PlayerData.job.id]

    if not job then
        return
    end

    local grade = job.grades[tostring(id)]

    if not grade then
        return
    end

    if not job.permissions[permission] then
        return
    end

    local newPermissions = {};

    for _, existingPermission in ipairs(grade.permissions or {}) do
        if existingPermission ~= permission then
            table.insert(newPermissions, existingPermission)
        end
    end

    table.insert(newPermissions, permission)

    MySQL.execute.await("UPDATE `job_grades` SET permissions = @permissions WHERE id = @id", {
        ["@id"] = id,
        ["@permissions"] = json.encode(newPermissions),
    })
    TriggerClientEvent("soz-core:client:notification:draw", source, "La permission a bien été ajoutée !")
    SynchroniseJob()
end)

RegisterServerEvent("job:grade:remove-permission", function(id, permission)
    local source = source
    local player = QBCore.Functions.GetPlayer(tonumber(source))

    if not CheckPlayerJobPermission(player.PlayerData, player.PlayerData.job.id, SozJobCore.JobPermission.ManageGrade) then
        return
    end

    local job = SozJobCore.Jobs[player.PlayerData.job.id]

    if not job then
        return
    end

    local grade = job.grades[tostring(id)]

    if not grade then
        return
    end

    if not job.permissions[permission] then
        return
    end

    local newPermissions = {};

    for _, existingPermission in ipairs(grade.permissions) do
        if existingPermission ~= permission then
            table.insert(newPermissions, existingPermission)
        end
    end

    MySQL.execute.await("UPDATE `job_grades` SET permissions = @permissions WHERE id = @id", {
        ["@id"] = id,
        ["@permissions"] = json.encode(newPermissions),
    })
    TriggerClientEvent("soz-core:client:notification:draw", source, "La permission a bien été supprimée !")
    SynchroniseJob()
end)
