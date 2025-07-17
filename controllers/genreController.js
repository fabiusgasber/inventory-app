const db = require("../db/queries");

const getGenres = (req, res) => {
    res.send("Genres:");
}


module.exports = {
    getGenres,
}