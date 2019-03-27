const async = require('async');
const router = express.Router();

//此为商家管理页面
router.get('/', (req, res) => {
	//到数据里面把数据查询出来
	let sql = 'SELECT * FROM products WHERE status=1';
	//用户输入关键词进行搜索 sql语句里面需要加上对应的判断条件 模糊查询
	let kw = '';
	kw = req.query.keywords ? req.query.keywords : '';
	if (kw) {
		sql += ' AND pname LIKE "%' + kw + '%"';
	}
	mydb.query(sql, (err, results) => {
		res.render('mer', {
			prolist: results,
			keywords: kw
		});
	});
 
});

router.get('/addp', (req, res) => {
	res.render('m-add');
})

router.post('/addpro', (req, res) => {
	//保存到数据库
	async.waterfall([
		function (callback) {
			let sql = 'select * from products where status =1 and pname =?';
			mydb.query(sql, req.body.pname, (err, result) => {
				if (err) {
					console.log(err);
					return;
				}
				callback(null, result.length);
			})
		},
		function (arg1, callback) {
			// arg1 now equals 'one' and arg2 now equals 'two'
			if (arg1 == 1) {
				callback(null, {
					r: 'pname_had'
				});
			} else {
				let sql = 'insert into products(pname,price,pdescribe,imgsrc) values(?,?,?,?)';
				mydb.query(sql, [req.body.pname, req.body.price, req.body.pdescribe, req.body.imgsrc], (err, result) => {
					if (err) {
						console.log(err);
						return;
					}
					callback(null, {
						r: 'ok'
					})
				});
			}
		}
	], function (err, result) {
		res.json(result)
		// result now equals 'done'
	});
});

//删除菜品
router.get('/delpro', (req, res) => {
	let pid = req.query.pid;
	let sql = 'update products set status = 2 where pid=?';
	mydb.query(sql, pid, (err, result) => {
		if (!err) {
			res.json({
				r: 'success'
			});
		}
	});
});

//修改信息 原始信息展示
router.get('/updatep', (req, res) => {
	let pid = req.query.pid;
	//到数据库里面获取原始信息
	let sql = 'select * from products where pid=?';
	mydb.query(sql, pid, (err, result) => {
		res.render('m-update', result[0]);
	});
});

router.post('/updatepro', (req, res) => {
	console.log(req.body)
	//保存到数据库
	let sql = 'update products set pname=?,price=?,pdescribe=?,imgsrc=? where pid=?';
	mydb.query(sql, [req.body.pname, req.body.price, req.body.pdescribe, req.body.imgsrc, req.body.pid], (err, result) => {
		if (err) {
			console.log(err);
		}
		res.send('ok');
	});
});

module.exports = router;