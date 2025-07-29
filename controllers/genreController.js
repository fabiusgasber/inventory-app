const db = require("../db/queries");
const { body, validationResults } = require("express-validator");

const validateGenre = [
    body("genre")
    .trim()
    .notEmpty()
    .withMessage("Genre can not be empty")
    .isAlpha()
    .withMessage("Genre must only contain alphabet letters")
];

const getGenres = (req, res) => {
    const genres = db.getGenres();
    if(!genres){
        res.status(404).send("Could not find any genres")
        return;
    }
    res.render("genres", { title: "Genres", genres: genres, deleteFn: db.deleteGenre });
}

const genresCreateGet = (req, res) => {
    res.render("createGenre", { title: "Add new genre" });
};

const genresCreatePost = [
    validateGenre,
    (req, res) => {
        const errors = validationResults(req);
        if(!errors.isEmpty()){
        return res.status(400).render("createGenre", {
        title: "Create genre",
        errors: errors.array(),
      });
        }
        const { genre } = req.body;
        db.addGenre({ genre });
        res.redirect("/genre");
    }
];

const genresUpdateGet = (req, res) => {
    const genre  = db.findGenre(req.params.id);
    res.render("updateGenre", { title: "Update genre", genre: genre });
}

const genresUpdatePost = [
    validateGenre,
    (req, res) => {
        const genre = db.findGenre(req.params.id);
        const errors = validationResults(req);
        if(!errors.isEmpty()){
        return res.status(400).render("updateGenre", {
        title: "Update genre",
        genre: genre,
        errors: errors.array(),
        })
    }
    db.updateGenre(req.params.id, { genre });
    res.redirect("/genre");
    }
];

const genresDeletePost = (req, res) => {
    db.deleteGenre(req.params.id);
    res.redirect("/genre");
};


module.exports = {
    getGenres,
    genresCreateGet,
    genresCreatePost,
    genresUpdateGet,
    genresUpdatePost,
    genresDeletePost
}