const { countries } = require("../db/countries");
const db = require("../db/queries");
const { body, validationResult } = require("express-validator");
const countryCodes = countries.map((country) => country.countryCode);

const validateActor = [
  body("firstName")
    .trim()
    .notEmpty()
    .withMessage("First name can not be empty.")
    .isAlpha("en-US", { ignore: " " })
    .withMessage("First name must only contain alphabet letters"),
  body("lastName")
    .trim()
    .notEmpty()
    .withMessage("Last name can not be empty.")
    .isAlpha("en-US", { ignore: " " })
    .withMessage("Last name must only contain alphabet letters"),
  body("country")
    .isIn(countryCodes)
    .withMessage("Please select a valid country"),
  body("birthdate", "Must be a valid date.")
    .trim()
    .notEmpty()
    .withMessage("Birthdate can not be empty.")
    .isISO8601()
    .withMessage("Please provide a valid date in the format MM-DD-YYYY"),
];

const getActors = async (req, res) => {
  try {
    const actors = await db.fetchAllFromTable("actors");
    res.render("actors", { title: "Actors", actors });
  } catch (err) {
    console.error("getActors: could not fetch actors", err);
    res.status(500).send("Internal server error");
  }
};

const actorsCreateGet = async (req, res) => {
  try {
    const movies = await db.fetchAllFromTable("movies");
    res.render("createActor", { movies, countries });
  } catch (err) {
    console.error("actorsCreateGet: could not fetch actor", err);
    res.status(500).send("Internal server error");
  }
};

const actorsUpdateGet = async (req, res) => {
  try {
    const actor = await db.fetchFromTable("actors", req.params.id);
    const movies = await db.fetchAllFromTable("movies");
    const associatedMovies = await db.fetchActorMovies(req.params.id);
    res.render("updateActor", { actor, countries, associatedMovies, movies });
  } catch (err) {
    console.error("actorsUpdateGet: could not fetch actor", err);
    res.status(500).send("Internal server error");
  }
};

const actorsUpdatePost = [
  validateActor,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const actor = await db.fetchFromTable("actors", req.params.id);
        return res.status(400).render("updateActor", {
          actor,
          countries,
          errors: errors.array(),
        });
      }
      await db.updateActor(req.params.id, req.body);
      res.redirect(`/actor/${encodeURIComponent(req.params.id)}`);
    } catch (err) {
      console.error("actorsUpdatePost: could not update actors", err);
      res.status(500).send("Internal server error");
    }
  },
];

const actorsCreatePost = [
  validateActor,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const allMovies = await db.fetchAllFromTable("movies");
        return res.status(400).render("createActor", {
          countries,
          errors: errors.array(),
          movies: allMovies,
        });
      }
      await db.addActor(req.body);
      res.redirect("/actor");
    } catch (err) {
      console.error("actorsCreatePost: could not create actor", err);
      res.status(500).send("Internal server error");
    }
  },
];

const actorsDeletePost = async (req, res) => {
  try {
    await db.deleteFromTable("inventory", req.params.id, "actor");
    await db.deleteFromTable("actors", req.params.id);
    res.redirect("/actor");
  } catch (err) {
    console.error("actorsDeletePost: could not delete actor", err);
    res.status(500).send("Internal server error");
  }
};

const getActor = async (req, res) => {
  try {
    const actor = await db.fetchFromTable("actors", req.params.id);
    const associatedMovies = await db.fetchActorMovies(req.params.id);
    res.render("actorPage", { actor, countries, associatedMovies });
  } catch (err) {
    console.error("getActor: could not fetch actor", err);
    res.status(500).send("Internal server error");
  }
};

module.exports = {
  getActors,
  actorsCreateGet,
  actorsCreatePost,
  actorsUpdateGet,
  actorsUpdatePost,
  actorsDeletePost,
  getActor,
};
