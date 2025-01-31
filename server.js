require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());


app.get('/', (req, res) => {
    res.send('<h1> Welcome to FAQ API </h1>');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
