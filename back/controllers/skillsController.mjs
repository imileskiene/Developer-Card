
import { query } from "express";
import { pg_postSkills, pg_getSkills, pg_deleteSkill} from "../models/skillsModel.mjs";

export const getSkillsController=async (req, res) => {
    try {
      const skills = await pg_getSkills();
      console.log("result");
      res.status(200).json(skills)
    } catch (err) {
      res.status(500).json({message: err.message});
    }
  };


export const postSkillsController = async (req, res)=>{

    try {
          const skill = await pg_postSkills(req.body);
          res.status(200).json(skill);

        } catch (err) {
            res.status(500).json({message: err.message}); 
        }
}

export const deleteSkill = async (req, res) =>{
  const {id} = req.params;
  try {
    const skillDelete = await pg_deleteSkill(id)
    res.status(200).json(skillDelete);
  } catch (error) {
    console.error('Error deleting skills:', error);
    res.status(500).json({message: error.message});
  }
}