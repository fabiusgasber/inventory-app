const pool = require("./pool");

const checkAllowed = (table) => {
    const allowedTables = ["inventory", "movies", "genres", "actors"];
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

const addMovie = async ({ title, length, description, price, rating, quantity }) => {
    await pool.query("INSERT INTO movies (title, length, description, price, rating, quantity) VALUES($1, $2, $3, $4, $5, $6)", [title, length, description, price, rating, quantity])
}

const updateMovie = async (id, { title, length, description, price, rating, quantity, genre }) => {
    await pool.query("UPDATE movies SET title = $2, length = $3, description = $4, price = $5, rating = $6, quantity = $7 WHERE id = $1", [id, title, length, description, price, rating, quantity]);
    await pool.query("UPDATE inventory SET genre=$1 WHERE movie=$2", [genre, id]);
    await pool.query("INSERT INTO inventory (genre, movie) SELECT $1, $2 WHERE NOT EXISTS (SELECT * FROM inventory WHERE movie=$2)", [genre, id]);
}

const addGenre = async({ genre }) => {
    await pool.query("INSERT INTO genres (genre) VALUES($1)", [genre]);
}

const updateGenre = async (id, { genre, movies }) => {
    await pool.query("UPDATE genres SET genre = $2 WHERE id = $1", [id, genre]);
    const { rows } = await pool.query("SELECT movie FROM inventory WHERE genre = $1", [id])
    for(const row of rows){
        await pool.query("UPDATE inventory SET genre = NULL WHERE movie = $1", [row.movie]);
    }
    if(Array.isArray(movies)){
    for(const movie of movies) {
        await pool.query("UPDATE inventory SET genre = $1 WHERE movie = $2", [id, movie]);
    };
    }
    else {
        await pool.query("UPDATE inventory SET genre = $1 WHERE movie = $2", [id, movies]);
    }
}

const addActor = async({ firstName, lastName, birthdate, country, movies, src }) => {
    const result = await pool.query("INSERT INTO actors (firstName, lastName, birthdate, country, src) VALUES($1, $2, $3, $4, $5) RETURNING id", [firstName, lastName, birthdate, country, src]);
    const actor = result.rows[0].id;
    for(const movie of movies){
        await pool.query("INSERT INTO inventory (movie, actor) VALUES($1, $2)", [movie, actor]);
    }
}

const updateActor = async (id, { firstName, lastName, birthdate, country, src, movies }) => {
    await pool.query("UPDATE actors SET firstName = $2, lastName = $3, birthdate = $4, country = $5, src = $6 WHERE id = $1", [id, firstName, lastName, birthdate, country, src]);
    await pool.query("DELETE FROM inventory WHERE actor=$1", [id]);
    if(Array.isArray(movies)){
    for(const movie of movies){
        await pool.query("INSERT INTO inventory (movie, actor) VALUES($1, $2) ON CONFLICT (movie, actor) DO NOTHING", [movie, id]);
    }
    }
    else {
        await pool.query("INSERT INTO inventory (movie, actor) VALUES($1, $2) ON CONFLICT (movie, actor) DO NOTHING", [movies, id]);
    }
}

const deleteFromTable = async (table, id) => {
    checkAllowed(table);
    await pool.query(`DELETE FROM ${table} WHERE id=$1`, [id]);
}

const fetchActorMovies = async (id) => {
    const { rows } = await pool.query(`SELECT * FROM movies JOIN inventory ON (movies.id=inventory.movie) WHERE inventory.actor = $1`, [id]);
    return rows;
}

const fetchGenreMovies = async (id) => {
    const { rows } = await pool.query(`SELECT * FROM movies JOIN inventory ON (movies.id=inventory.movie) WHERE inventory.genre = $1`, [id]);
    return rows;
}

const fetchMovieActors = async (id) => {
    const { rows } = await pool.query(`SELECT * FROM actors JOIN inventory ON (actors.id=inventory.actor) WHERE inventory.movie = $1`, [id]);
    return rows;
}

const fetchMovieGenre = async (id) => {
    const { rows } = await pool.query(`SELECT * FROM genres JOIN inventory ON (genres.id=inventory.genre) WHERE inventory.movie = $1`, [id]);
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