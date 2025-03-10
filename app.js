const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const port = process.env.port || 5000;
const Routes = require("./Routes");
const compression = require("compression");

app = express();
app.use(express.json());
app.use(compression());

app.use(cors());

const db_URI =
  "mongodb+srv://ArunAllanki:9704002577@chop-sticks.fjpjd.mongodb.net/ChopSticksProject?retryWrites=true&w=majority&appName=chop-sticks";

const passWord = "Arun@2005";

mongoose
  .connect(db_URI)
  .then(() => {
    console.log("DB connected succesfully....");
  })
  .catch((error) => {
    console.log(`Error connecting DB : ${error}`);
  });

app.use(Routes);

app.post("/Admin/Login", async (req, res) => {
  try {
    const { attempted } = req.body;
    if (attempted == passWord) {
      res.status(200).json("true");
    } else {
      res.status(200).json("false");
    }
  } catch (err) {
    res.status(500).json({ message: "Issue while Loggin In" });
  }
});

app.listen(port, () => {
  console.log(`Server serving to port ${port}......`);
});
