const connection = require('../db/connection');
const app = require('../app');

const selectUser = username => {
    return connection
    .select("*")
    .from("users")
    .where("username",username)
    .first()
    .returning("*")
};

module.exports = {selectUser};
