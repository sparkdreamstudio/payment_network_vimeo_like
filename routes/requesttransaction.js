var express = require('express');
var router = express.Router();
const sql = require('../mysql');

router.post('/', function (req, res, next) {
    if(!req.session.user)
        return res.json({tag:-10});
    var accountId=req.session.user.accountId;
    var params = req.body;
    var connection = sql.getConn();
    
    var setvalue=`SET @acnid = ${accountId};
                  SET @payors = '${JSON.stringify(params.payors)}';
                SET @mm = '${params.memo}';`;
    var func = `createRequestTransaction(@acnid,@payors,@mm)`;
    connection.query(`${setvalue}select ${func};`, function (err, rows, fields) {
        if (err) {
            console.log('error')
            console.log('[query] - :' + err);
            res.json({ tag: -1 })
            sql.endConn(connection);
            return;
        }
        console.log(JSON.stringify(rows))
        res.json({
            tag: rows[3][0][func]
        })
        sql.endConn(connection);
    });
});

module.exports = router;
