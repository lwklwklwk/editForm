var express=require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var tabNames={};
var connections={};
app.use('/dist',express.static(__dirname+ '/dist'));
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
app.get('/dist', function(req, res){
  res.sendFile(__dirname + '/dist/index.html');
});
app.get('/setTabName',function(req,res){
  console.log(req.query);
  let newTabName=req.query.newTabName;
  if(tabNames[newTabName]==undefined){
    tabNames[newTabName]={tableHead:[],tableData:[]};
    res.send({info:`表格"${newTabName}"成功创建`,status:0});
  }
  else{
    res.send({info:`表名已存在！`,status:-1});
  }
})
app.get('/linkTab',function(req,res){
  console.log(req.query);
  let linkTabName=req.query.linkTabName;
  let tableMeta=tabNames[linkTabName];
  if(tableMeta!=undefined){
    res.send({info:`成功连接至表格${linkTabName}`,status:0,tableMeta:tableMeta});
  }
  else{
    res.send({info:`该表不存在！`,status:-1});
  }
})
io.on('connection', function(socket){
  let name='';
  let count=0;
  console.log('a user connected');
  socket.on('setGroup',msg=>{
    connections[socket.id]={tabName:msg};
    name=msg;
    console.log(connections);
  })
  /* 
    表行相关
 */
  //添加表行
  socket.on('addRow',msg=>{
    tabNames[name].tableData.push({});
    sendTableData(name);
  })
  //删除表行
  socket.on('deleteRow',msg=>{
    tabNames[name].tableData.splice(msg,1);
    sendTableData(name)
  })
  //编辑表行
  socket.on('editRow',msg=>{
    tabNames[name].tableData[msg.index]=msg.data;
    sendTableData(name);
  })
  /* 
    表头相关
   */
  //添加表头
  socket.on('addHead',msg=>{
    count++;
    tabNames[name].tableHead.push({
      prop:count.toString(),
      label:'新建列'
    })
    sendTableData(name);
  })
  //编辑表头
  socket.on('editHead',msg=>{
    console.log(msg)
    tabNames[name].tableHead=msg;
    sendTableData(name);
  })
  //删除表头
  socket.on('deleteHead',msg=>{
    let prop=tabNames[name].tableHead[msg].prop;
    tabNames[name].tableData.forEach(element => {
      delete element[prop];
    });
    tabNames[name].tableHead.splice(msg,1);
    sendTableData(name);
  })
  /* 
    断开连接
  */
  socket.on('disconnect',reason=>{
    console.log(reason);
    delete connections[socket.id];
  })
});
function sendTableData(name){
  console.log(connections)
   for(let id in connections){
    if(connections[id].tabName==name){
      console.log("ok")
      io.to(id).emit('tableData',tabNames[name])
    }
  }
}
http.listen(3000, function(){
  console.log('listening on *:3000');
});