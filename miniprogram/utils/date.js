

function getNowTime () {
  var now = new Date();
  var year = now.getFullYear();
  var month = now.getMonth() + 1;
  var day = now.getDate();
  if (month < 10) {
    month = '0' + month;
  };
  if (day < 10) {
    day = '0' + day;
  };
  //  如果需要时分秒，就放开
  // var h = now.getHours();
  // var m = now.getMinutes();
  // var s = now.getSeconds();
  var formatDate = year + '-' + month + '-' + day;
  return formatDate;
} 
/*
 * 获取 //获取today AddDayCount天后的日期
 */
function getDateStr(today, addDayCount) {
  var dd;
  if (today) {
    dd = new Date(today);
  } else {
    dd = new Date();
  }
  dd.setDate(dd.getDate() + addDayCount);//获取AddDayCount天后的日期 
  var y = dd.getFullYear();
  var m = dd.getMonth() + 1;//获取当前月份的日期 
  var d = dd.getDate();
  if (m < 10) {
    m = '0' + m;
  };
  if (d < 10) {
    d = '0' + d;
  };
  return y + "-" + m + "-" + d;
}



function haveSomeMinutesTime(n) {
  if (n == null) {
    n = 0;
  }
  // 时间
  var newDate = new Date()
  // var timeStamp = newDate.getTime(); //获取时间戳
  var date = newDate.setMinutes(newDate.getMinutes() + n);
  newDate = new Date(date);
  var year = newDate.getFullYear();
  var month = newDate.getMonth() + 1;
  var day = newDate.getDate();
  var h = newDate.getHours();
  var m = newDate.getMinutes();
  var s = newDate.getSeconds();
  if (month < 10) {
    month = '0' + month;
  };
  if (day < 10) {
    day = '0' + day;
  };
  if (h < 10) {
    h = '0' + h;
  };
  if (m < 10) {
    m = '0' + m;
  };
  if (s < 10) {
    s = '0' + s;
  };
  var time = year + month + day + h + m + s;

  return time;
}
function writeCurrentDate() {
  var now = new Date();
  var year = now.getFullYear(); //得到年份
  var month = now.getMonth();//得到月份
  var date = now.getDate();//得到日期
  var day = now.getDay();//得到周几
  var hour = now.getHours();//得到小时
  var minu = now.getMinutes();//得到分钟
  var sec = now.getSeconds();//得到秒
  var MS = now.getMilliseconds();//获取毫秒
  var week;
  month = month + 1;
  if (month < 10) month = "0" + month;
  if (date < 10) date = "0" + date;
  if (hour < 10) hour = "0" + hour;
  if (minu < 10) minu = "0" + minu;
  if (sec < 10) sec = "0" + sec;
  if (MS < 100)MS = "0" + MS;
  var arr_week = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
  week = arr_week[day];
  var time = "";
  //time = year + "年" + month + "月" + date + "日" + " " + hour + ":" + minu + ":" + sec + " " + week;
  time = hour + ":" + minu
  //当前日期赋值给当前日期输入框中（jQuery easyUI）
  console.log('time', time)
  return time
}
function isDate(dateString) {
  if (dateString.trim() == "") return true;
  var r = dateString.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
  if (r == null) {
   
    return false;
  }
  var d = new Date(r[1], r[3] - 1, r[4]);
  var num = (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] && d.getDate() == r[4]);
  if (num == 0) {
    return false
  }
  return (num != 0);
 }
function isDateTime(test){
  let test1 = new Date(test);
  console.info(test1.toString());
  if (test1.toString() === "Invalid Date"){
    console.info("check success");
    return false
  }
    return true
}

module.exports = { haveSomeMinutesTime, getDateStr, getNowTime, writeCurrentDate, isDate, isDateTime}