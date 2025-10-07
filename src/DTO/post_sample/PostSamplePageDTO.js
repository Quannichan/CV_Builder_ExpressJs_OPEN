function PostSamplePageDTO(req){
    return{
        page : req.body.page ? req.body.page * 1 : 1,
        size : req.body.size ? req.body.size * 1 : 8,
        typ01: req.body.typ01? req.body.typ01*1 : null,
        typ02: req.body.typ02? req.body.typ02*1 : null,
        typ03: req.body.typ03? req.body.typ03*1 : null,
    };
};

module.exports = {PostSamplePageDTO};