var express=require('express');
var router=express.Router();
var Goods=require('../models/goods');
var User=require('../models/users');


//查询商品
router.get("/",(req,res,next)=>{
  let page=req.query.page;//当前页码
  let sorts=parseInt(req.query.sort);//获取当前排序关键字
  let pageSize=parseInt(req.query.pageSize);//当前数据条数
  let minPrice=req.query.startPrice;//最低价格
  let maxPrice=req.query.endPrice;//最高价格
  //忽略前面多少条数据
  var skip=(page-1)*pageSize;
  //价格筛选
  var priceSelect={};
  if(minPrice!='all'&&maxPrice!='all'){
    priceSelect={
      'salePrice':{
        $gt:parseInt(minPrice),
        $lte:parseInt(maxPrice)
      }
    }
   }
  Goods.find(priceSelect).skip(skip).limit(pageSize).sort({salePrice:sorts}).then((list)=>{
    res.json({
        status:'200',
        msg:'success',
        result:{
          count:list.length,
          list:list
        }
      })
  }).catch((err)=>{
    res.json({
      status:'500',
      msg:err,
    });
  });
});

//商品加入购物车
router.post('/addCart',(req,res,next)=>{
  var userId=req.cookies.userId ,data=req.body.data;
    //查找是否有该用户
    const findUser=new Promise((resolve,reject)=>{
      User.findOne({userId:userId},(err,user)=>{
        if(err || user==null){
          reject(err);
        }else{
          resolve(user)
        }
      })
    });
    findUser.then((userDoc)=>{
      var isHave=false;//用于判断是否已经存在于购物车中
       userDoc.cartList.forEach((item)=>{
            if(item.productId==data.productId) {
                   isHave=true;
                   item.productNum++;
            }
       });
       if(!isHave) {
         data.productNum=1;
         data.checked=1;
         userDoc.cartList.push(data);
       }
       userDoc.save((err,suc)=>{
         if(err){
           res.json({
             status:"1",
             msg:err.message
           })
         }else{
           res.json({
             status:'0',
             msg:'加入购物车成功',
             result:suc
           })
         }
       });
    }).catch((err)=>{
        res.json({
          status:'1',
          msg:'用户不存在',
        });
    })

});

module.exports=router;
