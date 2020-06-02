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
    var queryInfo=`select a.SSN,a.NAME,a.Balance,a.PendingBalance,a.ToBankRollingLimit,a.paymentRollingLimit,p.SingleToBankLimit from account as a,plan as p where a.PlanId=p.PlanId and AccountId=${accountId}`;
    connection.query(queryInfo, function (err, rows, fields) {
        if (err) {
            console.log('error')
            console.log('[query] - :' + err);
            res.json({tag:-1})
            sql.endConn(connection);
            return;
        }
        console.log(rows)
        res.json({tag:0,info:rows[0]})
        sql.endConn(connection);
    });
});

module.exports = router;