const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const ConnectTODB = require("./Database/db");
const userRoute=require("./routes/user-route");
const jobRoute=require("./routes/job-routes");
const dashboardRoute=require("./routes/dashboard-routes")
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

ConnectTODB();
app.use("/api/user",userRoute);
app.use("/api/job",jobRoute);
app.use("/api/dashboard",dashboardRoute);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

