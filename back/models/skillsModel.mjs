import sql from "../postgres.mjs";

export const pg_getSkills = async () => {
    const skillsList = sql`
    SELECT *
      FROM skills;
    `;
    return skillsList;
  };

  export const pg_postSkills = async ({ title }) => {
    // Pirma patikriname, ar toks "skill" jau egzistuoja
    const existingSkill = await sql`
      SELECT *
        FROM skills
        WHERE title = ${title}
    `;
  
    // Jei toks skill egzistuoja, grąžiname klaidą
    if (existingSkill.length > 0) {
      throw new Error(`Skill with title '${title}' already exists.`);
    }
  
    // Jei nėra, tada įrašome naują skill
    const postedSkills = await sql`
      INSERT INTO skills 
      (title)
      VALUES (${title})
      RETURNING *
    `;
  
    return postedSkills[0]; 
  };

  export const pg_deleteSkill = async (id) => {
    console.log("deleteskill", id);
    
    const result = await sql`
    DELETE FROM skills
    WHERE skill_id = ${id}
    RETURNING *
    `;
    return result[0];
  };