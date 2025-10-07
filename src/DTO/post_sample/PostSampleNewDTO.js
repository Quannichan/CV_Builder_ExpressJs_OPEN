function PostSampleNewDTO(req){
    return {
        name : req.body.name ? req.body.name : null,
        descript : req.body.descript ? req.body.descript : null,
        typ01 : req.body.typ01 ? req.body.typ01 : null,
        typ02 : req.body.typ02 ? req.body.typ02 : null,
        typ03 : req.body.typ03 ? req.body.typ03 : null,
        img : req.body.img ? req.body.img : null,
    }
}

module.exports = {PostSampleNewDTO};