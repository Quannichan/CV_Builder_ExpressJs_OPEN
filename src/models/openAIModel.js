const { prisma } = require("../config/connectSql");
const { CallOpenAI } = require("../openAI/openAI");

class OpenAIModel{

    async Service(req, res){
        try{
            if(req.body.serv){
                switch(req.body.serv){
                    
                    case "SvGenBase":
                        await this.GenBase(req, res);
                        break;

                    case "SvGen":
                        await this.Gen(req, res);
                        break;

                    case "SvFix":
                        await this.Fix(req, res);
                        break;

                    default:
                        return res.json({
                            status: 2004
                        })
                }
            }else{
                res.json({
                    status: 2004
                })
            }
        }catch(e){
            res.json({
                status: 2005
            })
            console.log(e);
        }
    }

     async GenBase(req, res){
        if(!req.body.job || req.body.job === ""){
            res.json({
                status: 2001
            });
        }

        if(!req.body.content || req.body.content === ""){
            res.json({
                status: 2001
            });
        }

        const user = await prisma.user.findUnique({
            where: {
                id: req.u.BASEID * 1,
            },
        })

        if(user && user.id){
            if(user.accountType !== 2){
                return res.json({
                    status: 2004
                })
            }
            const msg = `Vị trí tôi muốn ứng tuyển: "${req.body.job}", còn đây là format cả json cv: ${req.body.content}. Hãy tạo cho tôi nội dung cv cho các mục cha: descript, experience, education, skill, activity, certificate, project, hobby, language, mỗi mục sẽ có format như nhau: {title: "" , descript: "" ,from : YYYY-MM-DD ,to: YYYY-MM-DD},  descript mục cha chỉ cần là chuỗi thường. Tạo cho tôi sao cho lịch sự, diễn tả đủ ý mà súc tích, gọn gàng để gây ấn tượng với nhà tuyển dụng. Trả lời đầy đủ bằng chuỗi chứa đầy đủ thông tin trên cv  của tôi và giữ đúng format cv tôi gửi. Không trả lời gì thêm ngoài json cv`
            const fix = await CallOpenAI(msg);
            res.json({
                status: 2000,
                data: JSON.parse(fix)
            });
        }else{
            res.json({
                status: 2003
            })
        }
    }

    async Gen(req, res){

        if(!req.body.descript || req.body.descript === ""){
            res.json({
                status: 2001
            });
        }

        if(!req.body.content || req.body.content === ""){
            res.json({
                status: 2001
            });
        }

        const user = await prisma.user.findUnique({
            where: {
                id: req.u.BASEID * 1,
            },
        })

        if(user && user.id){
            if(user.accountType < 1){
                return res.json({
                    status: 2004
                })
            }
            const msg = `Mô tả nội dung cv của tôi như sau : "${req.body.descript}, còn đây là format cả json cv: ${req.body.content}". Hãy tạo cho tôi nội dung cv cho các mục cha: descript, experience, education, skill, activity, certificate, project, hobby, language, mỗi mục sẽ có format như nhau: {title: "" , descript: "" ,from : YYYY-MM-DD ,to: YYYY-MM-DD},  descript mục cha chỉ cần là chuỗi thường. Tạo cho tôi sao cho lịch sự, diễn tả đủ ý mà súc tích, gọn gàng để gây ấn tượng với nhà tuyển dụng.  Trả lời đầy đủ bằng chuỗi chứa đầy đủ thông tin trên cv  của tôi và giữ đúng format cv tôi gửi. Không trả lời gì thêm ngoài json cv`
            const fix = await CallOpenAI(msg);
            res.json({
                status: 2000,
                data: JSON.parse(fix)
            });
        }else{
            res.json({
                status: 2003
            })
        }
    }

    async Fix(req, res){
        if(!req.body.content){
            res.json({
                status: 2001
            });
        }

        const user = await prisma.user.findUnique({
            where: {
                id: req.u.BASEID*1
            }
        });

        if(user && user.id){
            if(user.accountType !== 2){
                return res.json({
                    status: 2004
                })
            }
            const msg = `Nội dung của cv tôi như sau json: ${JSON.stringify(req.body.content)} . Hãy chỉnh sửa nội dung (Không thêm mới ngoài các nội dung đã được ghi trong cv, chỉ chỉnh sửa lại cho lịch sự và chuẩn mực) của các mục cha: descript, experience, education, skill, activity, certificate, project, hobby, language, mỗi mục sẽ có format như nhau: {title: "" , descript: "" ,from : YYYY-MM-DD ,to: YYYY-MM-DD}, descript mục cha là chuỗi bình thường, sửa sao cho lịch sự, diễn tả đủ ý mà súc tích, gọn gàng để gây ấn tượng với nhà tuyển dụng.  Trả lời đầy đủ bằng chuỗi chứa đầy đủ thông tin trên cv  của tôi và giữ đúng format cv tôi gửi. Không trả lời gì thêm ngoài json cv`
            const fix = await CallOpenAI(msg);
            try{
                res.json({
                    status: 2000,
                    data: JSON.parse(fix)
                });
            }catch(err){
                console.log(err);
                res.json({
                    status: 2005
                })
            }
        }else{
            res.json({
                status: 2001
            })
        }
    }
    
}

module.exports = OpenAIModel;