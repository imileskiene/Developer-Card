import SkillsList from "./SkillsList";
import { useState, useEffect } from "react";
import Intro from "./Intro";
import DeveloperForm from "./DeveloperForm";
import axios from "axios";


function Card({ developers, onToggleAvailability, fetchDevelopers }) {
  // console.log("card", developers);
  const [selectedDeveloper, setSelectedDeveloper] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Būsenos, ar redaguojame


  const handleEditClick = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/v1/developers/${developers.developer_id}/skills`);
      setSelectedDeveloper(response.data);
      setIsEditing(true);
    } catch (error) {
      console.error("Error fetching developer data:", error);
    }
  };

  const handleCloseEdit = () => {
    setIsEditing(false);
    setSelectedDeveloper(null);
  };

  const handleSubmit = async () => {
    await fetchDevelopers();  // Atnaujina developers sąrašą po PATCH
    setIsEditing(false);
  };

  return (
    <>
      <div
        className={`card ${developers.available ? "available" : "unavailable"}`}
        onClick={() =>
          onToggleAvailability(developers.developer_id, developers.available)
        }
      >
        <img src={developers.image} alt="Avatar" />

        <Intro name={developers.name} lastname={developers.lastname} />
        <SkillsList developerId={developers.developer_id} onSubmit={handleSubmit} />

        <button
    onClick={(e) => {
      e.stopPropagation(); // Sustabdo įvykio sklindimą ir apsaugo nuo 'available' statuso keitimo
      handleEditClick();
    }}
  >
    Edit
  </button>
      </div >
      {isEditing && (
        <div>
          <button className="editbutton" onClick={handleCloseEdit}>Close Editor</button>
          <DeveloperForm developer={selectedDeveloper} developer_id={developers.developer_id} onSubmit={handleSubmit} />
          
        </div>
      )}
    </>
  );
}

export default Card;
