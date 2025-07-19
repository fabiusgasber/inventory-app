const db = require("../db/queries");

const getMovies = (req, res) => {
    const movies = db.getMovies();
    if(!movies){
        res.status(404).send("Could not find any movies")
        return;
    }
    res.render("movies", { title: "Movies", movies: movies, deleteFn: db.deleteMovie });
};

const moviesCreateGet = (req, res) => {
    res.render("createMovie", { title: "Add new movie"});
};

const moviesCreatePost = (req, res) => {
    const { title, length, description, price, rating, quantity } = req.body;
    db.addMovie({ title, length, description, price, rating, quantity });
    db.redirect("/movie");
}


module.exports = {
    getMovies,
    moviesCreateGet,
    moviesCreatePost,
};