const db = require("../db/queries");

const getMovies = (req, res) => {
    res.send("Movies:");
} 


module.exports = {
    getMovies,
}