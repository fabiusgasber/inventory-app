const db = require("../db/queries");

const getGenres = (req, res) => {
    const genres = db.getGenres();
    if(!genres){
        res.status(404).send("Could not find any genres")
        return;
    }
    res.render("genres", { title: "Genres", genres: genres });
}


module.exports = {
    getGenres,
}