INSERT INTO category (id, name, parent_id)
VALUES
    (33, 'Monstre', null),
    (34, 'Carnaval', null),
    (35, 'Bandana', null),
    (36, 'Animaux', null),
    (37, 'Intégral', null),
    (38, 'Costume', null),
    (39, 'Cagoule', null);

INSERT INTO shop (id, name, label)
VALUES (4, 'mask', 'Magasin de masques');

INSERT INTO shop_categories (shop_id, category_id)
VALUES
    (4, 33),
    (4, 34),
    (4, 35),
    (4, 36),
    (4, 37),
    (4, 38),
    (4, 39);

INSERT INTO shop_content (shop_id, category_id, label, price, data)
VALUES
    (4, 36, '1-0', 100, '{"components": {"1":{"Drawable":1,"Texture":0}} }'),
    (4, 36, '1-1', 100, '{"components": {"1":{"Drawable":1,"Texture":1}} }'),
    (4, 36, '1-2', 100, '{"components": {"1":{"Drawable":1,"Texture":2}} }'),
    (4, 36, '1-3', 100, '{"components": {"1":{"Drawable":1,"Texture":3}} }'),
    (4, 37, '2-0', 100, '{"components": {"1":{"Drawable":2,"Texture":0}} }'),
    (4, 37, '2-1', 100, '{"components": {"1":{"Drawable":2,"Texture":1}} }'),
    (4, 37, '2-2', 100, '{"components": {"1":{"Drawable":2,"Texture":2}} }'),
    (4, 37, '2-3', 100, '{"components": {"1":{"Drawable":2,"Texture":3}} }'),
    (4, 36, '3-0', 100, '{"components": {"1":{"Drawable":3,"Texture":0}} }'),
    (4, 37, '4-0', 100, '{"components": {"1":{"Drawable":4,"Texture":0}} }'),
    (4, 37, '4-1', 100, '{"components": {"1":{"Drawable":4,"Texture":1}} }'),
    (4, 37, '4-2', 100, '{"components": {"1":{"Drawable":4,"Texture":2}} }'),
    (4, 37, '4-3', 100, '{"components": {"1":{"Drawable":4,"Texture":3}} }'),
    (4, 36, '5-0', 100, '{"components": {"1":{"Drawable":5,"Texture":0}} }'),
    (4, 36, '5-1', 100, '{"components": {"1":{"Drawable":5,"Texture":1}} }'),
    (4, 36, '5-2', 100, '{"components": {"1":{"Drawable":5,"Texture":2}} }'),
    (4, 36, '5-3', 100, '{"components": {"1":{"Drawable":5,"Texture":3}} }'),
    (4, 34, '6-0', 100, '{"components": {"1":{"Drawable":6,"Texture":0}} }'),
    (4, 34, '6-1', 100, '{"components": {"1":{"Drawable":6,"Texture":1}} }'),
    (4, 34, '6-2', 100, '{"components": {"1":{"Drawable":6,"Texture":2}} }'),
    (4, 34, '6-3', 100, '{"components": {"1":{"Drawable":6,"Texture":3}} }'),
    (4, 33, '7-0', 100, '{"components": {"1":{"Drawable":7,"Texture":0}} }'),
    (4, 33, '7-1', 100, '{"components": {"1":{"Drawable":7,"Texture":1}} }'),
    (4, 33, '7-2', 100, '{"components": {"1":{"Drawable":7,"Texture":2}} }'),
    (4, 33, '7-3', 100, '{"components": {"1":{"Drawable":7,"Texture":3}} }'),
    (4, 38, '8-0', 100, '{"components": {"1":{"Drawable":8,"Texture":0}} }'),
    (4, 38, '8-1', 100, '{"components": {"1":{"Drawable":8,"Texture":1}} }'),
    (4, 38, '8-2', 100, '{"components": {"1":{"Drawable":8,"Texture":2}} }'),
    (4, 38, '9-0', 100, '{"components": {"1":{"Drawable":9,"Texture":0}} }'),
    (4, 33, '10-0', 100, '{"components": {"1":{"Drawable":10,"Texture":0}} }');
