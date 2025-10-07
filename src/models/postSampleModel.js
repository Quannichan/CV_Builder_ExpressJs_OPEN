const { prisma } = require("../config/connectSql");
const { PostSampleNewDTO } = require("../DTO/post_sample/PostSampleNewDTO");
const { PostSamplePageDTO } = require("../DTO/post_sample/PostSamplePageDTO");
const { PostSampleUpdateDTO } = require("../DTO/post_sample/PostSampleUpdateDTO");
const { writeFile } = require("../tools/commonTools");

class postSampleModel{
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
                case "SvPage":
                    this.getPage(req, res);
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
        const postSamplePageData = PostSamplePageDTO(req);
        postSamplePageData.skip = (postSamplePageData.page - 1) * postSamplePageData.size;

        const condition = {};

        if(postSamplePageData.typ01){
            condition.typ01 = {
                array_contains: postSamplePageData.typ01
            }
        }

        if(postSamplePageData.typ02){
            condition.typ02 = {
                array_contains: postSamplePageData.typ02
            }
        }
        if(postSamplePageData.typ03){
            condition.typ03 = {
                array_contains: postSamplePageData.typ03
            }
        }

        const postLstPage = await prisma.postSample.findMany({
                skip : postSamplePageData.skip, 
                take : postSamplePageData.size,
                orderBy : {
                    id : "asc"
                },
                where : {
                    ...condition,
                },
                select:{
                    id: true,
                    name: true,
                    descript: true,
                    img: true
                }
        });

        const total =  await prisma.postSample.count({
            orderBy : {
                id : "asc"
            },
            where : {
                ...condition
            }
        });

        const totalPages = Math.ceil(total / postSamplePageData.size);

        res.json({
            status     : 2000,
            data       : postLstPage,
            total      : totalPages,
            next       : postSamplePageData.page < totalPages ? true : false  
        });
    
    }

    async doServiceAdmin(req, res){
        const sv = req.body.serv;
        if(sv){
            switch (sv) {
                case "SvGet":
                    this.get(req, res);
                    break;

                case "SvNew":
                    this.new(req, res);
                    break;

                case "SvMod":
                    this.mod(req, res);
                    break;

                case "SvDel":
                    this.del(req, res);
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

    async get(req, res){
        if(!req.body.id){
            return res.json({
                "status" : 2001,
            })
        }

        if(isNaN(req.body.id)){
            return res.json({
                "status" : 2001,
            })
        }

        const postSample = await prisma.postSample.findUnique({
            where: {
                id : req.body.id * 1
            }
        });

        if(postSample.id){
            res.json({
                status : 2000,
                data: postSample
            })
        }else{
            res.json({
                "status" : 2002,
            })
        }
    }

    async new(req, res){
        const postSampleNewData = PostSampleNewDTO(req);
        
        var check = false;
        for(var k in postSampleNewData){
            if(postSampleNewData.hasOwnProperty(k)){
                if(postSampleNewData[k] === null || postSampleNewData[k] === "" || postSampleNewData[k] === undefined || postSampleNewData[k].length === 0){
                    check = true;
                    break;
                }
            }
        }

        if(check){
            return res.json({
                status : 2001,
                msg : "Bạn chưa nhập đầy đủ thông tin!"
            });
        }

        postSampleNewData.typ01 = postSampleNewData.typ01.map((t)=>t*1);
        postSampleNewData.typ02 = postSampleNewData.typ02.map((t)=>t*1);
        postSampleNewData.typ03 = postSampleNewData.typ03.map((t)=>t*1);

        var img = postSampleNewData.img;
        delete postSampleNewData.img;
        
        const newPostSample = await prisma.postSample.create({
            data: {
                ...postSampleNewData
            }
        });

        if(newPostSample.id){  
            img = await this.saveFile(
                `_postSample_image_${newPostSample.id}_`,
                img.data
            );
            const saveImg = await prisma.postSample.update({
                where: {
                    id : newPostSample.id
                },
                data: {
                    img : img
                }
            });
            if(saveImg.id){
                res.json({
                    status : 2000
                });
            }
        }else{
            res.json({
                status : 2002
            });
        }
    }

    async mod(req, res){
        const postSampleModData = PostSampleUpdateDTO(req);

        if(!postSampleModData.id){
            return res.json({
                status : 2001,
            });
        }

        var check = false;
        for(var k in postSampleModData){
            if(postSampleModData.hasOwnProperty(k)){
                if(postSampleModData[k] === null || postSampleModData[k] === "" || postSampleModData[k] === undefined || postSampleModData[k].length === 0){
                    check = true;
                    break;
                }
            }
        }

        if(check){
            return res.json({
                status : 2001,
                msg : "Bạn chưa nhập đầy đủ thông tin!"
            });
        }

        postSampleModData.typ01 = postSampleModData.typ01.map((t)=>t*1);
        postSampleModData.typ02 = postSampleModData.typ02.map((t)=>t*1);
        postSampleModData.typ03 = postSampleModData.typ03.map((t)=>t*1);

        const id = postSampleModData.id
        delete postSampleModData.id

        if(postSampleModData.img.new){
            postSampleModData.img = await this.saveFile(
                `_postSample_image_${id}_`,
                postSampleModData.img.data
            );
        }else{
            delete postSampleModData.img;
        }
        
        const modPostSample = await prisma.postSample.update({
            where : {
                id : id
            },
            data: {
                ...postSampleModData
            }
        });

        if(modPostSample.id){  
            res.json({
                status : 2000
            });
        }else{
            res.json({
                status : 2002
            });
        }
    }

    async del(req, res){
        if(!req.body.id){
            return res.json({
                status : 2001,
            });
        }

        if(req.u.BASEROLE !== "SUPADM"){
            return res.json({
                status : 2004,
            });
        }

        await prisma.postSample.delete({
            where : {
                id : req.body.id * 1
            }
        });

        res.json({
            status : 2000
        });
        
    }
}

module.exports = postSampleModel;