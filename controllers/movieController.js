const db = require("../db/queries");

const getMovies = (req, res) => {
    const movies = db.getMovies();
    if(!movies){
        res.status(404).send("Could not find any movies")
        return;
    }
    res.render("movies", { title: "Movies", movies: movies });
} 


module.exports = {
    getMovies,
}