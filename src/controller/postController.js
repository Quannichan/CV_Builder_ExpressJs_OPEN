const postModel = require("../models/postModel");

class postController{
    async Service_Post(req, res){
        try{
            await new postModel().doService(req, res);
        }catch(err){
            console.log(err)
            res.json({
                "status" : 2002,
            })
        }
    }

    async ADM_Service_Post(req, res){
        try{
            await new postModel().doServiceADM(req, res);
        }catch(err){
            console.log(err)
            res.json({
                "status" : 2002,
            })
        }
        
    }

    async Service_public(req, res){
        try{
            await new postModel().doServicePublic(req, res);
        }catch(err){
            console.log(err)
            res.json({
                "status" : 2002,
            })
        }
    }

    
}

module.exports = postController