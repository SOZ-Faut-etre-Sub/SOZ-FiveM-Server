math.randomseed(os.time())
math.random()

local function num2bs(num)
    local _mod = math.fmod or math.mod
    local _floor = math.floor

    local result = ""
    if(num == 0) then return "0" end
    while(num  > 0) do
        result = _mod(num,2) .. result
        num = _floor(num*0.5)
    end
    return result
end

local function bs2num(num)
    local _sub = string.sub
    local index, result = 0, 0
    if(num == "0") then return 0; end
    for p=#num,1,-1 do
        local this_val = _sub( num, p,p )
        if this_val == "1" then
            result = result + ( 2^index )
        end
        index=index+1
    end
    return result
end

local function padbits(num,bits)
    if #num == bits then return num end
    if #num > bits then print("too many bits") end
    local pad = bits - #num
    for i=1,pad do
        num = "0" .. num
    end
    return num
end
--
function UuidV4()
    local _rnd = math.random
    local _fmt = string.format

    _rnd()

    local time_low_a = _rnd(0, 65535)
    local time_low_b = _rnd(0, 65535)

    local time_mid = _rnd(0, 65535)

    local time_hi = _rnd(0, 4095 )
    time_hi = padbits( num2bs(time_hi), 12 )
    local time_hi_and_version = bs2num( "0100" .. time_hi )

    local clock_seq_hi_res = _rnd(0,63)
    clock_seq_hi_res = padbits( num2bs(clock_seq_hi_res), 6 )
    clock_seq_hi_res = "10" .. clock_seq_hi_res

    local clock_seq_low = _rnd(0,255)
    clock_seq_low = padbits( num2bs(clock_seq_low), 8 )

    local clock_seq = bs2num(clock_seq_hi_res .. clock_seq_low)

    local node = {}
    for i=1,6 do
        node[i] = _rnd(0,255)
    end

    local guid = ""
    guid = guid .. padbits(_fmt("%X",time_low_a), 4)
    guid = guid .. padbits(_fmt("%X",time_low_b), 4) .. "-"
    guid = guid .. padbits(_fmt("%X",time_mid), 4) .. "-"
    guid = guid .. padbits(_fmt("%X",time_hi_and_version), 4) .. "-"
    guid = guid .. padbits(_fmt("%X",clock_seq), 4) .. "-"

    for i=1,6 do
        guid = guid .. padbits(_fmt("%X",node[i]), 2)
    end

    return guid
end
