var http=require ('http');
http.get('http://www.imooc.com/u/cart',function(res){
    let data='';
    res.on('data',function(chunk){
        data+=chunk;
    });
    res.on('end',function(){
        let result=JSON.parse(data);  //把字符串转成对象
        console.log('result:'+result.msg);
    })
})