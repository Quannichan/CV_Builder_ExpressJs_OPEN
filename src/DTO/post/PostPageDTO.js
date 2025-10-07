function PostPageDTO(req){
    return{
        page : req.body.page ? req.body.page * 1 : 1,
        iduser : req.body.iduser ? req.body.iduser * 1 : 0,
        size : req.body.size ? req.body.size * 1 : 8,
        search : req.body.search || "",
        city    : req.body.city ? req.body.city : null,
        ward    : req.body.ward ? req.body.ward : null, 
        typ01   : req.body.typ01 ? req.body.typ01 * 1 : 0, // service type
        subServiceId : req.body.subServiceId ? req.body.subServiceId * 1 : 0,
        typ02   : req.body.typ02 ? req.body.typ02 : null, // support type
        typ03   : req.body.typ03 ? req.body.typ03 : null, // support time
        priceMin    : req.body.priceMin ? req.body.priceMin * 1 : null,
        priceMax    : req.body.priceMax ? req.body.priceMax * 1 : null,
    };
};

module.exports = {PostPageDTO};