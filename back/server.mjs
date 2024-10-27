import app from "./app.mjs";
import sql from "./postgres.mjs";
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT|| 3001;
(async () =>{
  try {
    await sql `SELECT 1+1 as result`;
    console.log("Connected to database");

  } catch (err) {
    console.error("Failed to connect to database", err.message);

  }
})();

app.listen(port, (err)=>{
  if(err)
  return console.log(`Error occured:{err.message}`);
 console.log(`Server started and listenng requests on port ${port}`);
});