import { connect } from "mongoose";
import { app } from "./app.js";
import connectDB from "./db/index.js";
const Port = 4000 || process.env.port;

connectDB().then(() => {
  app.listen(Port, () => {
    console.log(`server running  on http://localhost:${Port}`);
  });
})
.catch((err)=>{
    console.log("error",err)
})

