//添加购物车与删除商品
function addShopCar() {
	let addcarbtn = document.querySelector(".goods");
	let car = document.querySelector(".layui-table tbody");
	if (!addcarbtn) {
		return;
	}
	addcarbtn.onclick = function(e) {
		if (e.target.classList.contains("addcar")) {
			let pname = e.target.parentNode.parentNode.childNodes[1].innerHTML;
			let price = e.target.parentNode.firstElementChild.innerHTML;
			//在添加菜品之前，先去检查购物车中是否有该菜品，如果有，就数量增加，没有就创建新的。
			let carshop = document.querySelectorAll(".layui-table tbody tr");
			for (let i = 0; i < carshop.length; i++) {
				if (carshop[i].firstElementChild.innerHTML === pname) {
					carshop[i].children[1].innerHTML = parseInt(carshop[i].children[1].innerHTML) + 1;
					return;
				}
			}
			//添加行
			let carpro = document.createElement("tr");
			car.appendChild(carpro);
			//添加商品名
			let cpname = document.createElement("td");
			cpname.innerHTML = pname;
			carpro.appendChild(cpname);
			//商品数量
			let num = document.createElement("td");
			num.innerHTML = "1";
			carpro.appendChild(num);
			//商品价格
			let cprice = document.createElement("td");
			cprice.innerHTML = price;
			carpro.appendChild(cprice);
			//删除按钮
			let delbtn = document.createElement("td");
			let dela = document.createElement("a");
			dela.className = "deletecar";
			dela.innerHTML = "删除";
			delbtn.appendChild(dela);
			carpro.appendChild(delbtn);
			//删除商品
			dela.onclick = function() {
				this.parentNode.parentNode.remove();
			}
		}
	}
}

//清空购物车
function clearshopCar() {
	let clearbtn = document.querySelector(".clearcar");
	if (!clearbtn) {
		return;
	}
	clearbtn.onclick = function() {
		document.querySelector(".layui-table tbody").innerHTML = "";
	}
}
//提交购物车数据到结算页面
function todelCar() {
	let todelbtn = document.querySelector(".todel");
	if (!todelbtn) {
		return;
	}
	todelbtn.onclick = function() {
		let products = document.querySelector(".layui-table tbody").children;
		let foodsArray = []; //存放购物车商品信息
		let allprice = 0; //记录购物车中的商品总价
		for (let i = 0; i < products.length; i++) {
			let food = products[i].children;
			let arrexp = [];
			let str = food[2].innerHTML;
			let arr = str.split("¥");
			let pname = food[0].innerHTML;
			arrexp.push(pname);
			let num = food[1].innerHTML + "份";
			arrexp.push(num);
			let price = parseInt(food[1].innerHTML) * arr[1] + "元";
			arrexp.push(price);
			let strexp = arrexp.join("---");
			foodsArray.push(strexp);
			allprice += parseInt(food[1].innerHTML) * arr[1];
		}
		// console.log(foodsArray.join(","),allprice);
		if (foodsArray.length) {
			// 发起一个get请求,将这些数据渲染到订单提交,付款页面.
			let orderstr = foodsArray.join(",");
			axios.post("ucont/cardel", {
					oname: orderstr,
					oprice: allprice
				})
				.then(function(response) {
					window.location.href = `ucont/cardel?delname=${response.data.delname}&allprice=${response.data.allprice}`;
				})
				.catch(function(response) {
					console.log(response);
				});
		}
	}
}

//结算页面提交，将订单信息发送给后端存入数据库
function payFor() {
	let paybtn = document.querySelector(".payfor");
	let str = window.location.search.slice(1);
	if (!paybtn) {
		return;
	}
	paybtn.onclick = function() {
		let adres = document.querySelector("input[name=address]");
		let address = adres.value; //地址
		let tipsinfor = document.querySelector("input[name=tips]");
		let tips = tipsinfor.value; //备注信息
		let errnum = 0;
		if (!address.length) {
			adres.nextElementSibling.innerHTML = "*请填写详细收货地址";
			errnum++;
			return;
		} else {
			adres.nextElementSibling.innerHTML = "";
		}
		if (!errnum) {
			let urlarr = str.split("&");
			let oname = "";
			let allprice = 0;
			oname += urlarr[0].split("=")[1];
			allprice = urlarr[1].split("=")[1];
			axios.post("/ucont/payfor", {
					ordername: oname,
					orderprice: allprice,
					orderaddress: address,
					ordertips: tips
				})
				.then(function(response) {
					if (response.data.r == "error") {
						layer.msg = "支付失败，请重新支付"
					} else if (response.data.r = "ok") {
						window.location.href = "/ucont/center";
					}
				})
				.catch(function(error) {
					console.log(error);
				});
		}
	}
}
