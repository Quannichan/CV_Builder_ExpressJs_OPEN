const auth = require("./routes/auth")
const public = require("./routes/public");
const info  = require("./routes/info");
const post  = require("./routes/post");
const admin = require("./routes/admin");
const mw = require("../middleware/middelware");
const vnpay = require("./routes/vnpay");
const AI = require("./routes/AI")
const ROOT_URL = "/api/be"

function route(app){

    //public
    app.use(mw.checkRole([]));

    app.use(ROOT_URL + "/", public);

    app.use(ROOT_URL + "/account", auth);

    //all role login already
    app.use(mw.checkRole(["SUPADM", "STAFF", "NORM", "SUPNORM"]));

    app.use(ROOT_URL + "/AI", AI);

    app.use(ROOT_URL + "/vnpay", vnpay);

    app.use(ROOT_URL + "/accSetting", info);

    app.use(ROOT_URL + "/postSetting", post);

    //admin
    app.use(mw.checkRole(["SUPADM"]));
    
    app.use(ROOT_URL + "/admin", admin);
}

module.exports.Route = route
