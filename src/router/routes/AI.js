const express = require("express")
const OpenAIController = require("../../controller/openAIController")
const Router = express.Router()

Router.post("/", new OpenAIController().Service);

module.exports = Router