import express from "express";
import {deleteSkill, getSkillsController, postSkillsController} from "../controllers/skillsController.mjs";

const router = express.Router();

router.route("/").get(getSkillsController).post(postSkillsController);
router.route("/:id").delete(deleteSkill);

export default router;