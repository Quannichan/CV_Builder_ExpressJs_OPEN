function RegisterDTO(req) {
  return {
    name        : req.body.name,
    phone       : req.body.phone,
    mail        : req.body.mail,
    code        : req.body.code,
    certimg     : req.body.certimg,
    isBusiness  : req.body.isBusiness || 0,
    pass        : req.body.pass,
  };
}

module.exports = {RegisterDTO}