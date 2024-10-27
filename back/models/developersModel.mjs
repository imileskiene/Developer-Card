import sql from "./../postgres.mjs";

// export const pg_getDevelopers = async () => {
//   const developersList = sql`
//     SELECT * 
//     FROM developers;
//     `;
//   return developersList;
// };

export const pg_getDevelopers = async () => {
  const developersList = sql`
    SELECT developers.developer_id, developers.name, developers.lastname, developers.available, images.image
    FROM developers
    LEFT JOIN developers_skills ON developers.developer_id = developers_skills.developer_id
    LEFT JOIN images ON images.image_id = developers_skills.image_id
    GROUP BY developers.developer_id, images.image
  `;
  return developersList;
};

export const pg_getDevelopersById = async (id) => {
  const developer = await sql`
    SELECT * 
    FROM developers
    WHERE developer_id = ${id}
    `;
  return developer[0];
};



export const pg_getDevelopersSkillsById = async (id) => {
  const developerById = await sql`
    SELECT developers.developer_id, developers.name, developers.lastname, developers.available, ARRAY_AGG(skills.title) AS skill, images.image
FROM developers 
INNER JOIN developers_skills ON developers.developer_id=developers_skills.developer_id
LEFT JOIN images ON developers_skills.image_id=images.image_id
INNER JOIN skills ON developers_skills.skill_id=skills.skill_id 
WHERE developers.developer_id = ${id}
GROUP BY developers.developer_id, images.image
 `;
  return developerById[0];
};

// export const pg_getDevelopersById = async (id) => {
//   const developerById = await sql`
//     SELECT developers.id, developers.name, developers.lastname, skills.title AS skill
//     FROM developers 
//     INNER JOIN developers_skills ON developers.id=developers_skills.developer_id
//     INNER JOIN skills ON developers_skills.skill_id=skills.id 
//     WHERE developers.id = ${id};
//   `;
//   return developerById;
// };


// export const pg_postDevelopers = async (developer) => {
//   const { name, lastname } = developer;

//   const postedDeveloper = await sql`
//     INSERT INTO developers
//     (name, lastname)
//     VALUES (${name}, ${lastname})
//     RETURNING *
//     `;

//   return postedDeveloper[0];
// };

export const pg_postDevelopersSkills = async (name, lastname, skill_ids, image=null) => {
  try {
    let result = await sql.begin(async (sql) => {
    const newDeveloper = await sql`
    INSERT INTO developers (name, lastname, available)
    VALUES(
    ${name}, ${lastname}, TRUE
    ) 
    RETURNING developer_id
    `;

    const newDeveloperId = newDeveloper[0].developer_id;

    let imageId = null;
    if (image) {
      const newImage = await sql`
          INSERT INTO images (image)
          VALUES (${image})
          RETURNING image_id
        `;
        imageId = newImage[0].image_id; // Išsaugome gautą image_id
    }

    for (const skill_id of skill_ids) {
      await sql`
      INSERT INTO developers_skills (developer_id, skill_id, image_id )
      VALUES (${newDeveloperId}, ${skill_id}, ${imageId})
      `;
    }
    
    return newDeveloper[0];
  });
  return result;

  } catch (error) {
    console.error('Error adding developer:', error);
    throw error;
  }
}; 

export const pg_updateDeveloperPartial = async (id, developerdata) => {
  const { name, lastname, skill_ids, image } = developerdata;
  const result = await sql.begin(async () => {
    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (lastname !== undefined) updateFields.lastname = lastname;

    if (Object.keys(updateFields).length > 0) {
      console.log("Updating developer with ID:", id, "with fields:", updateFields);
      await sql`
          UPDATE developers
          SET ${sql(updateFields)}
          WHERE developer_id = ${id}
          `;
    }

    // Atnaujinti nuotrauką, jei ji pateikta
    let image_id;

    if (image !== undefined) {
      console.log("Updating image for developer ID:", id, "with image URL:", image);
      
      // Patikrinkite, ar nuotrauka jau egzistuoja
      const existingImage = await sql`
        SELECT image_id
        FROM images
        WHERE image = ${image}
      `;
      
      if (existingImage.length > 0) {
        // Jei nuotrauka jau egzistuoja, naudokite jos image_id
        image_id = existingImage[0].image_id;
      } else {
        // Jei nuotrauka neegzistuoja, įterpkite ją
        const imageInsertResult = await sql`
          INSERT INTO images (image)
          VALUES (${image})
          RETURNING image_id
        `;
        image_id = imageInsertResult[0].image_id;
      }
    }

    // Atnaujinti developers_skills, jei pateikti skill_ids
    if (skill_ids !== undefined) {
      console.log("Updating skills for developer ID:", id);
      
      // Ištrinti senus įrašus
      await sql`
        DELETE FROM developers_skills
        WHERE developer_id = ${id}
      `;

      // Įterpti naujus įrašus su image_id
      for (const skill_id of skill_ids) {
        console.log("Inserting skill ID:", skill_id, "with image ID:", image_id);
        await sql`
          INSERT INTO developers_skills (developer_id, skill_id, image_id)
          VALUES (${id}, ${skill_id}, ${image_id})
        `;
      }
    }

    const developerUpdate = await pg_getDevelopersById(id);

    return developerUpdate;
  });

  return result;
};

export const pg_putDeveloper = async (id, available) => {
  const result = await sql.begin(async (sql) => {
    const developerUpdate = await sql`
        UPDATE developers
        SET available = ${available}
        WHERE developer_id = ${id}
        RETURNING *
        `;

    return developerUpdate;
  });
  return result;
};



