var express = require('express');
var router = express.Router();
var mongoose=require('mongoose');
var Goods=require('../models/goods')

mongoose.connect('mongodb://127.0.0.1:27017/dumall');
mongoose.connection.on('connected',function(){
    console.log('MongoDB connected success.')
});
mongoose.connection.on('error',function(){
    console.log('MongoDB connected fail.')
});
mongoose.connection.on('disconnected',function(){
    console.log('MongoDB disconnected.')
});

//查询商品列表数据
router.get('/list', function(req, res, next) {
    let page=parseInt(req.param('page'));          //req.param:拿浏览器参数，express框架中取数据的方法
    let pageSize=parseInt(req.param('pageSize'));
    let priceLevel=req.param('priceLevel');
    let sort=req.param('sort');  //sort=1是升序 -1是降序：mongos提供的api
    let skip=(page-1)*pageSize;
    var priceGt='',priceLte='';
    let params={};
    if(priceLevel!='all'){ 
    switch(priceLevel){
     case '0':priceGt=0;  priceLte=100; break; 
     case '1':priceGt=100;  priceLte=500; break;
     case '2':priceGt=500;  priceLte=1000; break;
     case '3':priceGt=1000;  priceLte=5000; break;  
    }
    params={
        salePrice:{
            $gt:priceGt,
            $lte:priceLte
        }
    };
    }
    
    let goodsModel=Goods.find(params).skip(skip).limit(pageSize); //skip(skip)：默认跳过skip条数据。 limit：当页显示多少条数据
    
    goodsModel.sort({'salePrice':sort});
    goodsModel.exec(function(err,doc){    //exec取代find，实现sort功能
   if(err){
       res.json({
           status:'1',
           msg:err.message
       });
   }else{
       res.json({
           status:'0',
           msg:'',
           result:{
               count:doc.length,
               list:doc
           }
       })
   }
  })
});
//提交购物车
//向数据库拿数据用get提交数据用post，get取参数req.param，post取参数：req.body
router.post("/addCart", function (req,res,next) {
    var userId = '100000077',productId = req.body.productId;
    var User = require('../models/user');
    User.findOne({userId:userId}, function (err,userDoc) {
      if(err){
          res.json({
              status:"1",
              msg:err.message
          })
      }else{
          console.log("userDoc:"+userDoc);
          if(userDoc){
            var goodsItem = '';
            userDoc.cartList.forEach(function (item) {
                if(item.productId == productId){
                  goodsItem = item;
                  item.productNum ++;
                }
            });
            if(goodsItem){
              userDoc.save(function (err2,doc2) {
                if(err2){
                  res.json({
                    status:"1",
                    msg:err2.message
                  })
                }else{
                  res.json({
                    status:'0',
                    msg:'',
                    result:'suc'
                  })
                }
              })
            }else{  
              Goods.findOne({productId:productId}, function (err1,doc) {
                if(err1){
                  res.json({
                    status:"1",
                    msg:err1.message
                  })
                }else{
                  if(doc){
                    userDoc.cartList.push({
                      "productId":doc.productId,
                      "productName":doc.productName,
                      "salePrice":doc.salePrice,
                      "productImage":doc.productImage,
                      "productNum":1,
                      "checked":1
                    });
                    userDoc.save(function (err2,doc2) {
                      if(err2){
                        res.json({
                          status:"1",
                          msg:err2.message
                        })
                      }else{
                        res.json({
                          status:'0',
                          msg:'',
                          result:'suc'
                        })
                      }
                    })
                  }
                }
              });
            }
          }
      }
    })
  });

module.exports = router;