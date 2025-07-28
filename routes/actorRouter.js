const { Router } = require("express");
const actorRouter = Router();
const controller = require("../controllers/actorController")

actorRouter.get("/", controller.getActors);
actorRouter.get("/new", controller.actorsCreateGet);
actorRouter.post("/new", controller.actorsCreatePost);
actorRouter.get("/:id/edit", controller.actorsUpdateGet);
actorRouter.post("/:id/edit", controller.actorsUpdatePost);

module.exports = actorRouter;