import express from "express";

//Create a new Express router instance
const router = express.Router();

//Define a GET route for the signup endpoint
router.get("/signup", (req, res) => {
    res.json({
        data: "You hit signup endpoint",
    });
});

//Define a GET route for the login endpoint
router.get("/login", (req, res)=>{
    res.json({
        data: "You hit login endpoint",
    });
});

//Define a GET route for the logout endpoint
router.get("/logout", (req,res)=> {
    res.json({
        data: "You hit logout endpoint",
    });
});

// Export the router instance as the default export
export default router;
