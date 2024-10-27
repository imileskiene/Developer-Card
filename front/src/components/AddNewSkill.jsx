import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";

function AddNewSkill({ skills }) {
    console.log("getnew", skills);
    
  const { register, handleSubmit, reset } = useForm();
  const [error, setError] = useState(""); 

  const onSubmit = async (data) => {
    const newSkillTitle = data.title.trim().toLowerCase();

    // Patikrinti, ar įvestas skill jau egzistuoja
    const skillExists = skills.some(skill => skill.title.toLowerCase() === newSkillTitle);

    if (skillExists) {
      setError(`Skill "${data.title}" already exists.`); // Klaidos pranešimas
      return; // Nutraukti funkcijos vykdymą, jei skill egzistuoja
    }

    // Jeigu skill neegzistuoja, siųsti POST užklausą
    try {
      const newSkill = {
        ...data,
      };
      console.log("Sending newskill data:", newSkill);

      const response = await axios.post(
        "http://localhost:3001/api/v1/skills",
        newSkill
      );

      console.log("postskill", response);
      reset(); // Išvalyti formą
      setError(""); // Pašalinti klaidos pranešimą
    } catch (error) {
      console.error("Error adding skill:", error);
      setError("Failed to add new skill."); // Rodyti klaidos pranešimą, jei kažkas blogai
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="text" {...register("title", { required: true })} />
        <button>Add New Skill</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>} {/* Rodyti klaidos pranešimą, jei yra */}
    </>
  );
}

export default AddNewSkill;
