import './App.css';
import Card from './components/Card';
import DeveloperForm from './components/DeveloperForm';



// import { Routes, Route } from "react-router-dom";


import axios from "axios";
import { useState, useEffect } from "react";

const URL = "http://localhost:3001/api/v1/developers";

function App() {
  const [developers, setDevelopers] =useState([]);
  

  // useEffect funkciją, iškviečia fetchDevelopers funkciją, kai komponentas yra užkrautas.
  useEffect(() => {
    fetchDevelopers();
  }, []); 

  const fetchDevelopers=async()=>{
    const response = await axios.get(URL);
    setDevelopers(response.data);
// console.log("app", response.data);

  }


  //Funkcija, kuri keičia programuotojo "available" būseną ir siunčia atitinkamą užklausą į API.
  const handleToggleAvailability = async (developer_id, available) => {
    // console.log("all", developer_id, available);
    
    try {
      const updateAvailable = !available
      await axios.put(`http://localhost:3001/api/v1/developers/${developer_id}`, { available: updateAvailable });
      console.log("available", updateAvailable);
      
      setDevelopers(
        developers.map(developer =>
          developer.developer_id === developer_id ? { ...developer, available: updateAvailable } : developer
        )
        
      );
    } catch (error) {
      console.error('Error toggling developer availability:', error);
    }
  };


  // const handleUpdateDeveloper = async (updatedDeveloper) => {
  //   try {
  //     await axios.patch(`http://localhost:3001/api/v1/developers/${updatedDeveloper.developer_id}`, updatedDeveloper);
  //     setDevelopers(
  //       developers.map(dev => dev.developer_id === updatedDeveloper.developer_id ? updatedDeveloper : dev)
  //     );
  //   } catch (error) {
  //     console.error('Error updating developer:', error);
  //   }
  // };
  return (
    <>
    <DeveloperForm onSubmit={fetchDevelopers} /> 
    {developers.map((developer) => ( 
    <Card key={developer.developer_id} developers={developer} onToggleAvailability={handleToggleAvailability} fetchDevelopers={fetchDevelopers}/>
    // onUpdateDeveloper={handleUpdateDeveloper}
  ))}
    
    </>
  );
}

export default App;
