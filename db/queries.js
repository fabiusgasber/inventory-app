const pool = require("./pool");

const checkAllowed = (table) => {
  const allowedTables = [
    "movie_actors",
    "movie_genres",
    "movies",
    "genres",
    "actors",
  ];
  if (!allowedTables.includes(table)) {
    throw new Error("Invalid table name");
  }
};

const fetchAllFromTable = async (table) => {
  if (!table) throw new Error("Please provide table name");
  try {
    checkAllowed(table);
    const { rows } = await pool.query(`SELECT * FROM ${table}`);
    if (!rows.length)
      throw new Error(`could not find items from table: ${table}`);
    return rows;
  } catch (err) {
    throw new Error(`fetchAllFromTable failed: ${err.message}`);
  }
};

const fetchFromTable = async (table, id) => {
  if (!table || !id) throw new Error("Please provide table name and row id");
  try {
    checkAllowed(table);
    const { rows } = await pool.query(`SELECT * FROM ${table} WHERE id=$1`, [
      id,
    ]);
    if (!rows.length)
      throw new Error(`could not find items from table: ${table}`);
    return rows[0];
  } catch (err) {
    throw new Error(`fetchFromTable failed: ${err.message}`);
  }
};

const addMovie = async (formData) => {
  if (!formData) throw new Error("form data not found");
  const { title, length, description, price, rating, quantity, genre, actors } =
    formData;
  if (
    !title ||
    !length ||
    !description ||
    !price ||
    !rating ||
    !quantity ||
    !genre
  )
    throw new Error("please provide every required data");
  const associatedActors = Array.isArray(actors) ? actors : [actors];
  const src = "https://placehold.co/600?text=Movie&font=roboto";
  try {
    const { rows } = await pool.query(
      "INSERT INTO movies (title, length, description, price, rating, quantity, src) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id",
      [title, length, description, price, rating, quantity, src],
    );
    await pool.query(
      "INSERT INTO movie_genres (movieid, genreid) VALUES($1, $2) ON CONFLICT (movieId) DO UPDATE SET movieId=$1, genreId=$2",
      [rows[0]?.id, genre],
    );
    for (const actorId of associatedActors) {
      await pool.query(
        "INSERT INTO movie_actors (movieid, actorid) VALUES($1, $2) ON CONFLICT (movieid, actorid) DO NOTHING",
        [rows[0]?.id, actorId],
      );
    }
  } catch (err) {
    throw new Error(`addMovie failed: ${err.message}`);
  }
};

const updateMovie = async (movieId, formData) => {
  if (!movieId || !formData) throw new Error("movie id or form data not found");
  const { title, length, description, price, rating, quantity, genre, actors } =
    formData;
  if (
    !title ||
    !length ||
    !description ||
    !price ||
    !rating ||
    !quantity ||
    !genre
  )
    throw new Error("please provide every required data");
  const associatedActors = Array.isArray(actors) ? actors : [actors];
  try {
    await pool.query(
      "UPDATE movies SET title=$1, length=$2, description=$3, price=$4, rating=$5, quantity=$6 WHERE id=$7",
      [title, length, description, price, rating, quantity, movieId],
    );
    await pool.query("DELETE FROM movie_actors WHERE movieid=$1", [movieId]);
    await pool.query(
      "INSERT INTO movie_genres (movieId, genreId) VALUES($1, $2) ON CONFLICT (movieId) DO UPDATE SET movieId=$1, genreId=$2",
      [movieId, genre],
    );
    for (const actorId of associatedActors) {
      await pool.query(
        "INSERT INTO movie_actors (movieid, actorid) VALUES($1, $2)",
        [movieId, actorId],
      );
    }
  } catch (err) {
    throw new Error(`updateMovie failed: ${err.message}`);
  }
};

const addGenre = async (formData) => {
  if (!formData) throw new Error("form data not found");
  const { title, movies } = formData;
  if (!title) throw new Error("please provide every required data");
  const associatedMovies = Array.isArray(movies) ? movies : [movies];
  const src = "https://placehold.co/600?text=Genre&font=roboto";
  try {
    const { rows } = await pool.query(
      "INSERT INTO genres (genre, src) VALUES($1, $2) RETURNING id",
      [title, src],
    );
    if (!rows || !rows[0] || !rows[0]?.id)
      throw new Error("there was a problem adding the genre to the database.");
    for (const movieId of associatedMovies) {
      await pool.query(
        "INSERT INTO movie_genres (movieId, genreId) VALUES($1, $2) ON CONFLICT (movieId) DO UPDATE SET movieId=$1, genreId=$2",
        [movieId, rows[0]?.id],
      );
    }
  } catch (err) {
    throw new Error(`addGenre failed: ${err.message}`);
  }
};

const updateGenre = async (genreId, formData) => {
  if (!genreId || !formData) throw new Error("genre id or form data not found");
  const { title, movies } = formData;
  if (!title) throw new Error("please provide every required data");
  const associatedMovies = Array.isArray(movies) ? movies : [movies];
  try {
    await pool.query("UPDATE genres SET genre=$1 WHERE id=$2", [
      title,
      genreId,
    ]);
    await pool.query("DELETE FROM movie_genres WHERE genreid=$1", [genreId]);
    for (const movieId of associatedMovies) {
      await pool.query(
        "INSERT INTO movie_genres (movieId, genreId) VALUES($1, $2) ON CONFLICT (movieId) DO UPDATE SET movieId=$1, genreId=$2",
        [movieId, genreId],
      );
    }
  } catch (err) {
    throw new Error(`updateGenre failed: ${err.message}`);
  }
};

const addActor = async (formData) => {
  if (!formData) throw new Error("could not find form data");
  const { firstName, lastName, birthdate, country, movies } = formData;
  if (!firstName || !lastName || !birthdate || !country)
    throw new Error("please provide every required data");
  const associatedMovies = Array.isArray(movies) ? movies : [movies];
  const src = "https://placehold.co/600?text=Actor&font=roboto";
  try {
    const { rows } = await pool.query(
      "INSERT INTO actors (firstName, lastName, birthdate, country, src) VALUES($1, $2, $3, $4, $5) RETURNING id",
      [firstName, lastName, birthdate, country, src],
    );
    if (!rows || !rows[0] || !rows[0]?.id)
      throw new Error("there was a problem adding the actor to the database.");
    for (const movieId of associatedMovies) {
      await pool.query(
        "INSERT INTO movie_actors (movieId, actorId) VALUES($1, $2) ON CONFLICT DO NOTHING",
        [movieId, rows[0]?.id],
      );
    }
  } catch (err) {
    throw new Error(`addActor failed: ${err.message}`);
  }
};

const updateActor = async (actorId, formData) => {
  if (!actorId || !formData) throw new Error("actor id or form data not found");
  const { firstName, lastName, birthdate, country, movies } = formData;
  if (!firstName || !lastName || !birthdate || !country)
    throw new Error("please provide every required data");
  const associatedMovies = Array.isArray(movies) ? movies : [movies];
  try {
    await pool.query(
      "UPDATE actors SET firstName=$1, lastName=$2, birthdate=$3, country=$4 WHERE id=$5",
      [firstName, lastName, birthdate, country, actorId],
    );
    await pool.query("DELETE FROM movie_actors WHERE actorid=$1", [actorId]);
    for (const movieId of associatedMovies) {
      await pool.query(
        "INSERT INTO movie_actors (movieId, actorId) VALUES($1, $2) ON CONFLICT DO NOTHING",
        [movieId, actorId],
      );
    }
  } catch (err) {
    throw new Error(`updateActor failed: ${err.message}`);
  }
};

const deleteFromTable = async (table, id) => {
  if (!table || !id) throw new Error("please provide table name and row id");
  try {
    checkAllowed(table);
    await pool.query(`DELETE FROM ${table} WHERE id=$1`, [id]);
  } catch (err) {
    throw new Error(`deleteFromTable failed: ${err.message}`);
  }
};

const fetchActorMovies = async (id) => {
  if (!id) throw new Error("please provide row id");
  try {
    const { rows } = await pool.query(
      "SELECT * FROM movies JOIN movie_actors ON (movies.id=movie_actors.movieid) WHERE movie_actors.actorid = $1",
      [id],
    );
    return rows;
  } catch (err) {
    throw new Error(`fetchActorMovies failed: ${err.message}`);
  }
};

const fetchGenreMovies = async (id) => {
  if (!id) throw new Error("please provide row id");
  try {
    const { rows } = await pool.query(
      `SELECT * FROM movies JOIN movie_genres ON (movies.id=movie_genres.movieid) WHERE movie_genres.genreid = $1`,
      [id],
    );
    return rows;
  } catch (err) {
    throw new Error(`fetchGenreMovies failed: ${err.message}`);
  }
};

const fetchMovieActors = async (id) => {
  if (!id) throw new Error("please provide row id");
  try {
    const { rows } = await pool.query(
      "SELECT * FROM actors JOIN movie_actors ON (actors.id=movie_actors.actorid) WHERE movie_actors.movieid = $1",
      [id],
    );
    return rows;
  } catch (err) {
    throw new Error(`fetchMovieActors failed: ${err.message}`);
  }
};

const fetchMovieGenre = async (id) => {
  if (!id) throw new Error("please provide row id");
  try {
    const { rows } = await pool.query(
      "SELECT * FROM genres JOIN movie_genres ON (genres.id=movie_genres.genreid) WHERE movie_genres.movieid = $1",
      [id],
    );
    return rows[0];
  } catch (err) {
    throw new Error(`fetchMovieGenre failed: ${err.message}`);
  }
};

const searchMovieTable = async (query) => {
  if(!query) throw new Error("please provide search query");
  try{
    const { rows } = await pool.query(`SELECT * FROM movies WHERE LOWER(title) LIKE LOWER($1)`, [`%${query}%`]);
    return rows;
  } catch (err) {
    throw new Error(`searchMovieTable failed: ${err.message}`);
  }
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
  fetchMovieGenre,
  searchMovieTable,
};
