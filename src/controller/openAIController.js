const OpenAIModel = require("../models/openAIModel");

class OpenAIController{

    async Service(req, res){
        try{
            await new OpenAIModel().Service(req, res);
        }catch(err){
            console.log(err);
            res.json({
                status: 2005
            });
        }
    }

}

module.exports = OpenAIController;