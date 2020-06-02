var express = require('express');
var router = express.Router();
const sql = require('../mysql');
var validator = require("email-validator");
/* GET home page. */
router.get('/', function (req, res, next) {

  var params = { username: '123450@gmail.com', memo: '123434', amount: 10 }
  var accountId = 1;
  var connection = sql.getConn();
  var querycheckAmount = `select Balance from account where AccountId=${accountId}`;
  //var querypaymentlimite=`select `;
  connection.query(querycheckAmount, function (err, rows, fields) {
    if (err) {
      console.log('error')
      console.log('[query] - :' + err);
      return res.json({ tag: -1 })
    }
    if (rows[0].Balance < params.amount) {
      return res.json({ tag: 1 })
    }
    else {
      var querycheckPhone = `select p.Token from token as t,phone as p where t.TokenId=p.Token and p.PhoneNo='${params.username}';`;
      var querycheckEmail = `select e.Token from token as t,email as e where t.TokenId=e.Token and e.EmailAddress='${params.username}';`;
      connection.query(querycheckPhone + querycheckEmail, function (err, rows, fields) {
        if (err) {
          console.log('error')
          console.log('[query] - :' + err);
          return res.json({ tag: -1 })
        }
        var token;
        if (rows[0].length > 0) {
          token = rows[0][0].Token
        }
        else if (rows[1].length > 0) {
          token = rows[1][0].Token
        }
        if (token === undefined) {
          var queryCreateToken;
          if (validator.validate(params.username)) {
            queryCreateToken = `INSERT INTO token VALUES();INSERT INTO email(Token,EmailAddress) VALUES(@@IDENTITY,'${params.username}');`;
          }
          else {
            queryCreateToken = `INSERT INTO token VALUES();INSERT INTO phone(Token,PhoneNo) VALUES(@@IDENTITY,'${params.username}');`;
          }
          var queryCreateTransaction = `set @token=@@IDENTITY;
                                        INSERT INTO transactionofaccount(CreateAccountId,Memo,Amount) VALUES(${accountId},'${params.memo}',${params.amount});
                                        INSERT INTO send_transactionofaccount(TransactionId,TargetToken)VALUES(@@IDENTITY,@token);
                                        UPDATE account as a set a.Balance=a.Balance-${params.amount} where a.AccountId=${accountId};`;
          connection.query(queryCreateToken + queryCreateTransaction, function (err, rows, fields) {
            if (err) {
              console.log('error')
              console.log('[query] - :' + err);
              return res.json({ tag: -1 })
            }
            res.json({ tag: 0 })
          });
        }
        else {
          var queryCreateTransaction = `INSERT INTO transactionofaccount(CreateAccountId,Memo,Amount) VALUES(${accountId},'${params.memo}',${params.amount});
                                    INSERT INTO send_transactionofaccount(TransactionId,TargetToken)VALUES(@@IDENTITY,${token});
                                    UPDATE account as a set a.Balance=a.Balance-${params.amount} where a.AccountId=${accountId};
                                    UPDATE account as a set a.PendingBalance=a.PendingBalance+${params.amount} where a.AccountId=(select t.AccountId from token as t where t.TokenId=${token});`;
          connection.query(queryCreateTransaction, function (err, rows, fields) {
            if (err) {
              console.log('error')
              console.log('[query] - :' + err);
              return res.json({ tag: -1 })
            }
            res.json({ tag: 0 })
          });
        }
        sql.endConn(connection);
      });
    }
  });
});

module.exports = router;
