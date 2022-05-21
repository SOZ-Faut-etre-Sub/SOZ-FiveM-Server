console = {}

local function format(msg, ...)
    local params = {...}

    for i = 1, #params, 1 do
        if type(params[i]) == "table" then
            params[i] = json.encode(params[i])
        end
    end

    return (msg):format(table.unpack(params))
end


console.debug = function(msg, ...)
    if not Config.debug then
        return
    end

    print('[VoIP DEBUG]', format(msg, ...))
end

console.log = function(msg, ...)
    print(format(msg, ...))
end

console.info = function(msg, ...)
    print('[VoIP INFO]', format(msg, ...))
end

console.warn = function(msg, ...)
    print('[VoIP WARN]', format(msg, ...))
end

console.error = function(msg, ...)
    print('[VoIP ERROR]', format(msg, ...))
end
