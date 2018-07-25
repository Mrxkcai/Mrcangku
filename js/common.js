var apiUrl = '59.110.230.122';
var api = {
	showPromotion:"http://" + apiUrl + "/app/promotion/partake/showPromotion",	//	获取活动信息
	partakePromotion:"http://" + apiUrl + "/app/promotion/partake/partakePromotion",	//	参与互动（领取红包）
	register:"http://" + apiUrl + "/app/company/employee/register",	//	员工注册接口
	send:"http://" + apiUrl + "/app/company/employee/send",	//	员工注册发送短信接口
}

//	时间戳转化
function getTime(createTime,a){
	var date = new Date(createTime)
	let Y, M, D, h, m, s
	Y = date.getFullYear() + '年'
	M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '月'
	D = tranformTow(date.getDate())  + '日 '
	h = tranformTow(date.getHours()) + ':'
	m = tranformTow(date.getMinutes())
    s = tranformTow(date.getSeconds())
    
    if(a == 1){
        return Y + M + D
    }else if(a == 2){
        return Y + M + D + h + m 
    }else if(a == 3){
        return Y + M + D + h + m  + ':' + s
    }else if(a == 4){
    	return M + D
    }else{
    	
    }
};

//	时间戳中个位数转化十位数
function tranformTow(number){
	return number < 10 ? '0'+number:number
}

//解析url
function getUrlParam(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
	var r = window.location.search.substr(1).match(reg); //匹配目标参数
	if (r != null) return decodeURI(r[2]);
	return null; //返回参数值
}

//	setCookie
function setCookie(name,value){
	var Days=30*12;
	var expires=new Date();
	expires.setTime(expires.getTime()+Days*24*60*6*1000);
	document.cookie=name+"="+escape(value)+";expires="+expires.toGMTString();
}

//	getCookie
function getCookie(name){  
    var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));  
    if(arr != null){  
     return unescape(arr[2]);   
    }else{  
     return null;  
    }  
}

//	deleteCookie

function delCookie(name){  
    var exp = new Date();  //当前时间  
    exp.setTime(exp.getTime() - 1);  
    var cval=getCookie(name);  
    if(cval!=null) document.cookie= name + "="+cval+";expires="+exp.toGMTString();  
}

function setItem(key, val) {
    window.sessionStorage.setItem(key, JSON.stringify(val));
};

function getItem(key) {
    if (!window.sessionStorage.getItem(key) || window.sessionStorage.getItem(key) === "undefined" || window.sessionStorage.getItem(key) === null || window.sessionStorage.getItem(key) === undefined) {
        return null;
    } else {
        return JSON.parse(window.sessionStorage.getItem(key));
    }
};

function removeItem(key) {
    window.sessionStorage.removeItem(key);
};
