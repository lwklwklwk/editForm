var express=require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var tabNames=[];
app.use(express.static('public'));
app.all("*",function(req,res,next){
  //设置允许跨域的域名，*代表允许任意域名跨域
  res.header("Access-Control-Allow-Origin","*");
  //允许的header类型
  res.header("Access-Control-Allow-Headers","content-type");
  //跨域允许的请求方式 
  res.header("Access-Control-Allow-Methods","DELETE,PUT,POST,GET,OPTIONS");
  if (req.method.toLowerCase() == 'options')
      res.send(200);  //让options尝试请求快速结束
  else
      next();
})
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
app.get('/setTabName',function(req,res){
  console.log(req.query);
  let newTabName=req.query.newTabName;
  if(tabNames.find(e=>{
    return e.tabName==newTabName;
  })==undefined){
    tabNames.push({tabName:newTabName,tableHead:[],tableData:[]});
    res.send({info:`表格"${newTabName}"成功创建`,status:0});
  }
  else{
    res.send({info:`表名已存在！`,status:-1});
  }
})
app.get('/linkTab',function(req,res){
  console.log(req.query);
  let linkTabName=req.query.linkTabName;
  let tableMeta=tabNames.find(e=>{
    return e.tabName==linkTabName;
  })
  if(tableMeta!=undefined){
    res.send({info:`成功连接至表格${linkTabName}`,status:0,tableMeta:tableMeta});
  }
  else{
    res.send({info:`该表不存在！`,status:-1});
  }
})
io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('sentTH',msg=>{
    io.sockets.emit('getTH',msg);
  })
});
http.listen(3000, function(){
  console.log('listening on *:3000');
});