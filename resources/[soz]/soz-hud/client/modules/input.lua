local properties = nil

RegisterNUICallback("input/submit", function(data, cb)
    SetNuiFocus(false, false)
    if properties then
        properties:resolve(data.data)
    end
    properties = nil
    cb("ok")
end)

RegisterNUICallback("input/close", function(data, cb)
    SetNuiFocus(false, false)
    if properties then
        properties:resolve(nil)
    end
    properties = nil
    cb("ok")
end)

exports("Input", function(title, maxChar, content)
    SetNuiFocus(true, true)
    Wait(50)

    if properties then
        SetNuiFocus(false, false)
        properties:resolve(nil)
        properties = nil
        return
    end

    properties = promise.new()
    SendNUIMessage({action = "draw_input", title = title, maxChar = maxChar, content = content})

    return Citizen.Await(properties)
end)
