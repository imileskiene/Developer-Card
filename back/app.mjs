import express from "express";
import cors from "cors";
import developersRouter from "./routes/developerRoutes.mjs"
import skillsRouter from "./routes/skillRoutes.mjs"


const app = express();

// enable all cors requests
app.use(cors());
//body parser butinai pasirasom, nes be jo neveiks body
app.use(express.json());

//midllewares rasomas po app
app.use("/api/v1/developers", developersRouter)
app.use("/api/v1/skills", skillsRouter)





export default app;