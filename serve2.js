const express = require('express')
const path = require('path')
const app = express()

const history = require('connect-history-api-fallback')
app.use(history())
app.use(express.static(path.join(__dirname, 'dist')))
var bodyParser = require('body-parser')

//跨域
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type,Content-Length, Authorization, Accept,X-Requested-With',
  )
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
  res.header('X-Powered-By', ' 3.2.1')
  if (req.method == 'OPTIONS') res.send(200)
  /*让options请求快速返回*/ else next()
})

const mysql = require('mysql')
var connsql = mysql.createConnection({
  host: '127.0.0.1',
  port: '3306',
  user: 'ly',
  password: 'luyuan',
  database: 'userdb',
})
connsql.connect()

// app.engine('html', require(' '))
// app.use('/public', express.static('dist'))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// app.get('/', (req, res) => {
//   res.render('index.html') //默认登录页面
// })
// app.post('/about', function (req, res) {
//   //   res.sendStatus(200)
//   res.send(req.body)
//   console.log(req.body)
// })
app.get('/', (req, res) => {
  res.render(__dirname, './dist/index.html') //注册页面！
})
app.use('/register', (req, res) => {
  var regs = {
    user: req.body.user,
    pwd: req.body.pwd,
  }
  var regssql =
    "insert into enroll(username,password) values('" +
    regs.user +
    "','" +
    regs.pwd +
    "')"
  var selsql =
    "select username from enroll where username = '" + regs.user + "'"
  function regfun() {
    connsql.query(regssql, (err, result) => {
      if (err) {
        console.log(err)
        return
      }
      res.json({
        code: 1,
        msg: '注册成功',
      })
      console.log(regs.user, '注册成功')
    })
  }
  connsql.query(selsql, (err, result) => {
    if (err) {
      console.log(err)
      return
    }
    if (result == '') {
      regfun()
    } else {
      res.json({ code: -1, msg: '注册失败，用户名已存在' })
      console.log(regs.user + '用户名已存在')
    }
  })
})
app.use('/login', (req, res) => {
  console.log(req, 'req')
  var login = {
    user: req.body.user, //获取input中的user值
    pwd: req.body.pwd,
  }
  var loginsql =
    "select username,password from enroll where username='" +
    login.user +
    "'and password='" +
    login.pwd +
    "'"
  connsql.query(loginsql, (err, result) => {
    if (err) {
      console.log('err message:', err)
      return
    }
    if (result == '') {
      console.log('用户名或密码错误！')
      res.json({
        code: -1,
        msg: '用户名或密码错误！',
      })
    } else {
      console.log('用户名密码匹配成功')
      res.json({
        code: 1,
        msg: '登录成功',
      })
    }
  })
})
app.listen(3001)
