function addpro() {
	let btn = document.querySelector('.addpro');
	if (!btn) {
		return;
	}
	btn.onclick = function () {
		let errNum = 0;
		// 检查信息是否输入
		let pname = document.querySelector('input[name="pname"]');
		let pname_value = pname.value;
		if (pname_value == '') {
			pname.parentElement.nextElementSibling.innerHTML = '*菜名必填';
			pname.focus();
			errNum++;
		} else {
			pname.parentElement.nextElementSibling.innerHTML = '';
		}
		// 检查信息是否输入
		let price = document.querySelector('input[name="price"]');
		let price_value = price.value;
		if (price_value == '') {
			price.parentElement.nextElementSibling.innerHTML = '*价格必填';
			price.focus();
			errNum++;
		} else {
			price.parentElement.nextElementSibling.innerHTML = '';
		}
		// 检查信息是否输入
		let imgsrc = document.querySelector('input[name="imgsrc"]');
		let imgsrc_value = imgsrc.value;
		if (imgsrc_value == '') {
			imgsrc.parentElement.nextElementSibling.innerHTML = '*图片地址必填';
			imgsrc.focus();
			errNum++;
		} else {
			imgsrc.parentElement.nextElementSibling.innerHTML = '';
		}
		// 获取描述的数据
		let pdescribe = document.querySelector('textarea[name="pdescribe"]');
		let pdescribe_value = pdescribe.value;
		//通过ajax把数据发送到服务器
		axios.post('/acont/addpro', {
				pname: pname_value,
				price: price_value,
				pdescribe: pdescribe_value,
				imgsrc: imgsrc_value
			})
			.then(function (response) {
				console.log(response);
				if (response.data.r == 'pname_had') {
					layer.msg('已有该菜品，请直接修改');
				}

				if (response.data.r == 'ok') {
					layer.msg('添加成功');
				}
			})
			.catch(function (error) {})
	}
}

function updatepro() {
	let btn = document.querySelector('.updatepro');
	// if(!btn) return;
	btn && (btn.onclick = function () {
		//获取要修改的信息的pid
		let errNum = 0;
		let pid = document.querySelector('input[name="pid"]').value;
		// 获取输入框的值
		let pname = document.querySelector('input[name="pname"]');
		let pname_value = pname.value;
		//检查信息是否输入
		if (pname_value == '') {
			pname.parentElement.nextElementSibling.innerHTML = '*菜名必填';
			pname.focus();
			errNum++;
		} else {
			pname.parentElement.nextElementSibling.innerHTML = '';
		}
		//检查信息是否输入
		let price = document.querySelector('input[name="price"]');
		let price_value = price.value;
		if (price_value == '') {
			price.parentElement.nextElementSibling.innerHTML = '*价格必填';
			price.focus();
			errNum++;
		} else {
			price.parentElement.nextElementSibling.innerHTML = '';
		}
		// 检查信息是否输入
		let imgsrc = document.querySelector('input[name="imgsrc"]');
		let imgsrc_value = imgsrc.value;
		if (imgsrc_value == '') {
			imgsrc.parentElement.nextElementSibling.innerHTML = '*图片地址必填';
			imgsrc.focus();
			errNum++;
		} else {
			imgsrc.parentElement.nextElementSibling.innerHTML = '';
		}
		let pdescribe = document.querySelector('textarea[name="pdescribe"]');
		let pdescribe_value = pdescribe.value;
		// 通过ajax的方式把数据发送到服务器
		axios.post('/acont/updatepro', {
				pid: pid,
				pname: pname_value,
				price: price_value,
				pdescribe: pdescribe_value,
				imgsrc: imgsrc_value
			})
			.then(function (response) {
				console.log(response);
				if (response.data == 'ok') {
					window.location.href = '/acont';
				}
			})
			.catch(function (error) {})
	});

}

function delpro() {
	//使用事件代理实现点击事件  confirm
	let prolist1 = document.querySelector('.prolist');
	// console.log(prolist1)
	prolist1 && (prolist1.onclick = function (e) {
		let target = e.target;
		console.log(e)
		//点击的节点包含delpro这个类表示删除 data-pid
		if (target.classList.contains('delpro')) {
			layer.open({
				content: '是否确定删除？',
				btn: ['确定', '取消'],
				yes: function (index, layero) {
					let pid = target.dataset.pid;
					//到数据库删除对应的信息
					axios.get('/acont/delpro', {
							params: {
								pid: pid
							}
						})
						.then(function (response) {
							layer.close(index); //关闭弹窗
							//隐藏或者删除当前行
							if (response.data.r == 'success') {
								target.parentNode.parentNode.remove();
							}
						})
						.catch(function (error) {})
				},
				btn2: function (index, layero) {},
				cancel: function () {}
			});
		}
	})
}
