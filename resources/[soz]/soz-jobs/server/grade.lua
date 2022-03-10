local QBCore = exports["qb-core"]:GetCoreObject()

RegisterServerEvent("job:recruit", function(target)
    local source = source
    local player = QBCore.Functions.GetPlayer(tonumber(source))

    if not CheckPlayerJobPermission(player, SozJobCore.JobPermission.RecruitPlayer) then
        return
    end
end)

RegisterServerEvent("job:grade:add", function(name)
    local source = source
    local player = QBCore.Functions.GetPlayer(tonumber(source))

    if not CheckPlayerJobPermission(player, SozJobCore.JobPermission.AddGrade) then
        return
    end
end)

RegisterServerEvent("job:grade:remove", function(id)
    local source = source
    local player = QBCore.Functions.GetPlayer(tonumber(source))

    if not CheckPlayerJobPermission(player, SozJobCore.JobPermission.RemoveGrade) then
        return
    end
end)

RegisterServerEvent("job:grade:set-default", function(id)
    local source = source
    local player = QBCore.Functions.GetPlayer(tonumber(source))

    if not CheckPlayerJobPermission(player, SozJobCore.JobPermission.SetDefaultGrade) then
        return
    end
end)

RegisterServerEvent("job:grade:set-salary", function(id, salary)
    local source = source
    local player = QBCore.Functions.GetPlayer(tonumber(source))

    if not CheckPlayerJobPermission(player, SozJobCore.JobPermission.SetGradeSalary) then
        return
    end
end)

RegisterServerEvent("job:grade:add-permission", function(id, permission)
    local source = source
    local player = QBCore.Functions.GetPlayer(tonumber(source))

    if not CheckPlayerJobPermission(player, SozJobCore.JobPermission.AddPermission) then
        return
    end
end)

RegisterServerEvent("job:grade:remove-permission", function(id, permission)
    local source = source
    local player = QBCore.Functions.GetPlayer(tonumber(source))

    if not CheckPlayerJobPermission(player, SozJobCore.JobPermission.RemovePermission) then
        return
    end
end)
