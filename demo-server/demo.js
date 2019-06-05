let user=require('./User');

console.log(`userName:${user.userName}`);
console.log(`I am ${user.userName}, I say ${user.sayHello()}`);

let http=require('http'); 
let url=require('url');
let util=require('util');
let server=http.createServer((req,res)=>{   //创建server
    res.statusCode=200;
    res.setHeader('Content-Type','text/plain;charset=utf-8');
      //util.inspect() 将对象转换成字符串输出

    console.log('url:'+req.url); //url:/index.html
    console.log('parse:'+url.parse(req.url));//parse:[object Object]
    console.log('inspect:'+util.inspect( url.parse(req.url)));

    res.end(util.inspect( url.parse(req.url)) ); //url.parse对url路径进行解析，parse把url转成对象
})
server.listen(3000,'127.0.0.1',()=>{  //监听这个服务器
    console.log("服务器已经运行")
})