const express = require("express")
const postController = require("../../controller/postController");
const Router = express.Router()

Router.post("/", new postController().Service_Post);

module.exports = Router