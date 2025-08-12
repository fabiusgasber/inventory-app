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
    const movies = await db.fetchAllFromTable("movies");
    if(!movies){
        res.status(404).send("Could not find any movies")
        return;
    }
    res.render("movies", { title: "Movies", movies: movies });
};

const moviesCreateGet = async (req, res) => {
    const genres = await db.fetchAllFromTable("genres");
    const actors = await db.fetchAllFromTable("actors");
    res.render("createMovie", { genres, actors });
};

const moviesCreatePost = [
    validateMovie,
    async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).render("createMovie", {
            title: "Create Movie",
            errors: errors.array(),
        });
    };
    const { title, length, description, price, rating, quantity, genre, actors } = req.body;
    await db.addMovie({ title, length, description, price, rating, quantity, genre, actors });
    res.redirect("/movie");
    }
];

const moviesUpdateGet = async (req, res) => {
    const movie = await db.fetchFromTable("movies", req.params.id);
    const genres = await db.fetchAllFromTable("genres");
    const actors = await db.fetchAllFromTable("actors");
    const associatedGenre = await db.fetchMovieGenre(req.params.id);
    const associatedActors = await db.fetchMovieActors(req.params.id);
    res.render("updateMovie", { title: "Update Movie", movie, genres, associatedGenre, actors, associatedActors });
}

const moviesUpdatePost = [
    validateMovie,
    async (req, res) => {
        const movie = await db.fetchFromTable("movies", req.params.id);
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).render("updateMovie", {
                title: "Update Movie",
                errors: errors.array(),
                movie: movie
            });
        };
        const { title, length, description, price, rating, quantity, genre, actors } = req.body;
        await db.updateMovie(req.params.id, { title, length, description, price, rating, quantity, genre, actors });
        res.redirect(`/movie/${encodeURIComponent(req.params.id)}`);
    }
]

const moviesDeletePost = async (req, res) => {
    await db.deleteFromTable("movies", req.params.id);
    res.redirect("/movie");
}

const getMovie = async (req, res) => {
    const movie = await db.fetchFromTable("movies", req.params.id);
    const associatedActors = await db.fetchMovieActors(req.params.id);
    const genres = await db.fetchAllFromTable("genres");
    const associatedGenre = await db.fetchMovieGenre(req.params.id);
    res.render("moviePage", { movie, associatedActors, associatedGenre, genres });
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