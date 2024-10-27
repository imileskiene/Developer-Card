import {
  pg_getDevelopers,
  pg_postDevelopersSkills,
  pg_updateDeveloperPartial,
  pg_getDevelopersById,
  pg_getDevelopersSkillsById, pg_putDeveloper
} from "../models/developersModel.mjs";//pg_postDevelopers,

export const getDevelopersController = async (req, res) => {
  try {
    const developer = await pg_getDevelopers();
    console.log("result");
    res.status(200).json(developer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getDevelopersByIdController = async (req, res)=>{

  try {
    const developer = await pg_getDevelopersById(req.params.id)
    res.status(200).json(developer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}


export const getDevelopersSkillsByIdController = async (req, res) => {
  try {
    const developerId = await pg_getDevelopersSkillsById(req.params.id);
    res.status(200).json(developerId);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// export const postDevelopersController = async (req, res) => {
//   try {
//     //   console.log(req.body)
//     const developer = await pg_postDevelopers(req.body);
//     //   console.log(developer + "from contoller");
//     res.status(200).json(developer);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

export const postDevelopersSkillsController = async (req, res)=>{
  try {
    const {name, lastname, skill_ids, image} =req.body;
    console.log("Request body:", req.body);
    const newDeveloper = await pg_postDevelopersSkills(name, lastname, skill_ids, image)
    console.log(newDeveloper, "from contoller")
    res.status(200).json(newDeveloper)
  } catch (err) {
    console.error("Error in postDevelopersSkillsController:", err);
    res.status(500).json({ message: err.message })
  }
}


export const updatePartialDeveloperController = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, lastname, skill_ids, image } = req.body;
    const newDeveloper = await pg_updateDeveloperPartial(id, req.body);

    res.status(200).json(newDeveloper);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const putDeveloperController = async (req, res) => {
  try {
    const { id } = req.params;
    const { available } = req.body;
    const newDeveloper = await pg_putDeveloper(id, available);

    res.status(200).json(newDeveloper);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

