const express = require("express");
const bodyParser = require("body-parser");
const route = require("./routes/route.js");
const cron = require("node-cron");
let axios = require("axios");
const priceModel = require("../src/models/priceModel");
const { default: mongoose } = require("mongoose");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

cron.schedule("*/10 * * * *", async () => {
  let id = "ethereum";
  let price = await axios(
    `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=inr`
  );
  let data = await priceModel.findOne({ cryptoCurrency: id });
  if (data) {
    await priceModel.updateOne(
      { cryptoCurrency: id },
      { price: price.data.ethereum }
    );
  } else {
    await priceModel.create({ cryptoCurrency: id, price: price.data.ethereum });
  }
});

mongoose
  .connect(
    "mongodb+srv://spandey6395:R43s8If0R4EpfraA@cluster0.mknlo.mongodb.net/Koinx",
    {
      useNewUrlParser: true,
    }
  )
  .then(() => console.log("MongoDb is connected"))
  .catch((err) => console.log(err));

app.use("/", route);

app.listen(process.env.PORT || 3000, function () {
  console.log("Express app running on port " + (process.env.PORT || 3000));
});
