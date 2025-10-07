class OTPModel{

    async OTP_service_publ(req, res){
        const sv = req.body.serv;
        if(sv){
            switch (sv) {

                case "SvNew":
                    break;

                default:
                    res.json({
                        "status" : 2004
                    })
                    break;
            }
        }
    }

}

module.exports = OTPModel;