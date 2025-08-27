const express = require("express"); 
const route = express();
const returnAndExchange =require("../controller/returnAndExchange")
const auth = require("../auth/index")

const { authenticateToken, userAuthorisation } = auth

route.post("/" ,returnAndExchange.create )
route.get("/" ,returnAndExchange.get )
// route.delete("/" ,returnAndExchange.delete )


module.exports = route