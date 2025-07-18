const db = require("../db/queries");

const getActors = (req, res) => {
    const actors = db.getActors();
    if(!actors){
        res.status(404).send("Could not find any actors")
        return;
    }
    res.render("actors", { title: "Actors", actors: actors });
}

module.exports = {
    getActors,
}