import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connect from "./utils/db.js";

// Initializing Express
const app = express();
app.use(express.json());

// Set Port
const _port = process.env.PORT || 3000;

//Methoden HTTP
// GET, POST, PUT/PATCH:ID, DELETE:ID

//Routers
//http://localhost.3000/api/product/
/* app.use("/api/product", productRouter);
app.use("/api/user", userRouter); */
//middleware Error
app.use((err, req, res, next) =>{
    console.error(err);
    return sendStatus(500);
});
connect().then(() => {
    app.listen(_port, () => {
      console.log(`I'm running on Port ${_port}`);
    });
  });