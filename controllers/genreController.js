const db = require("../db/queries");
const { body, validationResult } = require("express-validator");

const validateGenre = [
    body("title")
    .trim()
    .notEmpty()
    .withMessage("Genre can not be empty")
    .isString()
    .withMessage("Genre must only contain letters")
];

const getGenres = async (req, res) => {
    try{
    const genres = await db.fetchAllFromTable("genres");
    if(!genres){
        res.status(404).send("Could not find any genres")
        return;
    } 
    res.render("genres", { genres });
}
    catch(err){
        console.error("getGenres: could not fetch genre", err);
        res.status(500).send("Internal server error");
    }
}

const genresCreateGet = async (req, res) => {
    try{
        const movies = await db.fetchAllFromTable("movies");
        res.render("createGenre", { movies });
    } catch(err){
        console.error("genresCreateGet: could not fetch genre", err);
        res.status(500).send("Internal server error");
    }
};

const genresCreatePost = [
    validateGenre,
    async (req, res) => {
        try{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
        const allMovies = await db.fetchAllFromTable("movies");
        return res.status(400).render("createGenre", {
        errors: errors.array(),
        movies: allMovies,
      });
        }
        await db.addGenre(req.body);
        res.redirect("/genre");
        } catch(err){
        console.error("genresCreatePost: could not create genre", err);
        res.status(500).send("Internal server error");
        }
        
    }
];

const genresUpdateGet = async (req, res) => {
    try{
    const genre  = await db.fetchFromTable("genres", req.params.id);
    const movies = await db.fetchAllFromTable("movies");
    const associatedMovies = await db.fetchGenreMovies(req.params.id);
    res.render("updateGenre", { genre, movies, associatedMovies });
    } catch(err){
        console.error("genresUpdateGet: could not fetch genre", err);
        res.status(500).send("Internal server error");
    }
}

const genresUpdatePost = [
    validateGenre,
    async (req, res) => {
        try{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
        const selectedGenre = await db.fetchFromTable("genres", req.params.id);
        const allMovies = await db.fetchAllFromTable("movies");
        const associatedMovies = await db.fetchGenreMovies(req.params.id);
        return res.status(400).render("updateGenre", {
        genre: selectedGenre,
        errors: errors.array(),
        movies: allMovies,
        associatedMovies,
            })
        }
    await db.updateGenre(req.params.id, req.body);
    res.redirect(`/genre/${encodeURIComponent(req.params.id)}`);
    }
    catch(err){
        console.error("genresUpdatePost: could not update genre", err);
        res.status(500).send("Internal server error");
    }
    }
];

const genresDeletePost = async (req, res) => {
    try{
        await db.deleteFromTable("genres", req.params.id);
        res.redirect("/genre");
    } catch(err){
        console.error("genresDeletePost: could not delete genre", err);
        res.status(500).send("Internal server error");
    }
};

const getGenre = async (req, res) => {
    try{
    const genre = await db.fetchFromTable("genres", req.params.id);
    const associatedMovies = await db.fetchGenreMovies(req.params.id);
    res.render("genrePage", { genre, associatedMovies });
    } catch(err){
        console.error("getGenre: could not fetch genre", err);
        res.status(500).send("Internal server error");
    }
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