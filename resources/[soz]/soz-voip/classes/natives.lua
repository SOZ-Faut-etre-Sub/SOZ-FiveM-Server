Natives = setmetatable({}, {
    __index = function(_, name)
        return function(...)
            return Citizen.InvokeNative(GetHashKey(name) & 0xFFFFFFFF, ...)
        end
    end
})
