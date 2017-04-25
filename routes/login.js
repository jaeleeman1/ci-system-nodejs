var express = require('express');
var router = express.Router();
var config = require('../lib/config');
var getConnection = require('../lib/db_connection');
var request = require('request');

router.get('/test', function(req, res, next) {
    res.render('test.html');
});
/* GET users listing. */
router.get('/login', function(req, res, next) {
    var userInfo = req.session.userInfo;
    var user_id = '';

    try {
        user_id = userInfo.user_id;
    }catch(e) {console.error('session error'+ e);}

    console.log('session : ' + userInfo);
    if(user_id == '') {
        res.render('login', {url:config.url});
    }else {
        res.render('main/initPage',{nickName: user_id, listLength : 0 });
    }
});

router.get('/logout', function(req, res, next) {
    req.session.destory(function(err){
        if(err) console.err('err', err);
        res.render('login', {url:config.url});
    });
});

router.get('/login/initPage', function(req, res, next) {
    getConnection(function (err, connection){
        var loginId = req.query.login_id;
        var loginPassword = req.query.login_password;

        var selectIdQuery = "select exists (select * from TB_USER_INFO AS TSL where TSL.USER_WECHAT_ID = ?) as ID_CHECK";
        connection.query(selectIdQuery, loginId, function (err, rowId) {
            if (err) {
                console.error("*** initPage select id Error : " , err);
            }else{
                var loginIdCheck = rowId[0].ID_CHECK;
                var loginPwCheck = '0';
                if(loginIdCheck == '1') {
                    var selectPwQuery = "select exists (select * from TB_USER_INFO AS TSL where TSL.USER_WECHAT_ID = ? and TSL.USER_PASSWORD = ?) as PW_CHECK";
                    connection.query(selectPwQuery, [loginId, loginPassword], function (err, rowPw) {
                        if (err) {
                            console.error("*** initPage select password Error : ", err);
                        } else {
                            loginPwCheck = rowPw[0].PW_CHECK;
                            var userInfo = {
                                user_id : loginId
                            }
                            req.session.userInfo = userInfo;
                            res.send({loginIdCheck: loginIdCheck, loginPwCheck: loginPwCheck});
                        }
                    });
                }else {
                    res.send({loginIdCheck: loginIdCheck, loginPwCheck: loginPwCheck});
                }
            }
            connection.release();
        });
    });
});

router.post('/login/initPage', function(req, res, next) {
    // console.log('login id : ' + req.body.login_id);
    res.render('main/initPage',{nickName: req.body.login_id, listLength : 0 });
});

module.exports = router;
