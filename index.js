const express = require("express");
const app = express();
const getRoutes = require("./routes/getRoutes");
const PORT = 3001;

//middleware
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

app.use("/api/v1", getRoutes); // whenever the api started with /api/v1 it should go to getRoutes

app.listen(PORT, () => {
  console.log("Server is started");
});
