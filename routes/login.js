var express = require('express');
var router = express.Router();
const sql = require('../mysql');

router.post('/', function (req, res, next) {
    var params = req.body;
    var connection = sql.getConn();
    var func = "login('" + params.userName + "','" + params.password + "')";
    var sqlEmail=`select a.AccountId from account as a,token as t,email as e where a.AccountId=t.AccountId and e.Token=t.TokenId and e.EmailAddress='${params.userName}' and t.Status='verified' and a.Password='${params.password}';\n`
    var sqlPhone=`select a.AccountId from account as a,token as t,phone as p where a.AccountId=t.AccountId and t.TokenId=p.Token and p.PhoneNo='${params.userName}' and t.Status='verified'and a.Password='${params.password}';`;
    connection.query(sqlEmail+sqlPhone, function (err, rows, fields) {
        if (err) {
            console.log('error')
            console.log('[query] - :' + err);
            sql.endConn(connection);
            return res.json({tag:-1});
        }
        console.log(JSON.stringify(rows))
        if(rows[0].length!==0)
        {
            accountId=rows[0][0].AccountId;
        }
        else if(rows[1].length!==0)
        {
            accountId=rows[1][0].AccountId;
        }
        var accountId;
        if(accountId!==undefined){
            req.session.user = {accountId:accountId}; 
            res.json({tag:0});
        }
        else{
            res.json({tag:1});
        }
        sql.endConn(connection);
    });
});

module.exports = router;
