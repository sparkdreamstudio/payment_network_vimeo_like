var mysql = require('mysql');

//config mysql connection
var config= {
    host: '127.0.0.1', //mysql host ip
    user: 'root',     //mysql host user name
    password: '123456',     //host password
    port: '3306',
    database: 'project', //database name
    charset: 'UTF8_GENERAL_CI',
    insecureAuth: true,
    multipleStatements: true
};

var connCount = 0; 
exports.getConn = function(){
  connCount ++;
  console.log('............................OPEN a connection, has '+ connCount + ' connection.');
  return mysql.createConnection(config);
};
exports.endConn = function(conn){
  conn.end(function(err){
    if(!err){
      connCount --;
      console.log('.........................CLOSE a connection, has '+ connCount + ' connection.');
    }
  });
};
