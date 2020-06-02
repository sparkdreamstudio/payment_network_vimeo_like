var express = require('express');
var router = express.Router();
const sql = require('../mysql');

router.post('/', function (req, res, next) {
    if(!req.session.user)
        return res.json({tag:-10});
    var accountId=req.session.user.accountId;
    var connection = sql.getConn();
    var func = "getUserPhoneAndEmail('" + accountId + "')";
    var queryPhoneAndEmail =`select p.PhoneNo,t.Status from phone as p,token as t where t.AccountId=${accountId} and t.TokenId=p.Token and t.${"`Status`"} <>'abandoned';
                            select e.EmailAddress,t.Status from email as e,token as t where t.AccountId=${accountId} and t.TokenId=e.Token and t.${"`Status`"} <>'abandoned';;`;

    connection.query(queryPhoneAndEmail, function (err, rows, fields) {
        if (err) {
            console.log('error')
            console.log('[query] - :' + err);
            res.json({tag:-1})
            sql.endConn(connection);
            return;
        }
        console.log(JSON.stringify(rows))
        res.json({tag:0,phone:rows[0],email:rows[1]})
        sql.endConn(connection);
    });
});

module.exports = router;