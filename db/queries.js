const pool = require("./pool");

const checkAllowed = (table) => {
    const allowedTables = ["movie_actors", "movie_genres", "movies", "genres", "actors"];
    if(!allowedTables.includes(table)){
        throw new Error("Invalid table name");
    }
}

const fetchAllFromTable  = async (table) => {
    checkAllowed(table);
    const { rows } = await pool.query(`SELECT * FROM ${table}`);
    return rows;
}

const fetchFromTable = async (table, id) => {
    checkAllowed(table);
    const { rows } = await pool.query(`SELECT * FROM ${table} WHERE id=$1`, [id]);
    return rows[0];
}

const addMovie = async (formData) => {
    if(!formData) return;
    const { title, length, description, price, rating, quantity, genre, actors } = formData;
    if(!title || !length || !description || !price || !rating || !quantity || !genre || !actors) return;
    const associatedActors = Array.isArray(actors) ? actors : [actors];
    try {
        const { rows } = await pool.query("INSERT INTO movies (title, length, description, price, rating, quantity) VALUES($1, $2, $3, $4, $5, $6) RETURNING id", [title, length, description, price, rating, quantity]);
        for(const actorId of associatedActors){
        await pool.query("INSERT INTO movie_actors (movieid, actorid) VALUES($1, $2) ON CONFLICT (movieid, actorid) DO NOTHING", [rows[0]?.id, actorId]);
    };
    } catch(err){
        console.error(err);
    }
}

const updateMovie = async (movieId, formData) => {
    if(!movieId || !formData) return;
    const { title, length, description, price, rating, quantity, genre, actors } = formData;
    const associatedActors = Array.isArray(actors) ? actors : [actors];
    try {
    await pool.query("UPDATE movies SET title=$1, length=$2, description=$3, price=$4, rating=$5, quantity=$6 WHERE id=$7", [title, length, description, price, rating, quantity, movieId]);
    await pool.query("DELETE FROM movie_actors WHERE movieid=$1", [movieId]);
    await pool.query("INSERT INTO movie_genres (movieId, genreId) VALUES($1, $2) ON CONFLICT (movieId) DO UPDATE SET movieId=$1, genreId=$2", [movieId, genre]);
    for(const actorId of associatedActors){
        await pool.query("INSERT INTO movie_actors (movieid, actorid) VALUES($1, $2)", [movieId, actorId]);
    };
    } catch(err){
        console.error(err);
    }
};

const addGenre = async(formData) => {
    if(!formData) return;
    const { title, movies } = formData;
    if(!title || !movies) return;
    const associatedMovies = Array.isArray(movies) ? movies : [movies];
    try{
        await pool.query("INSERT INTO genres (genre) VALUES($1)", [title]);
        for(const movieId of associatedMovies){
            await pool.query("INSERT INTO movie_genres (movieId, genreId) VALUES($1, $2) ON CONFLICT (movieId) DO UPDATE SET movieId=$1, genreId=$2", [movieId, genreId]);
        }
    } catch(err){
        console.error(err);
    }
}

const updateGenre = async (genreId, formData) => {
    if(!genreId || !formData) return;
    const { title, movies } = formData;
    const associatedMovies = Array.isArray(movies) ? movies : [movies];
    try{
        await pool.query("UPDATE genres SET genre=$1 WHERE id=$2", [title, genreId]);
        await pool.query("DELETE FROM movie_genres WHERE genreid=$1", [genreId]);
        for(const movieId of associatedMovies){
            await pool.query("INSERT INTO movie_genres (movieId, genreId) VALUES($1, $2) ON CONFLICT (movieId) DO UPDATE SET movieId=$1, genreId=$2", [movieId, genreId]);
        }
    }
    catch(err){
        console.error(err);
    }
}

const addActor = async(formData) => {
   if(!formData) throw new Error("Error: could not find form data");
   const { firstName, lastName, birthdate, country, movies } = formData;
   if(!firstName || !lastName || !birthdate || !country || !movies) throw new Error("Error: could not find form data");
   const associatedMovies = Array.isArray(movies) ? movies : [movies];
   try {
        const { rows } = await pool.query("INSERT INTO actors (firstName, lastName, birthdate, country) VALUES($1, $2, $3, $4) RETURNING id", [firstName, lastName, birthdate, country]);
        if(!rows || !rows[0] || !rows[0]?.id) throw new Error("Error: There was a problem adding the actor to the database.");
        for(const movieId of associatedMovies){
            await pool.query("INSERT INTO movie_actors (movieId, actorId) VALUES($1, $2) ON CONFLICT DO NOTHING", [movieId, rows[0]?.id]);
        }
   } catch(err) {
    console.error(err);
   }
}

const updateActor = async (actorId, formData) => {
    if(!actorId || !formData) return;
    const { firstName, lastName, birthdate, country, movies } = formData;
    const associatedMovies = Array.isArray(movies) ? movies : [movies];
    try{
        await pool.query("UPDATE actors SET firstName=$1, lastName=$2, birthdate=$3, country=$4 WHERE id=$5", [firstName, lastName, birthdate, country, actorId]);
        await pool.query("DELETE FROM movie_actors WHERE actorid=$1", [actorId]);
        for(const movieId of associatedMovies){
            await pool.query("INSERT INTO movie_actors (movieId, actorId) VALUES($1, $2) ON CONFLICT DO NOTHING", [movieId, actorId]);
        }
    } catch(err){
        console.error(err);
    }
}

const deleteFromTable = async (table, id) => {
    checkAllowed(table);
    await pool.query(`DELETE FROM ${table} WHERE id=$1`, [id]);
}

const fetchActorMovies = async (id) => {
    const { rows } = await pool.query("SELECT * FROM movies JOIN movie_actors ON (movies.id=movie_actors.movieid) WHERE movie_actors.actorid = $1", [id]);
    return rows;
}

const fetchGenreMovies = async (id) => {
    const { rows } = await pool.query(`SELECT * FROM movies JOIN movie_genres ON (movies.id=movie_genres.movieid) WHERE movie_genres.genreid = $1`, [id]);
    return rows;
}

const fetchMovieActors = async (id) => {
    const { rows } = await pool.query("SELECT * FROM actors JOIN movie_actors ON (actors.id=movie_actors.actorid) WHERE movie_actors.movieid = $1", [id]);
    return rows;
}

const fetchMovieGenre = async (id) => {
    const { rows } = await pool.query("SELECT * FROM genres JOIN movie_genres ON (genres.id=movie_genres.genreid) WHERE movie_genres.movieid = $1", [id]);
    return rows[0];
}

module.exports = {
    fetchAllFromTable,
    fetchFromTable,
    deleteFromTable, 
    addMovie,
    addGenre,
    addActor,
    updateMovie,
    updateGenre,
    updateActor,
    fetchActorMovies,
    fetchGenreMovies,
    fetchMovieActors,
    fetchMovieGenre
};