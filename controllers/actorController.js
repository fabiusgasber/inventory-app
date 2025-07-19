const db = require("../db/queries");

const getActors = (req, res) => {
    const actors = db.getActors();
    if(!actors){
        res.status(404).send("Could not find any actors")
        return;
    }
    res.render("actors", { title: "Actors", actors: actors, deleteFn: db.deleteActor });
};

const actorsCreateGet = (req, res) => {
    res.render("createActor", { title: "Add new actor"});
};

const actorsCreatePost = (req, res) => {
    const { firstName, lastName, birthdate, country, src } = req.body;
    db.addActor({ firstName, lastName, birthdate, country, src });
    res.redirect("/actor");
};

module.exports = {
    getActors,
    actorsCreateGet,
    actorsCreatePost,
};