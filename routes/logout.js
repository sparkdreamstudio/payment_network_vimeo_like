var express = require('express');
var router = express.Router();
const sql = require('../mysql');

router.post('/', function (req, res, next) {
    var params = req.body;
    req.session.destroy(function(err) {
        if(err){
            res.json({tag: 1, ret_msg: '退出登录失败'});
            return;
        }
        
        // req.session.loginUser = null;
        res.clearCookie('tijn');
        res.json({tag: -10, ret_msg: '退出登录失败'});
    });
});

module.exports = router;
