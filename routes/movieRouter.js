const { Router } = require("express");
const movieRouter = Router();
const controller = require("../controllers/movieController");

movieRouter.get("/", controller.getMovies);

module.exports = movieRouter;