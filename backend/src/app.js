import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({ origin: "*", Credential: true }));

app.use(express.json({limit:'16kb'}));

app.use(express.urlencoded({ extended: true, limit: "16Kb" })); //handlind search url
app.use(express.static("public")); //storing files in folder in local server
app.use(cookieParser());



import router from './routes/user.route.js'

app.use("/api/v1/users", router);



export {app}