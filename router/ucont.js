const async = require('async');
const router = express.Router();
//用户操作
//用户登录时获取到用户名，在首页右上角显示,页面显示商品信息
router.get('/', (req, res) => {
	let username = req.session.username;
	mydb.query("select * from user where username=?",[req.session.username],(err,results)=>{
		if(err){console.log(err);return}
		if(results.length>0&&results[0].phonenum!=req.query.phonenum){
				res.redirect("userLogin");
				return;
		}else{
			let headsrc=results[0].head;
			let sql = "select * from products where status=1";
			mydb.query(sql, (err, result) => {
				if (err) {
					console.log(err);
					return;
				}
				res.render("uer", {
					username: username,
					plist: result,
					phonenum: req.session.phonenum,
					head:headsrc
				});
			});
		}
	});
});

//处理购物车提交过来的数据
router.post("/cardel", (req, res) => {
	res.json({
		delname: req.body.oname,
		allprice: req.body.oprice,
	})

});

//购物车渲染到订单页面
router.get("/cardel", (req, res) => {
	mydb.query("select * from user where phonenum=?", [req.session.phonenum], (err, result) => {
		if (err) {
			console.log(err);
			return;
		}
		if (result.length) {
			let address = result[0].address;
			let headsrc=result[0].head;
			res.render("order", {
				delname: req.query.delname,
				allprice: req.query.allprice,
				username: req.session.username,
				phonenum: req.session.phonenum,
				address: address,
				head:headsrc
			});
		}
	});
});

//订单付款路由
router.post("/payfor", (req, res) => {
	let oname = req.body.ordername;
	let oprice = req.body.orderprice;
	let oaddress = req.body.orderaddress;
	let otips = req.body.ordertips;
	let sql = "insert into orders (pname,oprice,address,ordertime,tips,phonenum) values(?,?,?,now(),?,?)";
	mydb.query(sql, [oname, oprice, oaddress, otips, req.session.phonenum], (err, result) => {
		if (err) {
			console.log(err);
			res.json({
				r: "error"
			});
		} else {
			mydb.query("update user set address=? where phonenum=?", [oaddress, req.session.phonenum], (err, result) => {
				if (err) {
					console.log(err);
					return;
				}
				res.json({
					r: "ok"
				});
			});
		}
	});
});

//个人中心路由
router.get("/center", (req, res) => {
	mydb.query("select * from orders where phonenum=?", [req.session.phonenum], (err, result) => {
		if (err) {
			console.log(err);
			return;
		}
		res.render("center", {
			username: req.session.username,
			orders: result,
			phonenum: req.session.phonenum,
			head:req.session.head
		});
	});
});

//评论页面路由
router.get("/comment", (req, res) => {
	let username = req.session.username;
	//将其余用户的评论内容，展示到页面上
	mydb.query("select * from usertalk", (err, result) => {
		if (err) {
			console.log(err);
			return;
		}
		res.render("comment", {
			username: username,
			tlist: result,
			phonenum:req.session.phonenum,
			head:req.session.head
		});
	})
});

//用户评论内容提交到数据库
router.post("/comment", (req, res) => {
	let about = req.body.about;
	mydb.query("insert into usertalk(username,about,talktimes,head) values(?,?,now(),?)", [req.session.username, about,req.session.head], (err,result) => {
		if (err) {
			console.log(err);
			return;
		}
		res.json({
			r: "ok"
		});
	});
});

module.exports = router;
