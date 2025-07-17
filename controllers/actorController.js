const db = require("../db/queries");

const getActors = (req, res) => {
    res.send("Actors:");
}

module.exports = {
    getActors,
}