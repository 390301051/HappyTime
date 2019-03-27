
function imgup(){
	let uhead = document.querySelector('input[name="uhead"]');
	
	uhead && (uhead.onchange=function() {
		let formdata = new FormData();
		formdata.append('uhead',this.files[0]);
		axios.post('/uphead',formdata)
		.then(function (response) {
			console.log(response.data);
	        document.querySelector('#headimg').src = response.data;
	        })
		.catch(function (error) {
		})	
	});
}
function changeSave(){
	let prebtn = document.querySelector('.prebtn');
	prebtn && (prebtn.onclick = function() {	
		// 先判断
		let errNum = 0
		let uname = document.querySelector('input[name="uname"]');
		let un_value = uname.value;
	
		if (un_value == "") {
			uname.parentElement.nextElementSibling.innerHTML = '*必填';
			uname.focus();
			errNum++;
		} else {
			uname.parentElement.nextElementSibling.innerHTML = '';
		}
		let uimgsrc = document.querySelector('#headimg').src;
		let unatur = document.querySelector('#text1').value;
		if (!errNum) {
			//通过ajax方式把数据发送到服务器
			axios.post('/updpre', {
				uname: un_value,
				uimgsrc: uimgsrc,
				unatur: unatur
			})
			.then(function(response) {
				if (response.data.r == 'ok') {
					window.location.reload();
				} else {
					alert('未知错误，刷新后操作');
				}
			})
			.catch(function(error) {})
		}	
	});	
}
		