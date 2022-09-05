table.insert(migrations, {
    name = "update-luxuary-concess",
    queries = {
        [[
            DELETE FROM soz_fivem.vehicles WHERE model LIKE 'champion';
        ]],
        [[
            DELETE FROM soz_fivem.vehicles WHERE model LIKE 'savestra';
        ]],
        [[
            DELETE FROM soz_fivem.vehicles WHERE model LIKE 'baller7';
        ]],
        [[
            DELETE FROM soz_fivem.vehicles WHERE model LIKE 'deveste';
        ]],
        [[
            DELETE FROM soz_fivem.vehicles WHERE model LIKE 'jubilee';
        ]],
        [[
            DELETE FROM soz_fivem.vehicles WHERE model LIKE 'penetrator';
        ]],
        [[
            DELETE FROM soz_fivem.vehicles WHERE model LIKE 'jugular';
        ]],
        [[
            DELETE FROM soz_fivem.vehicles WHERE model LIKE 'viseris';
        ]],
        [[
            DELETE FROM soz_fivem.vehicles WHERE model LIKE 'nebula';
        ]],
        [[
            DELETE FROM soz_fivem.vehicles WHERE model LIKE 'patriot3';
        ]],
        [[
            DELETE FROM soz_fivem.vehicles WHERE model LIKE 'tyrus';
        ]],
        [[
            DELETE FROM soz_fivem.vehicles WHERE model LIKE 'deity';
        ]],
        [[
            DELETE FROM soz_fivem.vehicles WHERE model LIKE 'astron';
        ]],
        [[
            DELETE FROM soz_fivem.vehicles WHERE model LIKE 'dynasty2';
        ]],
        [[
            DELETE FROM soz_fivem.vehicles WHERE model LIKE 'voltic2';
        ]],
        [[
            DELETE FROM soz_fivem.vehicles WHERE model LIKE 'cinquemila';
        ]],
        [[
            DELETE FROM soz_fivem.vehicles WHERE model LIKE 'le7b';
        ]],
        [[
            DELETE FROM soz_fivem.vehicles WHERE model LIKE 'oppressor';
        ]],
        [[
            DELETE FROM soz_fivem.vehicles WHERE model LIKE 'revolter';
        ]],
        [[
            DELETE FROM soz_fivem.vehicles WHERE model LIKE 'schafter';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 1000000 WHERE t.model LIKE 's80';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 150000 WHERE t.model LIKE 'raptor';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 150000 WHERE t.model LIKE 'btype';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 650000 WHERE t.model LIKE 'cheetah2';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 350000 WHERE t.model LIKE 'cypher';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 300000 WHERE t.model LIKE 'growler';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 350000 WHERE t.model LIKE 'sultan2';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 250000 WHERE t.model LIKE 'massacro2';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 115000 WHERE t.model LIKE 'cheburek';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 450000 WHERE t.model LIKE 'sultanrs';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 600000 WHERE t.model LIKE 'paragon';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 600000 WHERE t.model LIKE 'pariah';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 300000 WHERE t.model LIKE 'kuruma';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 650000 WHERE t.model LIKE 'autarch';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 250000 WHERE t.model LIKE 'jester3';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 800000 WHERE t.model LIKE 'italigto';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 250000 WHERE t.model LIKE 'zr350';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 400000 WHERE t.model LIKE 'coquette4';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 280000 WHERE t.model LIKE 'bestiagts';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 420000 WHERE t.model LIKE 'banshee2';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 370000 WHERE t.model LIKE 'jester4';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 140000 WHERE t.model LIKE 'blista2';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 1000000 WHERE t.model LIKE 'prototipo';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 480000 WHERE t.model LIKE 'taipan';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 300000 WHERE t.model LIKE 'btype3';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 400000 WHERE t.model LIKE 'coquette';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 900000 WHERE t.model LIKE 'thrax';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 800000 WHERE t.model LIKE 'imorgon';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 450000 WHERE t.model LIKE 'comet3';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 600000 WHERE t.model LIKE 'visione';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 450000 WHERE t.model LIKE 'feltzer3';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 160000 WHERE t.model LIKE 'remus';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 500000 WHERE t.model LIKE 'tempesta';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 550000 WHERE t.model LIKE 'adder';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 600000 WHERE t.model LIKE 'xa21';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 820000 WHERE t.model LIKE 'krieger';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 210000 WHERE t.model LIKE 'rapidgt2';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 270000 WHERE t.model LIKE 'swinger';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 150000 WHERE t.model LIKE 'futo';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 300000 WHERE t.model LIKE 'specter2';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 250000 WHERE t.model LIKE 'casco';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 350000 WHERE t.model LIKE 'elegy2';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 50000 WHERE t.model LIKE 'dynasty';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 450000 WHERE t.model LIKE 'elegy';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 750000 WHERE t.model LIKE 'ignus';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 180000 WHERE t.model LIKE 'peyote';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 180000 WHERE t.model LIKE 'furoregt';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 400000 WHERE t.model LIKE 'z190';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 405000 WHERE t.model LIKE 'infernus';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 380000 WHERE t.model LIKE 'issi7';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 230000 WHERE t.model LIKE 'stinger';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 250000 WHERE t.model LIKE 'btype2';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 280000 WHERE t.model LIKE 'carbonizzare';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 250000 WHERE t.model LIKE 'gb200';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 270000 WHERE t.model LIKE 'lynx';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 520000 WHERE t.model LIKE 'tigon';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 220000 WHERE t.model LIKE 'massacro';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 280000 WHERE t.model LIKE 'schafter3';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 250000 WHERE t.model LIKE 'retinue';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 200000 WHERE t.model LIKE 'ruston';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 400000 WHERE t.model LIKE 'bullet';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 250000 WHERE t.model LIKE 'specter';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 550000 WHERE t.model LIKE 'comet7';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 280000 WHERE t.model LIKE 'euros';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 320000 WHERE t.model LIKE 'retinue2';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 150000 WHERE t.model LIKE 'alpha';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 170000 WHERE t.model LIKE 'rapidgt';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 650000 WHERE t.model LIKE 'vagner';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 250000 WHERE t.model LIKE 'voltic';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 170000 WHERE t.model LIKE 'feltzer2';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 180000 WHERE t.model LIKE 'futo2';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 300000 WHERE t.model LIKE 'pigalle';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 550000 WHERE t.model LIKE 'sheava';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 50000 WHERE t.model LIKE 'manana';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 300000 WHERE t.model LIKE 'comet2';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 175000 WHERE t.model LIKE 'penumbra2';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 240000 WHERE t.model LIKE 'coquette2';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 520000 WHERE t.model LIKE 'italigtb2';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 75000 WHERE t.model LIKE 'fagaloa';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 300000 WHERE t.model LIKE 'omnis';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 450000 WHERE t.model LIKE 'turismor';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 480000 WHERE t.model LIKE 'vacca';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 800000 WHERE t.model LIKE 'cyclone';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 250000 WHERE t.model LIKE 'schafter4';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 500000 WHERE t.model LIKE 'comet6';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 500000 WHERE t.model LIKE 'comet5';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 220000 WHERE t.model LIKE 'drafter';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 160000 WHERE t.model LIKE 'schwarzer';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 190000 WHERE t.model LIKE 'sentinel3';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 250000 WHERE t.model LIKE 'verlierer2';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 120000 WHERE t.model LIKE 'tornado5';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 400000 WHERE t.model LIKE 'flashgt';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 800000 WHERE t.model LIKE 'furia';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 220000 WHERE t.model LIKE 'rt3000';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 850000 WHERE t.model LIKE 'zorrusso';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 80000 WHERE t.model LIKE 'tornado2';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 540000 WHERE t.model LIKE 'emerus';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 570000 WHERE t.model LIKE 'tyrant';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 500000 WHERE t.model LIKE 'italigtb';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 220000 WHERE t.model LIKE 'peyote3';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 70000 WHERE t.model LIKE 'tornado';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 450000 WHERE t.model LIKE 'jb7002';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 470000 WHERE t.model LIKE 'rapidgt3';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 400000 WHERE t.model LIKE 'cheetah';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 500000 WHERE t.model LIKE 'gt500';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 300000 WHERE t.model LIKE 'infernus2';
        ]],
        [[
            UPDATE soz_fivem.vehicles t SET t.price = 350000 WHERE t.model LIKE 'hotring';
        ]],
        [[
             UPDATE soz_fivem.vehicles t SET t.price = 600000 WHERE t.model LIKE 'turismo2';
        ]],
        [[
             UPDATE soz_fivem.vehicles t SET t.price = 460000 WHERE t.model LIKE 'osiris';
        ]],
        [[
             UPDATE soz_fivem.vehicles t SET t.price = 220000 WHERE t.model LIKE 'ninef';
        ]],
        [[
             UPDATE soz_fivem.vehicles t SET t.price = 190000 WHERE t.model LIKE 'sultan';
        ]],
        [[
             UPDATE soz_fivem.vehicles t SET t.price = 180000 WHERE t.model LIKE 'surano';
        ]],
        [[
             UPDATE soz_fivem.vehicles t SET t.price = 120000 WHERE t.model LIKE 'monroe';
        ]],
        [[
             UPDATE soz_fivem.vehicles t SET t.price = 155000 WHERE t.model LIKE 'penumbra';
        ]],
        [[
             UPDATE soz_fivem.vehicles t SET t.price = 335000 WHERE t.model LIKE 'sultan3';
        ]],
        [[
             UPDATE soz_fivem.vehicles t SET t.price = 220000 WHERE t.model LIKE 'jester';
        ]],
        [[
             UPDATE soz_fivem.vehicles t SET t.price = 600000 WHERE t.model LIKE 'nero2';
        ]],
        [[
             UPDATE soz_fivem.vehicles t SET t.price = 200000 WHERE t.model LIKE 'banshee';
        ]],
        [[
             UPDATE soz_fivem.vehicles t SET t.price = 520000 WHERE t.model LIKE 'sc1';
        ]],
        [[
             UPDATE soz_fivem.vehicles t SET t.price = 350000 WHERE t.model LIKE 'schlagen';
        ]],
        [[
             UPDATE soz_fivem.vehicles t SET t.price = 800000 WHERE t.model LIKE 'italirsx';
        ]],
        [[
             UPDATE soz_fivem.vehicles t SET t.price = 250000 WHERE t.model LIKE 'torero';
        ]],
        [[
             UPDATE soz_fivem.vehicles t SET t.price = 160000 WHERE t.model LIKE 'blista3';
        ]],
        [[
             UPDATE soz_fivem.vehicles t SET t.price = 280000 WHERE t.model LIKE 'zion3';
        ]],
        [[
             UPDATE soz_fivem.vehicles t SET t.price = 300000 WHERE t.model LIKE 'michelli';
        ]],
        [[
             UPDATE soz_fivem.vehicles t SET t.price = 200000 WHERE t.model LIKE 'streiter';
        ]],
        [[
             UPDATE soz_fivem.vehicles t SET t.price = 500000 WHERE t.model LIKE 'mamba';
        ]],
        [[
             UPDATE soz_fivem.vehicles t SET t.price = 450000 WHERE t.model LIKE 'vstr';
        ]],
        [[
             UPDATE soz_fivem.vehicles t SET t.price = 500000 WHERE t.model LIKE 'reaper';
        ]],
        [[
             UPDATE soz_fivem.vehicles t SET t.price = 440000 WHERE t.model LIKE 'entityxf';
        ]],
        [[
             UPDATE soz_fivem.vehicles t SET t.price = 250000 WHERE t.model LIKE 'sugoi';
        ]],
        [[
             UPDATE soz_fivem.vehicles t SET t.price = 550000 WHERE t.model LIKE 'nero';
        ]],
        [[
             UPDATE soz_fivem.vehicles t SET t.price = 600000 WHERE t.model LIKE 't20';
        ]],
        [[
             UPDATE soz_fivem.vehicles t SET t.price = 250000 WHERE t.model LIKE 'stingergt';
        ]],
        [[
             UPDATE soz_fivem.vehicles t SET t.price = 300000 WHERE t.model LIKE 'seven70';
        ]],
        [[
             UPDATE soz_fivem.vehicles t SET t.price = 230000 WHERE t.model LIKE 'ninef2';
        ]],
        [[
             UPDATE soz_fivem.vehicles t SET t.price = 280000 WHERE t.model LIKE 'calico';
        ]],
        [[
             UPDATE soz_fivem.vehicles t SET t.price = 480000 WHERE t.model LIKE 'fmj';
        ]],
        [[
             UPDATE soz_fivem.vehicles t SET t.price = 300000 WHERE t.model LIKE 'vectre';
        ]],
        [[
             UPDATE soz_fivem.vehicles t SET t.price = 300000 WHERE t.model LIKE 'neo';
        ]],
        [[
             UPDATE soz_fivem.vehicles t SET t.price = 650000 WHERE t.model LIKE 'zeno';
        ]],
        [[
             UPDATE soz_fivem.vehicles t SET t.price = 480000 WHERE t.model LIKE 'entity2';
        ]],
        [[
             UPDATE soz_fivem.vehicles t SET t.price = 200000 WHERE t.model LIKE 'tropos';
        ]],
        [[
             UPDATE soz_fivem.vehicles t SET t.price = 650000 WHERE t.model LIKE 'zentorno';
        ]],
        [[
             UPDATE soz_fivem.vehicles t SET t.price = 320000 WHERE t.model LIKE 'komoda';
        ]],
    },
})

