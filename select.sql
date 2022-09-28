

SELECT * FROM post LEFT JOIN images on post.id = images.post ORDER BY post.created_at



SELECT link FROM images WHERE link = ()

WITH cinco_ultimos as (SELECT * FROM post ORDER BY post.id DESC LIMIT 5), imagem_dos_5 as (SELECT link,post, images.id as img_id FROM images LEFT JOIN cinco_ultimos on images.post= cinco_ultimos.id) SELECT * FROM cinco_ultimos LEFT JOIN imagem_dos_5 on imagem_dos_5.post= cinco_ultimos.id
