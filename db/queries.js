const pool = require("./pool");

const checkAllowed = (table) => {
    const allowedTables = ["movies", "genres", "actors"];
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

const updateMovie = async (id, { title, length, description, price, rating, quantity }) => {
    await pool.query("UPDATE movies SET title = $2, length = $3, description = $4, price = $5, rating = $6, quantity = $7 WHERE id = $1", [id, title, length, description, price, rating, quantity]);
}

const addGenre = async({ genre }) => {
    await pool.query("INSERT INTO genres (genre) VALUES($1)", [genre]);
}

const updateGenre = async (id, { genre }) => {
    await pool.query("UPDATE genres SET genre = $2 WHERE id = $1", [id, genre]);
}

const addActor = async({ firstName, lastName, birthdate, country, src }) => {
    await pool.query("INSERT INTO actors (firstName, lastName, birthdate, country, src) VALUES($1, $2, $3, $4, $5)", [firstName, lastName, birthdate, country, src]);
}

const updateActor = async (id, { firstName, lastName, birthdate, country, src }) => {
    await pool.query("UPDATE actors SET firstName = $2, lastName = $3, birthdate = $4, country = $5, src = $6 WHERE id = $1", [id, firstName, lastName, birthdate, country, src]);
}

const deleteFromTable = async (table, id) => {
    checkAllowed(table);
    const { rows } = await pool.query(`DELETE FROM ${table} WHERE id=$1`, [id]);
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
};