// 1，引入express
global.express = require('express');
// 接收post过来的数据
const bodyParser = require('body-parser');
// 数据库操作模块
const mysql = require('mysql');
// 模板引擎
const ejs = require('ejs');
// 2，创建一个web应用
const app = express();
//接收post过来的数据
const cookieParser = require('cookie-parser');
const session = require('express-session');
//开启cookie
let secret = 'moc.01815h.www';
app.use(cookieParser(secret));
// 开启session
app.use(session({
    secret: secret,
    name:'sessid1810',
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge:24*3600000*7}
  }));
//接收post过来的数据
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json()); //接收json格式的数据
// 连接到数据库

global.mydb = mysql.createConnection({
	user: 'root',
	password: '123',
	host: 'localhost',
	database: 'campus-takeout',
	port: 3306
});
mydb.connect();

//模板引擎设置
app.engine('html', ejs.renderFile); //自定义模板引擎html
app.set('views', 'myviews'); //模板文件所在的路径
app.set('view engine', 'html'); //注册模板引擎到express

//进入首页
app.get('/', (req,res) => {
	res.render("index");
});
//商家入口
app.get("/merchantLogin",(req,res)=>{
	res.render("merchantLogin");
});
//用户注册
app.get("/goregist",(req,res)=>{
	res.render("regist");
});
//注册完成，返回登录页面
app.get("/gologin",(req,res)=>{
	res.render("userLogin");
});
//用户入口
app.get("/userLogin",(req,res)=>{
	res.render("userLogin");
});

//admin登录post路由
app.post('/adminLogin', (req, res) => {
	let adminLoginData = req.body;
	let sql = 'select * from admin where aname = ?';
	mydb.query(sql, [adminLoginData.aname], (err, result) => {
		//检查账号是否存在
		if (!result.length) {
			res.json({
				r: 'aname_not_found'
			});
			return;
		}
		//检查密码是否正确
		if (result[0].apasswd != adminLoginData.apasswd) {
			res.json({
				r: 'apasswd_err'
			});
			return;
		}
		//登录成功
		res.json({
			r: 'ok'
		});
	})
});





//user登录post路由
app.post('/userLogin', (req, res) => {
	let userLoginData = req.body;
	let sql = 'select * from user where phonenum = ?';
	mydb.query(sql, [userLoginData.phonenum], (err, result) => {
		//检查账号是否存在
		if (result.length==0){
			res.json({
				r: 'phonenum_not_found'
			});
			return;
		}
		//检查密码是否正确
		if (result[0].userpasswd!= userLoginData.userpasswd) {
			res.json({
				r: 'userpasswd_err'
			});
			return;
		}
		req.session.phonenum = result[0].phonenum;
		req.session.username = result[0].username;
		req.session.head=result[0].head;
		//登录成功
		res.json({
			r: 'ok'
		});
	});
})
//用户注册信息录入
app.post("/userRegist",(req,res)=>{
	let rname=req.body.rname;
	let phonenum=req.body.phonenum;
	let apasswd=req.body.apsswd;
	mydb.query("select * from user where phonenum=?",[phonenum],(err,result)=>{
		if(err){
			console.log(err);
			return;
		}
		if(result.length){
			res.json({r:"phonenum_has_exists"});
			return;
		}else{
			mydb.query("insert into user(username,userpasswd,regtime,phonenum) value(?,?,now(),?)",[rname,apasswd,phonenum],(err,result)=>{
				if(err){
					console.log(err);
					return;
				}
				res.json({r:"ok"});
			});
		}
	});
});

// 用户个人中心的子路由
app.use('/userinfo', require('./router/userinfo'));
// // 用户操作页面子路由
app.use('/ucont', require('./router/ucont.js'));
// 商家管理界面的子路由
app.use('/acont', require('./router/acont'));

// 个人资料模块
//图片上传模块
const multer = require('multer');
//个人资料   -  get跳转
app.get('/pre',(req,res)=> {
	let sql = 'select * from user where phonenum=?';
	mydb.query(sql,req.session.phonenum,(err,result)=> {
		res.render('per-data',result[0]);
	})	
});
// 个人资料  -  头像
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
      cb(null, 
        Date.now() + '_' + 
        Math.random().toString().substr(2, 6) + '.' + 
        file.originalname.split('.').pop()
        )
    }
  })
let upload = multer({ storage: storage });
let host = 'http://localhost:81/';
app.post('/uphead', upload.single('uhead'), (req, res) => {
	// console.log(req.file)
    res.send(host + req.file.destination + '/' +  req.file.filename);
});
app.use('/uploads',express.static(__dirname + '/uploads'));
//个人资料   表单提交
app.post('/updpre',(req,res)=> {
	let dat = req.body;
	let sql = 'update user set username=?,head=?,natur=? where phonenum=?';
	mydb.query(sql,[dat.uname,dat.uimgsrc,dat.unatur,req.session.phonenum],(err,result)=> {
		req.session.username=dat.uname;
		req.session.head=dat.uimgsrc;
		res.json({r:'ok'});
	});	
});



//静态资源托管
app.use(express.static(__dirname + '/static'));

//端口监听
app.listen(81, () => {
	console.log('服务器已启动，端口为81');
});
