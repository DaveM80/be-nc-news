const connection = require('../db/connection');

const selectArticle = (article_id => {
    const returnArticle = () =>{
    return connection
    .select("*")
    .from("articles")
    .where("article_id",article_id)
    .first()
    .returning("*")
    }
    const returnComments = () => {
        return connection
        .select("*")
        .from("comments")
        .where("article_id",article_id)
        .returning("*")
    }

    Promise.all([returnArticle(article_id),returnComments(article_id)])
    .then(([article,comments])=>{
        article.comment_count = comments.length
        console.log(article);
        return article
    })
});



module.exports = {selectArticle}