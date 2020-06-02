var express = require('express');
var router = express.Router();
const sql = require('../mysql');

router.post('/', function (req, res, next) {
    if(!req.session.user)
        return res.json({tag:-10});
    var accountId=req.session.user.accountId;
    var connection = sql.getConn();
    var params = req.body;
    var func = "monthlyStatement('" + accountId + "','"+params.monthnumber+"')";
    connection.query('select ' + func, function (err, rows, fields) {
        if (err) {
            console.log('error')
            console.log('[query] - :' + err);
            sql.endConn(connection);
            return;
        }
        console.log(rows[0][func])
        res.json(JSON.parse(rows[0][func]))
        sql.endConn(connection);
    });
});

module.exports = router;