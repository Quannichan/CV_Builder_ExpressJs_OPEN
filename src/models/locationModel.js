const { LocationDTO } = require("../DTO/location/LocationDTO");
const { prisma } = require("../config/connectSql");
class locationModel{
    
    async do_Service(req, res){
        const sv = req.body.serv;
        try{
            if(sv){
                switch (sv) {
                    // case "SvGet":
                    //     break;

                    case "SvGetLst":
                        await this.GetLst(req, res);
                        break;
                
                    default:
                        res.json({
                            "status" : 2004,
                        })
                        break;
                }
            }else{
                res.json({
                    "status" : 2001,
                })
            }
        }catch(err){
            console.log(err);
            res.json({
                "status" : 2005,
            })
        }
    }

    async GetLst(req, res){
        const LocationData = LocationDTO(req);
        if(LocationData.type === 1){
            const location = await prisma.city.findMany({});
            if(location){
                res.json({
                    status : 2000,
                    data : location
                })
            }else{
                res.json({
                    status : 2001
                })
            }
        }else if(LocationData.type === 2){
            if(!LocationData.id){
                return res.json({
                    "status" : 2001,
                })
            }
            const location = await prisma.ward.findMany({
                where : {
                    cityId : LocationData.id
                }
            });

            if(location){
                res.json({
                    status : 2000,
                    data : location
                })
            }else{
                res.json({
                    status : 2001
                })
            }
        }
    }

}

module.exports = locationModel;