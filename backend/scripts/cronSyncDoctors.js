// // backend/cron/doctorSync.js
// const cron = require("node-cron");
// const fs = require("fs");
// const Doctor = require("../models/doctor");
// const client = require("../config/elasticSearch");
// const { Op } = require("sequelize"); // <-- fix here

// const LAST_INDEX_FILE = "./lastIndexed.json";

// cron.schedule("*/1 * * * *", async () => {
//   console.log(" Running doctor incremental sync job...");

//   try {
//     // Read last indexed ID
//     let lastIndexedData = { lastIndexedId: 0 };
//     if (fs.existsSync(LAST_INDEX_FILE)) {
//       lastIndexedData = JSON.parse(fs.readFileSync(LAST_INDEX_FILE, "utf8"));
//     }
//     const lastId = lastIndexedData.lastIndexedId;

//     // Fetch only new providers/doctors
//     const newDoctors = await Doctor.findAll({
//       where: { id: { [Op.gt]: lastId } }, // <-- fixed Op usage
//       order: [["id", "ASC"]],
//     });

//     if (newDoctors.length === 0) {
//       console.log(" No new doctors to sync.");
//       return;
//     }

//     for (const doctor of newDoctors) {
//       const docName =
//         doctor.providerName || `${doctor.first_name || ""} ${doctor.last_name || ""}`.trim();

//       await client.index({
//         index: "doctors",
//         id: doctor.id.toString(),
//         document: {
//           name: docName,
//           speciality: doctor.speciality || "",
//           location: doctor.location || "",
//           organization_name: doctor.organization_name || "",
//         },
//         refresh: "wait_for", // ensures searchable immediately
//       });
//     }

//     // Update last indexed ID
//     const maxId = newDoctors[newDoctors.length - 1].id;
//     fs.writeFileSync(LAST_INDEX_FILE, JSON.stringify({ lastIndexedId: maxId }));

//     console.log(` ${newDoctors.length} new doctors synced to Elasticsearch.`);
//   } catch (err) {
//     console.error(" Cron sync failed:", err);
//   }
// });