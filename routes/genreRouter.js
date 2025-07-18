const { Router } = require("express");
const genreRouter = Router();
const controller = require("../controllers/genreController");

genreRouter.get("/", controller.getGenres);
genreRouter.get("/new", controller.genresCreateGet);
genreRouter.post("/new", controller.genresCreatePost);

module.exports = genreRouter;