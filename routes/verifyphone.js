var express = require('express');
var router = express.Router();
const sql = require('../mysql');

router.post('/', function (req, res, next) {
    if(!req.session.user)
        return res.json({tag:-10});
    var accountId=req.session.user.accountId;
    var params = req.body;
    var connection = sql.getConn();
    var func = "verifyPhone(" + accountId + ",'" + params.phone +"')";
    connection.query('select ' + func, function (err, rows, fields) {
        if (err) {
            console.log('error')
            console.log('[query] - :' + err);
            res.json({ tag: -1 })
            sql.endConn(connection);
            return;
        }
        console.log(rows[0][func])
        res.json({
            tag: rows[0][func]
        })
        sql.endConn(connection);
    });
});

module.exports = router;