const { PostPageDTO } = require("../DTO/post/PostPageDTO");
const { prisma } = require("../config/connectSql");
const { PostGetDTO } = require("../DTO/post/PostGetDTO");
const { PostNewDTO } = require("../DTO/post/PostNewDTO");
const { writeFile } = require("../tools/commonTools");
const { PostModDTO } = require("../DTO/post/PostModDTO");
const { PostDelDTO } = require("../DTO/post/PostDelDTO");

class postModel{

    async saveFile(name, d, savePath){
        return new Promise(async (resolve, reject)=>{
            const matches = d.match(/^data:(image\/\w+);base64,(.+)$/);
            const ext = matches[1].split('/')[1];
            const data = matches[2];
            const name_file = `${name}-image.${ext}`;
            await writeFile(name_file, data, savePath)
            .then(()=>{
                resolve(`${name_file}`);
            })
            .catch((err)=>{
                console.log(err);
                reject(null);
            })
        })
    }

    async doServicePublic(req, res){
        const sv = req.body.serv;
        if(sv){
            switch (sv) {
                case "SvGet":
                    this.get(req, res);
                    break;
                    
                default:
                    res.json({
                        "status" : 2004,
                    })
                    break;
            }
        }else{
            res.json({
                "status" : 2004,
            })
        }
    }

    async getPage(req, res){
        const postPageData = PostPageDTO(req);
        postPageData.skip = (postPageData.page - 1) * postPageData.size;

        const condition = {};

        if(postPageData.iduser){
            condition.iduser = postPageData.iduser;
        }

        if(postPageData.typ02){
            postPageData.typ02 = postPageData.typ02.map(x => parseInt(x, 10));
            condition.typ02 = {
                in: postPageData.typ02
            }
        }
        if(postPageData.typ03){
            postPageData.typ03 = postPageData.typ03.map(x => parseInt(x, 10));
            condition.typ03 = {
                in : postPageData.typ03
            };
        }

        const postLstPage = await prisma.post.findMany({
                skip : postPageData.skip,
                take : postPageData.size,
                orderBy : {
                    id : "desc"
                },
                where : {
                    title : {
                        contains : postPageData.search
                    },
                    
                    ...condition
                },
                select : {
                    id : true,
                    imgs : true,
                    title : true,
                    price: true,
                    address : true,
                    cityData : true,
                    wardData : true,
                    subService: true,
                    user : {
                        select : {
                            address : true,
                            displayName : true,
                            ava : true,
                            followers : true,
                            id : true,
                            posts : true
                        }
                    }
                }
        });

        const total =  await prisma.post.count({
            orderBy : {
                id : "desc"
            },
            where : {
                title : {
                    contains : postPageData.search
                },
                ...condition
            }
        });

        const totalPages = Math.ceil(total / postPageData.size);

        res.json({
            status     : 2000,
            data       : postLstPage,
            total      : totalPages,
            next       : postPageData.page < totalPages ? true : false  
        });
    }

    async get(req, res){
        const posGetData = PostGetDTO(req);
        try{
            const postData = await prisma.post.findUnique({
                where : {id : posGetData.id},
                select: {
                    content: true,
                    id : true,
                    typ01 : true,
                    idSample : true,
                    lang: true,
                    stat01 : true,
                    stat02 : true,
                    iduser : true,
                    user: {
                        select : {
                            id: true,
                            name: true,
                            ava : true
                        }
                    }
                }
            });
            if(postData){ 
                if(req.u){
                    if(postData.iduser === req.u.BASEID){
                        return res.json({
                            "status" : 2000,
                            "data" : postData
                        });
                    }
                }
                if(postData.stat01 === 1){
                    return res.json({
                        "status" : 2000,
                        "msg"  : "Bạn chưa được cấp quyền để xem cv này!",
                    });
                }else if(postData.stat01 === 2){
                    return res.json({
                        "status" : 2000,
                        "data" : postData
                    });
                }else if(postData.stat01 === 3){
                    if(req.u.BASEID && req.u.BASEROLE){
                        if(req.u.BASEROLE === "SUPADM"){
                            return res.json({
                                "status" : 2000,
                                "data" : postData
                            });
                        }else{
                            const s = await prisma.sharedPosts.count({
                                where : {
                                    userId  : req.u.BASEID * 1,
                                    postId  : posGetData.id, 
                                }
                            })
                            if(s !== 0){
                                return res.json({
                                    "status" : 2000,
                                    "data" : postData
                                });
                            }else{
                                return res.json({
                                    "status" : 2000,
                                    "msg"  : "Bạn chưa được cấp quyền để xem cv này!",
                                });
                            }
                        }
                    }
                }else{
                    res.json({
                        "status" : 2001,
                    });
                }
            }else{
                res.json({
                    "status" : 2004,
                });
            }
        }catch(err){
            console.error(err);
            res.json({
                "status": 2001
            });
        }
    }

    async doService(req, res){
        const sv = req.body.serv;
        console.log("BASEROLE: " + req.u.BASEROLE);
        if(sv){
            switch (sv) {
                case "SvGetAuth":
                    await this.getAuth(req, res);
                    break;

                case "SvDel":
                    await this.del(req, res);
                    break;

                case "SvMod":
                    await this.mod(req, res);
                    break;
            
                case "SvNew":
                    await this.new(req, res);
                    break;

                default:
                    res.json({
                        "status" : 2004,
                    })
                    break;
            }
        }else{
            res.json({
                "status" : 2004,
            })
        }
    }

    async del(req,res){
        const delPostData = await PostDelDTO(req);
        if(delPostData === null){
            return res.json({
                "status" : 2001
            });
        }
        if(!delPostData.iduser){
            return res.json({
                "status" : 2001
            });
        }

        if(!delPostData.id){
            return res.json({
                "status" : 2001
            });
        }

        if(delPostData.iduser !== req.u.BASEID){
            return res.json({
                "status" : 2001
            });
        }

        const dele = await prisma.post.delete({
            where : {
                ...delPostData
            }
        });

        if(dele){
            res.json({
                "status" : 2000
            });
        }else{
            res.json({
                "status" : 2001
            });
        }
        
    }

    async mod(req, res){
        const modPostData = await PostModDTO(req);
        if(modPostData === null){
            return res.json({
                "status" : 2001
            });
        }

        if(!modPostData.iduser){
            return res.json({
                "status" : 2001
            });
        }

        if(!modPostData.id){
            return res.json({
                "status" : 2001
            });
        }

        if(modPostData.iduser !== req.u.BASEID){
            return res.json({
                "status" : 2001
            });
        }

        var check = false;
        for(var k in modPostData){
            if(modPostData.hasOwnProperty(k)){
                if(modPostData[k] === null || modPostData[k] === "" || modPostData[k] === undefined){
                    check = true;
                    break;
                }
            }
        }

        if(check){
            return res.json({
                "status" : 2001
            });
        }

        if(Object.keys(modPostData).length === 0){
            return res.json({
                "status" : 2001
            });
        }


        const id = modPostData.id;
        const userId = modPostData.iduser;

        modPostData.img = await this.saveFile(
            `_${modPostData.iduser}_post_image_${id}_`,
            modPostData.img
        );

        delete modPostData.id;
        delete modPostData.iduser;

        const get = await prisma.post.findUnique({
            where: {
                id: id,
                iduser: userId
            }
        });

        if(!get.id || get.iduser !== req.u.BASEID){
            return res.json({"status" : 2004});
        }

        const shared = modPostData.shared;
        delete modPostData.shared;

        const modPost = await prisma.post.update({
            where:{
                id : id,
                iduser : req.u.BASEID
            },
            data:{
                ...modPostData
            }
        });

        await prisma.sharedPosts.deleteMany({
            where : {
                postId: id
            }
        })

        const shared_connect = [];

        for(var i of shared){
            shared_connect.push({
                userId : i.id * 1,
                postId : modPost.id * 1
            })
        }

        await prisma.sharedPosts.createMany({
            data: shared_connect
        })

        if(modPost){
            res.json({
                "status" : 2000
            });
        }else{
            return res.json({
                "status" : 2001
            });
        }
    }

    async getAuth(req, res){
        if(req.u.BASEID !== req.body.iduser*1){
            return res.json({
                status: 2001
            });
        }

        const iduser = req.body.iduser ? req.body.iduser * 1 : null;
        const id = req.body.id ? req.body.id * 1 : 0;
        if(id && iduser && iduser !== req.u.BASEID){
            return res.json({
                "status" : 2001
            });
        }

        const post = await prisma.post.findUnique({
            where : {
                iduser : iduser,
                id : id
            },
            include:{
                SharedPosts: {
                    select:{
                        user: {
                            select:{
                                name: true,
                                id: true,
                                ava : true,
                                mail: true
                            }
                        }
                    }
                }
            }
        });
        
        if(post.iduser === req.u.BASEID){
            res.json({
                "status" : 2000,
                "data" : post
            });
        }else{
            return res.json({
                "status" : 2001
            });
        }
    }

    async new(req, res){
        const newPostData = await PostNewDTO(req);
        if(!newPostData){
            return res.json({
                "status" : 2001
            });
        }
        if(!newPostData.iduser){
            return res.json({
                "status" : 2001
            });
        }

        if(newPostData.iduser !== req.u.BASEID){
            return res.json({
                "status" : 2001
            });
        }

        var check = false;
        for(var k in newPostData){
            if(newPostData.hasOwnProperty(k)){
                if(newPostData[k] === null || newPostData[k] === "" || newPostData[k] === undefined){
                    check = true;
                    break;
                }
            }
        }

        if(check){
            return res.json({
                "status" : 2001
            });
        }

        if(Object.keys(newPostData).length === 0){
            return res.json({
                "status" : 2001
            });
        }

        const shared = newPostData.shared;
        delete newPostData.shared;
        
        var img = newPostData.img;
        delete newPostData.img;

        const newPost = await prisma.post.create({
            data:{
                ...newPostData,
            },
        });

        img = await this.saveFile(
            `_${newPostData.iduser}_post_image_${newPost.id}_`, 
            img
        );

        await prisma.post.update({
            where:{
                id : newPost.id
            },
            data:{
                img: img
            },
        });

        const shared_connect = [];

        for(var i of shared){
            shared_connect.push({
                userId : i.id * 1,
                postId : newPost.id * 1
            })
        }

        await prisma.sharedPosts.createMany({
            data: shared_connect
        })

        if(newPost){
            res.json({
                "status" : 2000
            });
        }else{
            return res.json({
                "status" : 2001
            });
        }

    }

    async doServiceADM(req, res){
        const sv = req.body.serv;
        if(sv){
            switch (sv) {
                //start sv post for admin
                case "SvGetCount":
                    break;

                case "SvGet":
                    break;

                case "SvPage": 
                   break;

                case "SvGetLst":
                    break;

                case "SvMod":
                    break;

                case "SvDel":
                    break;
                //end sv post
                default:
                    res.json({
                        "status" : 2004,
                    })
                    break;
            }
        }else{
            res.json({
                "status" : 2004,
            })
        }
    }

   
}

module.exports = postModel