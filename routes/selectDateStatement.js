var express = require('express');
var router = express.Router();
const sql = require('../mysql');

router.post('/', function (req, res, next) {
    if (!req.session.user)
        return res.json({ tag: -10 });
    var accountId = req.session.user.accountId;
    var connection = sql.getConn();
    var params = req.body;
    var func = "monthlyStatement(" + accountId + ",'" + params.startdata + "','" + params.endDate + "')";

    var querypayorsend = `select DISTINCT trn.TransactionId as id,trn.Amount as amount,a.Name as target,e.EmailAddress as email,p.PhoneNo as phone,sd.TStatus as tstatus,trn.InitiatedTime as inittime,trn.Memo as memo
                            from (transactionofaccount as trn,send_transactionofaccount as sd,token as tk) LEFT JOIN account as a on tk.AccountId=a.AccountId left JOIN email as e on e.token=tk.TokenId LEFT JOIN phone as p on p.token=tk.TokenId
                            where trn.TransactionId = sd.TransactionId and sd.TargetToken=tk.TokenId and trn.CreateAccountId=${accountId} and trn.InitiatedTime >='${params.startdata}' and trn.InitiatedTime <='${params.endDate}';`;
    var querypayorrrequest = `select trn.TransactionId as id, rf.Amount as amount,a.Name as target,e.EmailAddress as email,p.PhoneNo as phone,rf.TStatus as tstatus,trn.InitiatedTime as inittime,trn.Memo as memo  
                            from (request_transactionofaccount_from as rf, transactionofaccount as trn, token as tk,account as a) left JOIN email as e on e.token=tk.TokenId LEFT JOIN phone as p on p.token=tk.TokenId
                            where a.AccountId=trn.CreateAccountId and trn.TransactionId=rf.TransactionId and rf.FromToken=tk.TokenId and tk.AccountId=${accountId} and trn.InitiatedTime >='${params.startdata}' and trn.InitiatedTime <='${params.endDate}';`;
    var querypayeesend = `select trn.TransactionId as id,trn.Amount as amount,a.Name as target,sd.TStatus as tstatus,trn.InitiatedTime as inittime,trn.Memo as memo
                        from transactionofaccount as trn,send_transactionofaccount as sd,token as tk, account as a
                        where a.AccountId=trn.CreateAccountId and trn.TransactionId = sd.TransactionId and sd.TargetToken=tk.TokenId and tk.AccountId=${accountId} and trn.InitiatedTime >='${params.startdata}' and trn.InitiatedTime <='${params.endDate}';`;
    var querypayeerrequest = `select DISTINCT trn.TransactionId as id, rf.Amount as amount,a.Name as target,e.EmailAddress as email,p.PhoneNo as phone,rf.TStatus as tstatus,trn.InitiatedTime as inittime,trn.Memo as memo  
                              from (request_transactionofaccount_from as rf, transactionofaccount as trn, token as tk )LEFT JOIN account as a on tk.AccountId=a.AccountId LEFT JOIN email as e on tk.TokenId=e.token LEFT JOIN phone as p on tk.TokenId=p.token
                              where trn.CreateAccountId=${accountId} and trn.TransactionId=rf.TransactionId and rf.FromToken=tk.TokenId and trn.InitiatedTime >='${params.startdata}' and trn.InitiatedTime <='${params.endDate}';`;
    console.log(querypayorsend);
    connection.query(querypayorsend + querypayorrrequest + querypayeesend + querypayeerrequest, function (err, rows, fields) {
        if (err) {
            console.log('error')
            console.log('[query] - :' + err);
            res.json({ tag: -1 })
            sql.endConn(connection);
            return;
        }
        var statements = [];
        for (i = 0; i < rows.length; i++) {
            var row=rows[i]
            row.map((value,index)=>{
                console.log(value)
                statements.push({
                    ...value,
                    type: i
                }) 
            });
        }
        statements.sort((a,b)=>{
            return Date(b.inittime)>Date(a.inittime)
        });
        res.json({
            tag: 0,
            statements: statements
        });
        sql.endConn(connection);
    });
});

module.exports = router;