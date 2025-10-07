const VnpayModel = require("../models/vnpayModel");

class VnpayController{

    async Service(req, res){
        try{
            await new VnpayModel().Service(req, res);
        }catch(err){
            console.log(err)
            res.json({
                "status" : 2005,
            })
        }
    }

    async RESULT(req, res){
        try{
            await new VnpayModel().Service(req, res);
        }catch(err){
            console.log(err)
            res.json({
                "status" : 2005,
            })
        }
    }

    async IPN_CALLBACK(req, res){
        try{
            await new VnpayModel().IPN(req, res);
        }catch(err){
            console.log(err)
            res.json({
                "status" : 2005,
            })
        }
    }

}

module.exports = VnpayController;