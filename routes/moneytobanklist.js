var express = require('express');
var router = express.Router();
const sql = require('../mysql');

router.post('/', function (req, res, next) {
    console.log(req.session)
    if(req.session===undefined||req.session.user===undefined){
        return res.json({tag:-10})
    }
    console.log(req.session)
    var accountId=req.session.user.accountId;
    var connection = sql.getConn();
    var func = "getUserInfo('" + accountId + "')";
    var queryInfo=`select * from transactionofbank where AccountId=${accountId}`;
    connection.query(queryInfo, function (err, rows, fields) {
        if (err) {
            console.log('error')
            console.log('[query] - :' + err);
            sql.endConn(connection);
            return res.json({tag:-1})
        }
        console.log(rows)
        res.json({tag:0,info:rows})
        sql.endConn(connection);
    });
});

module.exports = router;