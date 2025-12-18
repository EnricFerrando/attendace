import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

const MONGO_URI = "mongodb+srv://enricnavarro00:Avemaria10@cluster0.u9l6qji.mongodb.net/?appName=Cluster0";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Conexió a Mongo
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connectat"))
  .catch(err => console.error(err));

// Rutes
import userRoutes from "./src/routes/user.routes.js";
import subjectRoutes from "./src/routes/subject.routes.js";
import absenceRoutes from "./src/routes/absence.routes.js";

app.use("/api/users", userRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/absences", absenceRoutes);

app.listen(3000, () => console.log("Servidor funcionant al port 3000"));
