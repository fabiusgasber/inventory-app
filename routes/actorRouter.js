const { Router } = require("express");
const actorRouter = Router();
const controller = require("../controllers/actorController")

actorRouter.get("/", controller.getActors);

module.exports = actorRouter;