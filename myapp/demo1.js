// var express = require('express');
// var app = express();
 
// app.use(express.static('public'));
 
// app.get('/', function (req, res) {
//    res.send('Hello World');
// })
 
// var server = app.listen(8081, function () {
 
//   var host = server.address().address
//   var port = server.address().port
 
//   console.log("应用实例，访问地址为 http://%s:%s", host, port)
 
// })

var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));
// 一个简单的 logger
app.use(function(req, res, next){
  console.log('%s %s', req.method, req.url);
  next();
});
app.get('/hhh', function (req, res) {
  res.send('Hello World');
})
// // 响应
// app.use(function(req, res, next){
//   res.send('Hello World');
// });
app.listen(3000);