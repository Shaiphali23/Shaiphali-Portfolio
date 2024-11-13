const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4000;

//Middleware
app.use(bodyParser.json());
app.use(cors({
  origin: ['https://shaiphali-portfolio-kvqqfk1p2-shaiphali-jaiswals-projects.vercel.app', 'http://localhost:3000'],
  methods: ['GET', 'POST'], // Allow GET and POST methods
  allowedHeaders: ['Content-Type'],
}));

//Routes
const contactRoutes = require("./routes/contactRoutes");
app.use("/api", contactRoutes);

//connect to MongoDB
connectDB();

//Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
