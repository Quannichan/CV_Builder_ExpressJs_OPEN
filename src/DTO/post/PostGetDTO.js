function PostGetDTO(req){
    return{
        id : req.body.id ? req.body.id * 1 : 0 
    };
};

module.exports = {PostGetDTO};