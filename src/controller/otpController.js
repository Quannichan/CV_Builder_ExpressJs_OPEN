const OTPModel = require("../models/otpModel");

class OTPController{

    async Service_Publ(req, res){
        try{
            await new OTPModel().OTP_service_publ(req, res);
        }catch(err){
            console.log(err)
            res.json({
                "status" : 2005,
            })
        }
    }
    
}

module.exports = OTPController;