const { Router } = require("express");
const movieRouter = Router();
const controller = require("../controllers/movieController");

movieRouter.get("/", controller.getMovies);
movieRouter.get("/new", controller.moviesCreateGet);
movieRouter.post("/new", controller.moviesCreatePost);

module.exports = movieRouter;