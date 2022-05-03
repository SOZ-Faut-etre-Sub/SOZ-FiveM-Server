local properties = nil

RegisterNUICallback("input/submit", function(data, cb)
    SetNuiFocus(false, false)
    properties:resolve(data.data)
    properties = nil
    cb("ok")
end)

RegisterNUICallback("input/close", function(data, cb)
    SetNuiFocus(false, false)
    properties:resolve(nil)
    properties = nil
    cb("ok")
end)

exports("Input", function(title, maxChar, content)
    SetNuiFocus(true, true)
    Wait(150)

    if properties ~= nil then
        SetNuiFocus(false, false)
        return
    end

    properties = promise.new()

    SendNUIMessage({action = "draw_input", title = title, maxChar = maxChar, content = content})

    return Citizen.Await(properties)
end)
