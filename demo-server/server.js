let http=require('http'); 
let url=require('url');
let util=require('util');
let fs=require('fs'); //fs是读文件系统

let server=http.createServer((req,res)=>{   //创建server
   
      //util.inspect() 将对象转换成字符串输出
    var pathname=url.parse(req.url).pathname
    fs.readFile(pathname.substring(1),function(err,data){
        if(err){
            res.writeHead(404,{
                'Content-Type':'text/html'
            })
        }else{
          res.writeHead(200,{
            'Content-Type':'text/html'
          })
          res.write(data.toString())
        }
        res.end(); //url.parse对url路径进行解析，parse把url转成对象
    })

   
})
server.listen(3000,'127.0.0.1',()=>{  //监听这个服务器
    console.log("服务器已经运行")
})