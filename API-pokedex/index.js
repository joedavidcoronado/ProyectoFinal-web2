const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());

app.use('/uploads', express.static('uploads'));

const port = 3001;
const db = require("./models/");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

db.sequelize.sync({
}).then(() => {
    console.log("db resync");
});

require("./routes")(app);
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});