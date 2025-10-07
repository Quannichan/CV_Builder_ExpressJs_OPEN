function ModDTO(req){
    return{
        id              : req.body.id ? req.body.id * 1 : 0,
        name            : req.body.name ? req.body.name : null,
        job             : req.body.job  ? req.body.job : null,
        sex             : req.body.sex ? req.body.sex * 1 : 0,
        address         : req.body.address ? req.body.address : null,
        descript        : req.body.descript ? req.body.descript : null,
        birthdate       : req.body.birthdate ? req.body.birthdate : null,

        portfolio       : req.body.portfolio ? req.body.portfolio : null,
        twitter         : req.body.twitter ? req.body.twitter : null,
        reddit          : req.body.reddit ? req.body.reddit : null,
        github          : req.body.github ? req.body.github : null,
        facebook        : req.body.facebook ? req.body.facebook : null,
        linked          : req.body.linked ? req.body.linked : null,
    };
}

module.exports = {ModDTO};