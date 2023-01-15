const express = require("express");
const app = express();
const port = 3000;

const db = require("./models");
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());


require("./routes/ann_routes")(app);

app.listen(port, () => {
    console.log("server up and running on PORT :", port);
});

db.sequelize.sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

