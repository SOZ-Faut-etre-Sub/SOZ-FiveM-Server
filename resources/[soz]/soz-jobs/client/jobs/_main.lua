function DisplayFieldHealth(newVisibility, field, health)
    if newVisibility then
        SendNUIMessage({action = "show", health = FieldHealthStates[health], field = string.match(field, "%a+")})
    else
        SendNUIMessage({action = "hide"})
    end
end
