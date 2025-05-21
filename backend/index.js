import express from "express";
import authenticateRoute from "./routes/authenticateRoute.js";


const app = express();
const PORT = process.env.PORT || 3000;
app.get("/", (req, res) => {
  res.send("Server is ready");
});

app.use("/api/auth", authenticateRoute);

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});