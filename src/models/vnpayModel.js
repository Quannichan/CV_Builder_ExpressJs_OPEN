const moment = require('moment');
const { prisma } = require('../config/connectSql');

class VnpayModel{
    async Service(req, res){
        const sv = req.body.serv;
        try{
            if(sv){
                switch(sv){
                    case "SvNew":
                        await this.new(req, res);
                        break;

                    case "SvGet":
                        await this.get(req, res);
                        break;

                    case "SvGetPending":
                        await this.getPending(req, res);
                        break;

                    case "SvDel":
                        await this.cancel(req, res);
                        break;

                    default:
                        req.json({
                            status: 2004
                        })
                        break;
                }
            }else{
                req.json({
                    status: 2003
                })
            }
        }catch(err){
            console.log(err);
            res.json({
                status: 2005
            })
        }
    }

    async getPending(req, res){
        if(!req.body.iduser){
            res.json({
                status: 2001
            });
        }

        const idu = req.body.iduser*1;

        const payment = await prisma.payment.findFirst({
            where: { iduser: idu, status : 0 }
        });

        delete payment.data01;
        res.json({
            status: 2000,
            data: payment
        });
    }

    /**
     * @description Lấy đơn hàng theo id người dùng và mã đơn hàng
     * @param {*} req 
     * @param {*} res 
     */
    async get(req, res){

        if(!req.body.iduser || !req.body.orderId){
            res.json({
                status: 2001
            });
        }

        const idu = req.body.iduser*1;
        const orderId = req.body.orderId*1;

        const payment = await prisma.payment.findUnique({
            where: { id: orderId , iduser: idu }
        });

        if(payment.status===0){
            let querystring = require('qs');
            let vnpUrl      = process.env.VNPAY_URL;
            vnpUrl          += '?' + querystring.stringify(JSON.parse(payment.data01), { encode: false });
            
            return res.json({
                status: 2000,
                type: "redirect",
                data: {
                    status: payment.status,
                    url: vnpUrl
                }
            });
        }

        delete payment.data01;

        if(payment){
            res.json({
                status: 2000,
                data: payment
            });
        }else{
            res.json({
                status: 2002
            });
        }
    }

    async cancel(req, res){
        if(!req.body.iduser){
            res.json({
                status: 2001
            });
        }

        const idu = req.body.iduser*1;

        const u = await prisma.user.update({
            where: { id: idu },
            data: { accountType: 0 }
        })

        await prisma.post.updateMany({
            where:{
                iduser : idu * 1
            },
            data:{
                stat01 : 1,
                stat02: 1,
                typ01: "",
                lang: "vi"
            }
        })

        if(u){
            res.json({
                status: 2000,
            });
        }else{
            res.json({
                status: 2002
            });
        }
    }

    /**
     * @description Tạo mới đơn hàng và chuyển hướng sang cổng thanh toán VNPAY
     * @param {*} req 
     * @param {*} res 
     */
    async new(req, res){    
        const type = req.body.type;
        if(type === null || type === undefined || type === ''){
            res.json({
                status: 2001
            });
        }

        if(type*1 !== 0 && type*1 !== 1 && type*1 !== 2){
            res.json({
                status: 2001
            });
        }
        
        let date = new Date();
        let createDate = moment(date).format('YYYYMMDDHHmmss');
        
        let ipAddr = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;
        
        let tmnCode     = process.env.TMN_CODE;
        let secretKey   = process.env.HASH_SECRET;
        let vnpUrl      = process.env.VNPAY_URL;
        let returnUrl   = process.env.RETURN_URL;
        let orderId     = moment(date).format('DDHHmmss');
        
        let locale = "vi";
        if(locale === null || locale === ''){
            locale = 'vn';
        }
        let currCode = 'VND';
        let vnp_Params = {};
        vnp_Params['vnp_Version'] = '2.1.0';
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_TmnCode'] = tmnCode;
        vnp_Params['vnp_Locale'] = locale;
        vnp_Params['vnp_CurrCode'] = currCode;
        vnp_Params['vnp_TxnRef'] = orderId;
        vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId;
        vnp_Params['vnp_OrderType'] = 'other';
        vnp_Params['vnp_Amount'] = type*1 === 1 ? 99000 * 100 : 199000 * 100;
        vnp_Params['vnp_ReturnUrl'] = returnUrl;
        vnp_Params['vnp_IpAddr'] = ipAddr;
        vnp_Params['vnp_CreateDate'] = createDate;
        vnp_Params = this.sortObject(vnp_Params);

        let querystring = require('qs');
        let signData = querystring.stringify(vnp_Params, { encode: false });
        let crypto = require("crypto");     
        let hmac = crypto.createHmac("sha512", secretKey);
        let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex"); 
        vnp_Params['vnp_SecureHash'] = signed;
        vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

        try{
            await prisma.payment.updateMany({
                where: {
                    iduser : req.u.BASEID,
                    status : 0
                },
                data : {
                    status : 2
                }
            });

            await prisma.payment.create({
                data:{
                    id : parseInt(orderId),
                    iduser : req.u.BASEID,
                    type   : type*1,
                    amount : type*1 === 1 ? 99000 : 199000,
                    data01 : JSON.stringify(vnp_Params),
                    date01: new Date(),
                    status : 0
                }
            })
            res.json({
                status: 2000,
                data: vnpUrl
            });
        }catch(err){
            res.json({
                status: 2005
            });
            console.log(err)
        }
    }

    async IPN(req, res){
        let vnp_Params = { ...req.query };
        let secureHash = vnp_Params['vnp_SecureHash'];
        
        let orderId = vnp_Params['vnp_TxnRef'];

        const payment = await prisma.payment.findUnique({
            where: { id: parseInt(orderId) }
        });

        if(!payment || payment == null || payment == undefined){
            return res.redirect(process.env.FRONTEND_URL);
        }

        let rspCode = vnp_Params['vnp_ResponseCode'];

        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];

        vnp_Params = this.sortObject(vnp_Params);
        let secretKey = process.env.HASH_SECRET;
        let querystring = require('qs');
        let signData = querystring.stringify(vnp_Params, { encode: false });
        let crypto = require("crypto");     
        let hmac = crypto.createHmac("sha512", secretKey);
        let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");     
        
        let paymentStatus = `${payment.status}`;

        let checkOrderId = true; // Mã đơn hàng "giá trị của vnp_TxnRef" VNPAY phản hồi tồn tại trong CSDL của bạn
        let checkAmount = true; // Kiểm tra số tiền "giá trị của vnp_Amout/100" trùng khớp với số tiền của đơn hàng trong CSDL của bạn
        if(payment.id != parseInt(orderId)){
            checkOrderId = false;
        }

        if(payment.amount != vnp_Params['vnp_Amount']/100){
            checkAmount = false;
        }

        if(secureHash === signed){ 
            if(checkOrderId){
                if(checkAmount){
                    if(paymentStatus=="0"){ 
                        if(rspCode=="00"){
                            await prisma.payment.update({
                                where: { id: parseInt(orderId) },
                                data: { status: 1, date02: new Date() }
                            });
                            await prisma.user.update({
                                where: { id: payment.iduser*1 },
                                data: { accountType: payment.type }
                            });
                            //update post stat01, stat02 typ01
                            if(payment.type !== 2){
                                await prisma.post.updateMany({
                                    where:{
                                        iduser : payment.iduser*1
                                    },
                                    data:{
                                        stat01 : 1,
                                        stat02: 1,
                                        typ01: "",
                                        lang: "vi"
                                    }
                                })
                            }
                            res.redirect(`${process.env.FRONTEND_URL}/payment?id=${orderId}`);
                        }else {
                            await prisma.payment.update({
                                where: { id: parseInt(orderId) },
                                data: { status: 2, date02: new Date() }
                            });
                            res.redirect(`${process.env.FRONTEND_URL}/payment?id=${orderId}`);
                        }
                    }else{
                        let querystring = require('qs');
                        let vnpUrl      = process.env.VNPAY_URL;
                        vnpUrl          += '?' + querystring.stringify(JSON.parse(payment.data01), { encode: false });
                        res.redirect(vnpUrl);
                    }
                }else{
                    res.redirect(`${process.env.FRONTEND_URL}`);
                }
            }else {
                res.redirect(`${process.env.FRONTEND_URL}`);
            }
        }else {
            res.redirect(`${process.env.FRONTEND_URL}`);
        }
    }

    sortObject(obj) {
        let sorted = {};
        let str = [];
        let key;
        for (key in obj){
            if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
            }
        }
        str.sort();
        for (key = 0; key < str.length; key++) {
            sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
        }
        return sorted;
    }

}

module.exports = VnpayModel;