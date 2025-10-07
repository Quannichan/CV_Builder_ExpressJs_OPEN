const { prisma } = require("../../config/connectSql");

async function PostDelDTO(req){
    if(req.body.id){
        const post = await prisma.post.findUnique({
            where : {
                id: req.body.id ? req.body.id * 1 : 0
            }
        })
        if(post.iduser === req.u.BASEID){
            return{
                id          : req.body.id ? req.body.id * 1 : 0,
                iduser      : req.body.iduser ? req.body.iduser * 1 : 0
            }
        }
        return null;
    }
    return null;
}

module.exports = {PostDelDTO}