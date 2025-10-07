const express = require("express")
const infoController = require("../../controller/infoController")
const postController = require("../../controller/postController");
const postSampleController = require("../../controller/postSampleController");

const Router = express.Router()

Router.post("/user", new infoController().ADM_Service_User);

Router.post("/post", new postController().ADM_Service_Post);

Router.post("/postsample", new postSampleController().Service_admin);

module.exports = Router