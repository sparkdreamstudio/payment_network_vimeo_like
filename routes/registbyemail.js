var express = require('express');
var router = express.Router();
const sql = require('../mysql');

router.post('/', function (req, res, next) {
    var params = req.body;
    var connection = sql.getConn();
    var func = "createUserWithEmail('" + params.name + "','" + params.email + "','" + params.password + "')";
    connection.beginTransaction(function (err) {
        if (err) {
            console.log('error')
            console.log('[query] - :' + err);
            res.json({ tag: -1 })
            sql.endConn(connection);
        }
        else {
            connection.query('select ' + func, function (err, rows, fields) {
                if (err) {
                    console.log('error')
                    console.log('[query] - :' + err);
                    res.json({ tag: -1 })
                    connection.rollback(function () {
                        throw err;
                    });
                    sql.endConn(connection);
                    return;
                }
                connection.commit(function (err) {
                    if (err) {
                        console.log('error')
                        console.log('[query] - :' + err);
                        res.json({ tag: -1 })
                        connection.rollback(function () {
                            throw err;
                        });
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
        }
    })


});

module.exports = router;
