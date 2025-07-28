const { countries } = require("../db/countries");
const db = require("../db/queries");
const { body, validationResults } = require("express-validator");
const countryCodes = countries.map(country => country.countryCode);

const validateActor = [
  body("firstName")
  .trim()
  .notEmpty()
  .withMessage("First name can not be empty.")
  .isAlpha()
  .withMessage("First name must only contain alphabet letters"),
  body("lastName")
  .trim()
  .notEmpty()
  .withMessage("Last name can not be empty.")
  .isAlpha()
  .withMessage("Last name must only contain alphabet letters"),
  body("birthCountry")
  .notEmpty()
  .withMessage("Country can not be empty.")
  .isIn(countryCodes)
  .withMessage("Please select a valid country"),
  body("birthdate", "Must be a valid date.")
    .trim()
    .notEmpty()
    .withMessage("Birthdate can not be empty.")
    .isISO8601()
    .withMessage("Please provide a valid date in the format MM-DD-YYYY")
]

const getActors = (req, res) => {
    const actors = db.getActors();
    if(!actors){
        res.status(404).send("Could not find any actors")
        return;
    }
    res.render("actors", { title: "Actors", actors: actors, deleteFn: db.deleteActor });
};

const actorsCreateGet = (req, res) => {
    res.render("createActor", { title: "Add new actor", countries: countries});
};

const actorsUpdateGet = (req, res) => {
    const actor = db.findActor(req.params.id);
    res.render("updateActor", { title: "Update actor", actor: actor, countries: countries});
};

const actorsUpdatePost = [
    validateActor,
    (req, res) => {
    const errors = validationResults(req);
    if(!errors.isEmpty()){
        return res.status(400).render("updateActor", {
        title: "Update actor",
        actor: actor,
        countries: countries,
        errors: errors.array(),
      });
    }
    const { firstName, lastName, birthdate, country, src } = req.body;
    db.updateActor(req.params.id, { firstName, lastName, birthdate, country, src });
    res.redirect("/");
    }
];

const actorsCreatePost = [
    validateActor,
    (req, res) => {
    const errors = validationResults(req);
    if(!errors.isEmpty()){
        return res.status(400).render("createActor", {
        title: "Add new actor",
        countries: countries,
        errors: errors.array(),
      });
    }
    const { firstName, lastName, birthdate, country, src } = req.body;
    db.addActor({ firstName, lastName, birthdate, country, src });
    res.redirect("/actor")
    }
];

const actorsDeletePost = (req, res) => {
    db.deleteActor(req.params.id);
    res.redirect("/actor");
}

module.exports = {
    getActors,
    actorsCreateGet,
    actorsCreatePost,
    actorsUpdateGet,
    actorsUpdatePost,
    actorsDeletePost
};