
async function PostNewDTO(req){
    if(req.body.iduser){
        return{
            shared      : req.body.shared ? req.body.shared : [],
            stat01      : req.body.stat01 ? req.body.stat01 * 1 : 1,
            stat02      : req.body.stat02 ? req.body.stat02 * 1 : 1,
            typ01       : req.body.typ01 ? req.body.typ01 : "",
            img         : req.body.img ? req.body.img : null,
            iduser      : req.body.iduser ? req.body.iduser * 1 : 0,
            content     : req.body.content ? req.body.content : "",
            idSample    : req.body.type ? req.body.type * 1 : null,
            lang        : req.body.lang ? req.body.lang : "vi"
        }
    }
    return null;
}

module.exports = {PostNewDTO}