const { countries } = require("../db/countries");
const db = require("../db/queries");
const { body, validationResult } = require("express-validator");
const countryCodes = countries.map(country => country.countryCode);

const validateActor = [
  body("firstName")
  .trim()
  .notEmpty()
  .withMessage("First name can not be empty.")
  .isAlpha("en-US", { ignore: " "})
  .withMessage("First name must only contain alphabet letters"),
  body("lastName")
  .trim()
  .notEmpty()
  .withMessage("Last name can not be empty.")
  .isAlpha("en-US", { ignore: " "})
  .withMessage("Last name must only contain alphabet letters"),
  body("country")
  .isIn(countryCodes)
  .withMessage("Please select a valid country"),
  body("birthdate", "Must be a valid date.")
    .trim()
    .notEmpty()
    .withMessage("Birthdate can not be empty.")
    .isISO8601()
    .withMessage("Please provide a valid date in the format MM-DD-YYYY")
]

const getActors = async (req, res) => {
    const actors = await db.fetchAllFromTable("actors");
    if(!actors){
        res.status(404).send("Could not find any actors")
        return;
    }
    res.render("actors", { title: "Actors", actors: actors });
};

const actorsCreateGet = async (req, res) => {
    const movies = await db.fetchAllFromTable("movies");
    res.render("createActor", { movies, countries });
};

const actorsUpdateGet = async (req, res) => {
    const actor = await db.fetchFromTable("actors", req.params.id);
    const movies = await db.fetchAllFromTable("movies");
    const associatedMovies = await db.fetchActorMovies(req.params.id);
    res.render("updateActor", { title: "Update actor", actor, countries, associatedMovies, movies });
};

const actorsUpdatePost = [
    validateActor,
    async (req, res) => {
    const actor = await db.fetchFromTable("actors", req.params.id);
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).render("updateActor", {
        title: "Update actor",
        actor: actor,
        countries: countries,
        errors: errors.array(),
      });
    }
    const { firstName, lastName, birthdate, country, src, movies } = req.body;
    await db.updateActor(req.params.id, { firstName, lastName, birthdate, country, src, movies });
    res.redirect(`/actor/${encodeURIComponent(req.params.id)}`);
    }
];

const actorsCreatePost = [
    validateActor,
    async (req, res) => {
    const errors = validationResult(req);
    const allMovies = await db.fetchAllFromTable("movies");
        if(!errors.isEmpty()){
            return res.status(400).render("createActor", {
            title: "Add new actor",
            countries: countries,
            errors: errors.array(),
            movies: allMovies,
        });
    }
    const { firstName, lastName, birthdate, country, src, movies } = req.body;
    await db.addActor({ firstName, lastName, birthdate, country, movies, src });
    res.redirect("/actor")
  }
];

const actorsDeletePost = async (req, res) => {
    await db.deleteFromTable("inventory", req.params.id, "actor");
    await db.deleteFromTable("actors", req.params.id);
    res.redirect("/actor");
}

const getActor = async (req, res) => {
    const actor = await db.fetchFromTable("actors", req.params.id);
    const associatedMovies = await db.fetchActorMovies(req.params.id);
    res.render("actorPage", { actor, countries, associatedMovies });
}

module.exports = {
    getActors,
    actorsCreateGet,
    actorsCreatePost,
    actorsUpdateGet,
    actorsUpdatePost,
    actorsDeletePost,
    getActor
};