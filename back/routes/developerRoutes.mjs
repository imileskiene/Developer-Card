import express from "express";
import {
  getDevelopersController,
  postDevelopersSkillsController,
  updatePartialDeveloperController,
  getDevelopersSkillsByIdController,
  getDevelopersByIdController, putDeveloperController
} from "../controllers/developersController.mjs"; //postDevelopersController,

const router = express.Router();

router
  .route("/")
  .get(getDevelopersController)
  .post(postDevelopersSkillsController);

router
  .route("/:id")
  .get(getDevelopersByIdController)
  .patch(updatePartialDeveloperController).put(putDeveloperController)

router.route("/:id/skills").get(getDevelopersSkillsByIdController);
export default router;
