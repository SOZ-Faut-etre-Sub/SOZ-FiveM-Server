table.insert(migrations, {
    name = "housing-property-exterior-culling",
    queries = {
        [[
           alter table housing_property add exterior_culling longtext default '[]' not null;
        ]],
        [[ update housing_property set exterior_culling = '[-440174109,-1799920002]' where identifier = 'eclipse_towers'; ]],
        [[ update housing_property set exterior_culling = '[-786039918,-1336566342]' where identifier = 'eclipse_medical_tower'; ]],
        [[ update housing_property set exterior_culling = '[1066009626,-1102430068]' where identifier = 'south_house_mid_07'; ]],
        [[ update housing_property set exterior_culling = '[-1851273617,1685831724]' where identifier = 'soz_appartements_10'; ]],
        [[ update housing_property set exterior_culling = '[1197659532,1306165144]' where identifier = 'peaceful_street'; ]],
        [[ update housing_property set exterior_culling = '[-1962983476,1569200390]' where identifier = 'vespucci'; ]],
        [[ update housing_property set exterior_culling = '[-1554050817,-372455378]' where identifier = 'power_street'; ]],
        [[ update housing_property set exterior_culling = '[-1945771443,-945159191]' where identifier = 'elgin'; ]],
        [[ update housing_property set exterior_culling = '[1483966877,1502883633]' where identifier = 'fantastic_place'; ]],
        [[ update housing_property set exterior_culling = '[1953671417,-585097253]' where identifier = 'san_andreas'; ]],
        [[ update housing_property set exterior_culling = '[2099604991,-500045280]' where identifier = 'tinsel_towers'; ]],
        [[ update housing_property set exterior_culling = '[805968614,-1969201018]' where identifier = 'del_perro_heights'; ]],
        [[ update housing_property set exterior_culling = '[1641328216,-285026450]' where identifier = 'integrity_way'; ]],
        [[ update housing_property set exterior_culling = '[1611496961,-312225717]' where identifier = 'alta_street'; ]],
        [[ update housing_property set exterior_culling = '[1062717771,-603554352]' where identifier = 'heritage_way_01'; ]],
        [[ update housing_property set exterior_culling = '[1666152087,41930611]' where identifier = 'heritage_way_02'; ]],
        [[ update housing_property set exterior_culling = '[-1911287660,-79937784]' where identifier = 'san_andreas_02'; ]],
    },
})
