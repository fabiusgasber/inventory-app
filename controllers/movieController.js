const db = require("../db/queries");
const { body, validationResult } = require("express-validator");

const validateMovie = [
    body("title")
    .trim()
    .notEmpty()
    .withMessage("Movie title can not be empty.")
    .isLength({ min: 1, max: 100 })
    .withMessage("Movie title must be between 1 and 100 characters."),

    body("length")
    .notEmpty()
    .withMessage("Movie length can not be empty.")
    .isInt({ min: 1, max: 500 })
    .withMessage("Movie length must be a number between 1 and 500 minutes."),

    body("description")
    .trim()
    .notEmpty()
    .withMessage("Movie description can not be empty.")
    .isLength({ min: 10, max: 1000 })
    .withMessage("Description must be between 10 and 1000 characters."),

    body("price")
    .notEmpty()
    .withMessage("Movie price can not be empty.")
    .isFloat({ min: 0, max: 99 })
    .withMessage("Price must be a number between 0 and 99."),

    body("rating")
    .notEmpty()
    .withMessage("Movie rating can not be empty.")
    .isFloat({ min: 0, max: 10 })
    .withMessage("Rating must be a number between 0 and 10."),

    body("quantity")
    .notEmpty()
    .withMessage("Movie quantity can not be empty.")
    .isInt({ min: 1, max: 99 })
    .withMessage("Quantity must be a number between 1 and 99."),
];

const getMovies = async (req, res) => {
    try{
    const movies = await db.fetchAllFromTable("movies");
    if(!movies){
        res.status(404).send("Could not find any movies")
        return;
    }
    res.render("movies", { title: "Movies", movies });
    } catch(err){
        console.error("getMovies: could not fetch movies", err);
        res.status(500).send("Internal server error");
    }
};

const moviesCreateGet = async (req, res) => {
    try{
    const genres = await db.fetchAllFromTable("genres");
    const actors = await db.fetchAllFromTable("actors");
    res.render("createMovie", { genres, actors });
    } catch(err){
        console.error("moviesCreateGet: could not fetch movie", err);
        res.status(500).send("Internal server error");
    }
};

const moviesCreatePost = [
    validateMovie,
    async (req, res) => {
    try{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
    const allActors = await db.fetchAllFromTable("actors");
    const allGenres = await db.fetchAllFromTable("genres");
        return res.status(400).render("createMovie", {
            errors: errors.array(),
            actors: allActors,
            genres: allGenres
        });
    };
    await db.addMovie(req.body);
    res.redirect("/movie");
    } catch(err){
        console.error("moviesCreatePost: could not update movie", err);
        res.status(500).send("Internal server error");
    }
    }
];

const moviesUpdateGet = async (req, res) => {
    try{
    const movie = await db.fetchFromTable("movies", req.params.id);
    const genres = await db.fetchAllFromTable("genres");
    const actors = await db.fetchAllFromTable("actors");
    const associatedGenre = await db.fetchMovieGenre(req.params.id);
    const associatedActors = await db.fetchMovieActors(req.params.id);
    res.render("updateMovie", { movie, genres, associatedGenre, actors, associatedActors });
    } 
    catch(err){
        console.error("moviesUpdateGet: could not fetch movie", err);
        res.status(500).send("Internal server error");
    }
}

const moviesUpdatePost = [
    validateMovie,
    async (req, res) => {
        try{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            const movie = await db.fetchFromTable("movies", req.params.id);
            return res.status(400).render("updateMovie", {
                errors: errors.array(),
                movie
            });
        };
        await db.updateMovie(req.params.id, req.body);
        res.redirect(`/movie/${encodeURIComponent(req.params.id)}`);
        }
        catch(err){
        console.error("moviesUpdatePost: could not update movie", err);
        res.status(500).send("Internal server error");
        }
    }
];

const moviesDeletePost = async (req, res) => {
    try{
    await db.deleteFromTable("movies", req.params.id);
    res.redirect("/movie");
    }
    catch(err){
        console.error("moviesDeletePost: could not delete movie", err);
        res.status(500).send("Internal server error");
    }
}

const getMovie = async (req, res) => {
    try {
    const movie = await db.fetchFromTable("movies", req.params.id);
    const associatedActors = await db.fetchMovieActors(req.params.id);
    const genres = await db.fetchAllFromTable("genres");
    const associatedGenre = await db.fetchMovieGenre(req.params.id);
    res.render("moviePage", { movie, associatedActors, associatedGenre, genres });
    }
    catch(err){
        console.error("getMovie: could not fetch movie", err);
        res.status(500).send("Internal server error");
    }
};


module.exports = {
    getMovies,
    getMovie,
    moviesCreateGet,
    moviesCreatePost,
    moviesUpdateGet,
    moviesUpdatePost,
    moviesDeletePost
};