const { Router } = require("express");
const movieRouter = Router();
const controller = require("../controllers/movieController");

movieRouter.get("/", controller.getMovies);
movieRouter.get("/new", controller.moviesCreateGet);
movieRouter.post("/new", controller.moviesCreatePost);
movieRouter.get("/:id/update", controller.moviesUpdateGet);
movieRouter.post("/:id/update", controller.moviesUpdatePost);
movieRouter.post("/:id/delete", controller.moviesDeletePost);
movieRouter.get("/search", controller.searchMovies);
movieRouter.get("/:id", controller.getMovie);

module.exports = movieRouter;
