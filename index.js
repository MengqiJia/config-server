var express = require('express'),
    app = express(),
    model = require('./model'),
    logger = require('winston'),
    bodyParser = require('body-parser'),
    clients = require('./clients'),
    NodeRSA = require('node-rsa'),
    hbs = require('hbs'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    flash = require('connect-flash'),
    session = require('express-session'),
    cookieParser = require('cookie-parser'),
    config = require('config');

var encrypt = function(publicKey, orig) {
    var key = new NodeRSA(publicKey.replace(/\r\n/g, '\n')),
        ret = key.encrypt(orig, 'base64');
    return ret;
};

passport.use('local', new LocalStrategy(
    function(username, password, done) {
        var user = {
            id: '1',
            username: config.passport.username,
            password: config.passport.password
        }; // 可以配置通过数据库方式读取登陆账号

        if (username !== user.username) {
            return done(null, false, {
                message: 'Incorrect username.'
            });
        }
        if (password !== user.password) {
            return done(null, false, {
                message: 'Incorrect password.'
            });
        }
        return done(null, user);
    }
));

passport.serializeUser(function(user, done) { //保存user对象
    done(null, user); //可以通过数据库方式操作
});

passport.deserializeUser(function(user, done) { //删除user对象
    done(null, user); //可以通过数据库方式操作
});


app.set('view engine', 'html');
app.engine('html', hbs.__express);
app.use(express.static('public'));
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser());
app.use(session({
    secret: 'ilovescotchscotchyscotchscotch'
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

app.post('/login',
    passport.authenticate('local', {
        successRedirect: '/index',
        failureRedirect: '/login'
    }));

app.get('/login', function(req, res) {
    res.sendfile(__dirname + '/public/views/login.html');
});

app.post('/config', bodyParser.text(), function(req, res) {
    var pk, result;
    if (!(req && req.body)) {
        logger.error("收到的请求不合法, " + req);
        return res.end("收到的请求不合法");
    }
    pk = req.body;
    logger.info("接到请求，public key参数为\n" + pk);
    pk = pk.replace(/\r\n/g, '\n');
    model.getClientByPK(pk, function(client) {
        if (!client || client.value == undefined) {
            logger.error(client.error || "请求Client时发生了错误, client = " + client);
            return res.end(client.error || "请求Client时发生了错误, client = " + client);
        }

        model.getConfigStrByClient(client.value, function(config) {
            var ret;
            if (!config || !config.value) {
                logger.error(config.error || "请求config时发生了错误, 参数 " + client.value + "config = \n" + JSON.stringify(config));
                return res.end(config.error || "请求config时发生了错误, 参数 " + client.value);
            }

            logger.info("请求处理结束，结果为：\n" + config.value);
            var clientsObj = JSON.parse(config.value);
            ret = encrypt(pk, clientsObj.clients);
            logger.info(clientsObj);
            logger.info("ret = " + ret);
            res.send(ret);
        });
    });
});
app.all('/index', isLoggedIn);
app.all('/save', isLoggedIn);
app.all('/get', isLoggedIn);

app.use('/', clients);

app.listen(1234, function() {
    logger.info("config server started!");
})


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/login');
}