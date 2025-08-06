const db = require("../db/queries");
const { body, validationResult } = require("express-validator");

const validateGenre = [
    body("genre")
    .trim()
    .notEmpty()
    .withMessage("Genre can not be empty")
    .isAlpha()
    .withMessage("Genre must only contain alphabet letters")
];

const getGenres = async (req, res) => {
    const genres = await db.fetchAllFromTable("genres");
    if(!genres){
        res.status(404).send("Could not find any genres")
        return;
    }
    res.render("genres", { title: "Genres", genres: genres });
}

const genresCreateGet = async (req, res) => {
    const movies = await db.fetchAllFromTable("movies");
    res.render("createGenre", { movies });
};

const genresCreatePost = [
    validateGenre,
    async (req, res) => {
        const errors = validationResult(req);
        const allMovies = await db.fetchAllFromTable("movies");
        if(!errors.isEmpty()){
        return res.status(400).render("createGenre", {
        title: "Create genre",
        errors: errors.array(),
        movies: allMovies,
      });
        }
        const { genre, movies } = req.body;
        await db.addGenre({ genre, movies });
        res.redirect("/genre");
    }
];

const genresUpdateGet = async (req, res) => {
    const genre  = await db.fetchFromTable("genres", req.params.id);
    const movies = await db.fetchAllFromTable("movies");
    const associatedMovies = await db.fetchGenreMovies(req.params.id);
    res.render("updateGenre", { title: "Update genre", genre, movies, associatedMovies });
}

const genresUpdatePost = [
    validateGenre,
    async (req, res) => {
        const selectedGenre = await db.fetchFromTable("genres", req.params.id);
        const errors = validationResult(req);
        if(!errors.isEmpty()){
        return res.status(400).render("updateGenre", {
        title: "Update genre",
        genre: selectedGenre,
        errors: errors.array(),
            })
        }
    const { genre, movies } = req.body;
    await db.updateGenre(req.params.id, { genre, movies });
    res.redirect("/genre");
    }
];

const genresDeletePost = async (req, res) => {
    await db.deleteFromTable("genres", req.params.id);
    res.redirect("/genre");
};

const getGenre = async (req, res) => {
    const genre = await db.fetchFromTable("genres", req.params.id);
    const associatedMovies = await db.fetchGenreMovies(req.params.id);
    res.render("genrePage", { genre, associatedMovies });
}


module.exports = {
    getGenres,
    genresCreateGet,
    genresCreatePost,
    genresUpdateGet,
    genresUpdatePost,
    genresDeletePost,
    getGenre
}