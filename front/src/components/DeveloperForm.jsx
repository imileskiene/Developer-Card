import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import AddNewSkill from "./AddNewSkill";

function DeveloperForm({developer,developer_id, onSubmit}) {
  console.log("form", developer);
  
  const [skills, setSkills] = useState([]);
  // const { register, handleSubmit, reset } = useForm();
  const { register, handleSubmit, reset,setValue } = useForm({
    defaultValues: {
      name: developer ? developer.name : "", 
      lastname: developer ? developer.lastname : "",
      skill_ids: developer ? developer.skill || [] : [] , 
      image: developer ? developer.image : "", 
    },
  });

  useEffect(() => {
    if (developer) {
      setValue("name", developer.name);
      setValue("lastname", developer.lastname);
      // setValue("skill_ids", developer.skill || []);
      setValue("image", developer.image);

      if (developer.skill) {
        setValue("skill_ids", developer.skill.map(skill => skill.skill_id)); 
      }
    }
  }, [developer, setValue]);

  const fetchSkills = async () => {
    const response = await axios.get("http://localhost:3001/api/v1/skills");
    setSkills(response.data);
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const onSkillDelete = async (skillId) => {
    await axios.delete(`http://localhost:3001/api/v1/skills/${skillId}`);
    fetchSkills(); // Atnaujiname įgūdžių sąrašą po ištrynimo
  };

  const onSubmitHandler = async (data) => {
    const skillsData = {
      ...data,
      developer_id: developer_id,
      skill_ids: data.skill_ids.map((id) => parseInt(id)),
      image: data.image || null,
    };
    
    // console.log("Sending data:", skillsData);

    if (developer_id) {
      await axios.patch(`http://localhost:3001/api/v1/developers/${developer_id}`, skillsData);
      onSubmit(); 
    } else {
      await axios.post("http://localhost:3001/api/v1/developers", skillsData);
    }
    onSubmit(); 
    reset();
  };

  return (
    <>
      <form className="form-container" onSubmit={handleSubmit(onSubmitHandler)}>
      <h4>{developer ? "Edit Developer" : "Create Developer"}</h4>
        <input className="inputField"
          {...register("name", { required: true })}
          placeholder="First name"
        />
        <input className="inputField"
          {...register("lastname", { minLength: 2 })}
          placeholder="Last name"
        />

        <h4>Mark your skills:</h4>
        {skills.map((skill) => (
          <div key={skill.skill_id}>
            <input
              type="checkbox"
              id={`skill_${skill.skill_id}`}
              value={skill.skill_id}
              {...register("skill_ids")} 
              // Patikriname, ar 'developer.skill' egzistuoja ir ar įgūdis yra pažymėtas (redagavimo metu)
              
            />
            <label>{skill.title}</label>
            {!developer &&
            <button 
              type="button" 
              onClick={() => onSkillDelete(skill.skill_id)} 
              style={{ marginLeft: "10px", color: "red" }}
            >
              Delete
            </button>}
          </div>
        ))}

        <input
          {...register("image")}
          placeholder="Image URL"
        />

        <input style={{marginLeft:"10px"}} type="submit" />
      </form>

     {!developer && <AddNewSkill skills={skills} />}
    </>
  );
}

export default DeveloperForm;
