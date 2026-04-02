const jwt = require("jsonwebtoken");
require("./config/db");
const sequelize = require("./config/db");
require("dotenv").config();
const express = require("express");
const cors = require("cors"); 
const { initUserIndex } = require('./initUserIndex'); 

// controllers
const { search, stats, providersList, loginController } = require("./controllers/authController");
const authMiddleware = require("./middlewares/authmiddleware");

// routes
const nppesRoutes = require('./Routes/nppes.routes');
const providerssRoutes = require("./Routes/Providerss.routes");
const statsRoutes = require('./Routes/stats.routes');
const userRoutes = require('./Routes/userRoutes');
const doctorRoutes = require('./Routes/doctorRoutes');

const app = express();

// CORS must come FIRST
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  exposedHeaders: ['x-auth-token'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", statsRoutes);
app.use('/api', nppesRoutes);
app.use("/api/providerss", providerssRoutes);
app.use('/api', userRoutes);
app.use('/api/doctors', doctorRoutes);

sequelize.sync().then(async () => {
  console.log("Database and table are synced");
  // Initialize Elasticsearch users index
  await initUserIndex();
});

// Auth & search routes
app.post("/api/login", loginController);
app.get("/api/search", authMiddleware, search);
app.get("/api/stats", authMiddleware, stats);
app.get("/api/providersList", authMiddleware, providersList);



// require("./scripts/cronSyncDoctors");



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});