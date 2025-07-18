const { Router } = require("express");
const actorRouter = Router();
const controller = require("../controllers/actorController")

actorRouter.get("/", controller.getActors);
actorRouter.get("/new", controller.actorsCreateGet);
actorRouter.post("/new", controller.actorsCreatePost);

module.exports = actorRouter;