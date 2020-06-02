var express = require('express');
var router = express.Router();
const sql = require('../mysql');

router.post('/', function (req, res, next) {
    if(!req.session.user)
        return res.json({tag:-10});
    var accountId=req.session.user.accountId;
    var connection = sql.getConn();
    var func = "cardlist('" + accountId + "')";
    var query=`SELECT b.BankId,b.AccountNumber,b.IsPrimary,b.verified FROM bank as b, account as a WHERE a.AccountId=${accountId} and a.AccountId=b.AccountId`;
    connection.query(query, function (err, rows, fields) {
        if (err) {
            console.log('error')
            console.log('[query] - :' + err);
            sql.endConn(connection);
            return res.json({tag:-1});
        }
        console.log(rows)
        res.json({tag:0,cardlist:rows})
        sql.endConn(connection);
    });
});

module.exports = router;