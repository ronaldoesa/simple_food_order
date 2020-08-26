const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
//linker to model(index.js)

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//port config
const PORT = process.env.PORT || 3030;
const socketServer = app.listen(PORT, () => {
    console.log(`System server is running on port ${PORT}`);
});

//routes
require("./routes/vendor-routes.js")(app);
require("./routes/food-routes.js")(app);
require("./routes/order-routes.js")(app);

module.exports = app;
