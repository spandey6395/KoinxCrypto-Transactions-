const express = require('express');
const router = express.Router();
const controller = require("../controllers/controller");
router.get("/address", controller.getAddress)
 router.get("/price", controller.getUser)
// if api is invalid OR wrong URL
router.all("/**", function (req, res) {
    res.status(404).send({
        status: false,
        msg: "The api you request is not available"
    })
})
module.exports = router;