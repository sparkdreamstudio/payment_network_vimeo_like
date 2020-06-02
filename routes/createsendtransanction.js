var express = require('express');
var router = express.Router();
var validator = require("email-validator"); 
const sql = require('../mysql');

router.post('/', function (req, res, next) {
    if (!req.session.user)
        return res.json({ tag: -10 });
    var accountId = req.session.user.accountId;
    var params = req.body;
    var connection = sql.getConn();
    var setvalue=`SET @mm = '${params.memo}';`;
    var func = `createSendTransaction(${accountId},'${params.username}',${validator.validate(params.username)===true?1:0},${params.amount},@mm)`;
    connection.query(`${setvalue}select ${func};`, function (err, rows, fields) {
        if (err) {
            console.log('error')
            console.log('[query] - :' + err);
            sql.endConn(connection);
            return res.json({ tag: -1 })
        }
        console.log(rows[1][0])
        res.json({
            tag: rows[1][0][func]
        })
        sql.endConn(connection);
    });
});

module.exports = router;