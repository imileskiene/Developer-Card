import Skill from "./Skill";
import { useState, useEffect } from "react";
import axios from "axios";
import { skillColors } from "../colors";

function SkillsList({developerId, onSubmit}) {
    // console.log("skillslist", developerId);
    
  const [skills, setSkills] = useState([]);

  // Fetching data from database

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/v1/developers/${developerId}/skills`);
        setSkills(res.data.skill);
        // console.log("patikrinimas", res);
        
        // console.log("get skills", res.data.skill );
        onSubmit();
      } catch (error) {
        console.error('Error fetching skills:', error);
      }
      
    };

    fetchSkills();
  }, [developerId]);

  return (
    <ul>
      {skills && skills.map((skill, id) => (
        <Skill key={id} title={skill} color={skillColors[skill]} />
      ))}
    </ul>
  );
}

export default SkillsList;