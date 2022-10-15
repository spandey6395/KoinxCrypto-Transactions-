let axios = require("axios");
const userModel = require("../models/userModel");
const priceModel = require("../models/priceModel");
let getAddress = async function (req, res) {
  try {
    let user = req.body.user;
    let userData = await userModel.findOne({ userAddress: user });
    if (userData) return res.send(userData);
    let options = {
      method: "get",
      url: `https://api.etherscan.io/api?module=account&action=txlist&address=${user}&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=DFKVJEC3F8Y17W1CC3CGBXY4X7EMXYHYQP`,
    };
    let result = await axios(options);

    let data = result.data;
    let userCreated = await userModel.create({
      userAddress: user,
      result: data.result,
    });
    res.status(200).send({ status: true, data: userCreated });
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: err.message });
  }
};

const getUser = async function (req, res) {
  try {
    let user = req.body.user;
    let result={userAddress:user}
    let options = {
      method: "get",
      url: `https://api.etherscan.io/api?module=account&action=balance&address=${user}&tag=latest&apikey=DFKVJEC3F8Y17W1CC3CGBXY4X7EMXYHYQP`,
    };
    let data = await axios(options);
    let fetchedBalance =parseInt(data.data.result);
    const etherPrice = await priceModel.findOne({ cryptoCurrency: "ethereum" });
    const findUser = await userModel
      .findOne({ userAddress: user })
      .select({ _id: 0, result: 1 });
    let transactions = findUser.result;
   // console.log(parseInt(fetchedBalance));

    for (let obj of transactions) {
      if(obj.from===user){
        fetchedBalance+=parseInt(obj.value)
      }
      else if(obj.to===user){
        fetchedBalance-=parseInt(obj.value)
      }
    }
    result.currentBalance=fetchedBalance
    result.ethereumPrice=etherPrice.price.inr
    if (!findUser) return res.status(404).send({ status: false, message: "not found" });
    return res.status(200).send({status:true,data:result});
  } catch (err) {
    return res.status(500).send({ status: false, error: err.message });
  }
};

module.exports = { getAddress, getUser };
