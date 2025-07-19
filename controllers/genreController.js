const db = require("../db/queries");

const getGenres = (req, res) => {
    const genres = db.getGenres();
    if(!genres){
        res.status(404).send("Could not find any genres")
        return;
    }
    res.render("genres", { title: "Genres", genres: genres, deleteFn: db.deleteGenre });
}

const genresCreateGet = (req, res) => {
    res.render("createMovie", { title: "Add new genre" });
};

const genresCreatePost = (req, res) => {
    const { genre } = req.body;
    db.addGenre({ genre });
    res.redirect("/genre");
};


module.exports = {
    getGenres,
    genresCreateGet,
    genresCreatePost,
}