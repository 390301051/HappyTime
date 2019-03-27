const async = require('async');
const router = express.Router();


//此为个人中心首页，展示个人资料
router.get('/', (req, res) => {
	//到数据里面把数据查询出来
	res.render('center', {
		username: req.session.username,
		phonenum: req.session.phonenum
	})
});

router.get('/perdata', (req, res) => {
	res.render('per-data', {
		username: req.session.username,
		phonenum: req.session.phonenum
	})

})



module.exports = router;
