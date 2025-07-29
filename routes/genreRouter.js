const { Router } = require("express");
const genreRouter = Router();
const controller = require("../controllers/genreController");

genreRouter.get("/", controller.getGenres);
genreRouter.get("/new", controller.genresCreateGet);
genreRouter.post("/new", controller.genresCreatePost);
genreRouter.get("/:id/update", controller.genresUpdateGet);
genreRouter.post("/:id/update", controller.genresUpdatePost);
genreRouter.post("/:id/delete", controller.genresDeletePost);

module.exports = genreRouter;