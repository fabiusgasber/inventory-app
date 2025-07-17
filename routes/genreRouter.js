const { Router } = require("express");
const genreRouter = Router();
const controller = require("../controllers/genreController");

genreRouter.get("/", controller.getGenres);

module.exports = genreRouter;