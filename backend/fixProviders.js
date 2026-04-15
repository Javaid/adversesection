// // fixProviders.js
// const axios = require("axios");
// const sequelize = require("./config/db"); // your Sequelize instance
// const Providerss = require("./models/providerss.model"); // just require the model directly

// async function fixOldProviders() {
//   try {
//     // Fetch all providers
//     const providers = await Providerss.findAll({});

//     console.log(`Found ${providers.length} providers in DB.`);

//     for (const p of providers) {
//       let updated = false;

//       // Fix providerName
//       if (!p.providerName || p.providerName.trim() === "") {
//         const fullName = `${p.first_name || ""} ${p.last_name || ""}`.trim();
//         p.providerName = fullName || p.organization_name?.trim() || "Unknown Provider";
//         updated = true;
//       }

//       // Fix speciality
//       if (!p.speciality || p.speciality.trim() === "") {
//         p.speciality = "N/A"; // fallback if empty
//         updated = true;
//       }

//       // Fix location if empty
//       if (!p.location || p.location.trim() === "") {
//         p.location = "N/A";
//         updated = true;
//       }

//       // Update record only if needed
//       if (updated) {
//         await p.save({ fields: ["providerName", "speciality", "location"] });
//         console.log(`Updated provider: ${p.npi} -> ${p.providerName}, ${p.speciality}`);
//       }
//     }

//     console.log("All missing providers processed successfully.");

//   } catch (err) {
//     console.error("Error fixing providers:", err);
//   } finally {
//     await sequelize.close();
//   }
// }

// fixOldProviders();
