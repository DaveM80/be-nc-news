\c nc_news\q
SELECT * FROM comments;
WHERE comment_id = 1;

--   .then(articles => {
--       if (Array.isArray(articles)){
--       return res.status(200).send({articles});
--       }else if(articles){
--         const article = articles
--         return res.status(200).send({article});
--       }
--       return next({ status: 404, msg: "Not Found" });
--     })