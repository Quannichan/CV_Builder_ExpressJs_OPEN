const Route = require("express").Router();
const VnpayController = require("../../controller/vnpayController");

Route.post("/", new VnpayController().Service);

module.exports = Route