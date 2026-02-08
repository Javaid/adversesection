const sequelize = require("./config/db");

sequelize.authenticate()
  .then(() => console.log(" DB connected from config/db.js"))
  .catch(err => console.error(" DB error:", err));
