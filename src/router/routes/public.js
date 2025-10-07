const express = require("express");
const image = require("./image")
const Router = express.Router()
const postController = require("../../controller/postController");
const infoController = require("../../controller/infoController");
const OTPController = require("../../controller/otpController");
const VnpayController = require("../../controller/vnpayController");
const postSampleController = require("../../controller/postSampleController");

Router.use("/images", image)

Router.post("/otp", new OTPController().Service_Publ);

Router.post("/postPubl", new postController().Service_public);

Router.post("/postSamplePubl", new postSampleController().Service_public);

Router.post("/userPubl", new infoController().Service_User_Publ);

Router.get("/vnpay/ipn_return", new VnpayController().IPN_CALLBACK);

module.exports = Router