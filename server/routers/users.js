var express=require('express');
var router=express.Router();
var User=require('../models/users');
var util=require('../util/util');


//用户登录
router.post('/login',(req,res,next)=>{
  var params={
    userName:req.body.userName,
    userPwd:req.body.userPwd,
  };
  User.findOne(params,(err,logins)=>{
    if(err){
      res.json({
        status:'1',
        msg:err.msg
      });
      return;
    }
    if(!logins){
      res.json({
        status:'1',
        msg:'用户名或密码不正确'
      })
    }else{
      res.cookie('userId',logins.userId);
      res.cookie('userName',logins.userName);
      res.json({
        status:'0',
        msg:'登录成功',
        result:{
          userName:logins.userName,
          userId:logins.userId
        }
      })
    }
  })
});

//检测用户是否登录
router.get("/checkLogin", function (req,res,next) {
  if(req.cookies.userId){
    res.json({
      status:'0',
      msg:'',
      result:{
        userName:req.cookies.userName || '',
        userId:req.cookies.userId || ''
      },
    });
  }else{
    res.json({
      status:'1',
      msg:'未登录',
      result:''
    });
  }
});

//用户登出
router.post('/logout',(req,res,next)=>{
  res.clearCookie('userId');
  res.clearCookie('userName');
  res.json({
    status:'0',
    msg:'登出成功',
  })
});

//获取用户购物车
router.get('/cart',(req,res,next)=>{
  var userId=req.cookies.userId;
  User.findOne({userId:userId},(err,userDoc)=>{
    if(err){
      res.json({
        status:'1',
        msg:err.msg
      })
      return
    }
    if(userDoc){
      res.json({
        status:'0',
        msg:'success',
        result:userDoc.cartList
      })
    }else{
      res.json({
        status:'1',
        msg:'用户不存在'
      })
    }
  })
});

//查询购物车数量
router.get("/getCartCount", function (req,res,next) {
  if(req.cookies && req.cookies.userId){
    var userId = req.cookies.userId;
    User.findOne({"userId":userId}, function (err,doc) {
      if(err){
        res.json({
          status:"0",
          msg:err.message
        });
      }else{
        let cartList = doc.cartList;
        let cartCount = 0;
        cartList.map(function(item){
          cartCount += parseFloat(item.productNum);
        });
        res.json({
          status:"0",
          msg:"",
          result:cartCount
        });
      }
    });
  }else{
    res.json({
      status:"0",
      msg:"当前用户不存在"
    });
  }
});

//删除购物车货物
router.post('/delCart',(req,res,next)=>{
  var userId=req.cookies.userId;
  var productId=req.body.productId;
  var length=productId.length-1;
  var i=0;
  let indexs=null;
  productId.forEach((item,index)=>{
    User.update({userId:userId},{$pull:{cartList:{productId:item}}},function(err,result){
      if(result){
        i=i+1;
        indexs=index
      }
      if(indexs==length){
        if(i==(length+1)){
          res.json({
            status:'0',
            msg:'删除成功'
          });
        }else{
          res.json({
            status:'1',
            msg:'删除失败'
          });
        }
      }
    });

  });



});

//购物车数量及选择状态改变
router.post('/changeCart',(req,res,next)=>{
  var userId=req.cookies.userId;
      productId=req.body.productId;
      productNum=req.body.productNum;
      checked=req.body.checked;
      User.update({'userId':userId,'cartList.productId':productId},{
        'cartList.$.productNum':productNum,
        'cartList.$.checked':checked,
      },(err,doc)=>{
        if(err){
          res.json({
            status:'1',
            msg:err.msg
          });
          return
        }
        if(doc){
          res.json({
            status:'0',
            msg:'修改成功',
            result:doc
          });
        }
      })
});

//全选与全不选状态更改
router.post('/changeAllCart',(req,res,next)=>{
  var userId=req.cookies.userId,check=req.body.checked;
  User.findOne({userId:userId},(err,Doc)=>{
    if(err) {
      res.json({
        status: '1',
        msg: err.msg
      })
    }else if(Doc){
      Doc.cartList.forEach(item=>{
        item.checked=check;
      });
      Doc.save((errs,suc)=>{
        if(errs){
          res.json({
            status: '1',
            msg: err.msg
          })
        }else if(suc){
          res.json({
            status: '0',
            msg: 'success'
          })
        }else{
          res.json({
            status: '1',
            msg: '出错啦'
          })
        }
      })
    }else{
      res.json({
        status: '1',
        msg: '未查到数据'
      })
    }
  })
});


//获取用户地址
router.get('/address',(req,res,next)=>{
  var userId=req.cookies.userId;
  User.findOne({userId:userId},(err,Doc)=>{
    if(err) {
      res.json({
        status: '1',
        msg: err.msg
      })
    }else if(Doc){
      res.json({
        status: '0',
        msg: 'success',
        result:Doc.addressList.reverse()
      })
    }else{
      res.json({
        status: '1',
        msg: '未查到数据'
      })
    }
  })
});

//设置默认地址
router.post('/setDefault',(req,res,next)=>{
  var userId=req.cookies.userId,
      addressId=req.body.addressId;

  User.findOne({userId:userId},(err,Doc)=>{
    if(err){
      res.json({
        status: '1',
        msg: err.msg
      })
    }else if(Doc){
      Doc.addressList.forEach((item)=>{
        if(item.addressId==addressId){
          item.isDefault=true
        }else{
          item.isDefault=false
        }
      });

      Doc.save((err,suc)=>{
        if(err){
          res.json({
            status: '1',
            msg: err.msg
          })
        }else if(suc){
          res.json({
            status: '0',
            msg: 'success'
          })
        }else{
          res.json({
            status: '1',
            msg:'设置失败'
          })
        }
      })
    }else{
      res.json({
        status: '1',
        msg:'用户不存在'
      })
    }
  })
});

//添加地址
router.post('/addAddress',(req,res,next)=>{
  var userId=req.cookies.userId;
  var query=req.body.query;
  User.findOne({"userId":userId}).sort({'addressList.addressId':-1}).then((userDoc)=>{

    //判断当前地址是否有值
    if(userDoc.addressList.length==0){//当前地址无值
      query.addressId='100000'
    }else{//当前地址有值
      var length=userDoc.addressList.length-1;//上一个地址的值加一
      query.addressId=(parseInt(userDoc.addressList[length].addressId)+1).toString();
    }

    //添加入数组
    userDoc.addressList.push(query);

    //默认地址判断
    if(query.isDefault){
      userDoc.addressList.forEach((item)=>{
        if(item.addressId!=query.addressId) {
          item.isDefault = false
        }
      });
    }

    //数据保存
    userDoc.save((err,doc)=>{
      if(err){
        res.json({
          status: '1',
          msg:err.msg
        })
      }else if(doc){
        res.json({
          status: '0',
          msg:'success',
          result:doc.addressList.reverse()
        })
      }else{
        res.json({
          status: '0',
          msg:'添加失败'
        })
      }
    })
  }).catch((err)=>{
      res.json({
        status: '0',
        msg:err.msg
      })
  })
});

//删除地址
router.post('/delAddress',(req,res,next)=>{
  var userId=req.cookies.userId,
      addressId=req.body.addressId;
  User.update({userId:userId},{$pull:{addressList:{addressId:addressId}}},function(err,result){
    if(err){
      res.json({
        status: '1',
        msg:err.msg
      })
    }else if(result){
      res.json({
        status: '0',
        msg:result
      })
    }else{
      res.json({
        status: '1',
        msg:'删除失败'
      })
    }
  });
});

//增加订单
router.post('/addOrder',(req,res,next)=>{
  var userId=req.cookies.userId;
  var data=req.body.data;

  //定义订单结构
  var orderList={
    'id':'',
    "orderId":'',
    "orderTotal":data.allMoney,
    "addressInfo":"",
    "goodsList":data.orderList,
    "orderStatus" : "1",
    "createDate":""
  };

  //获取用户信息
  User.findOne({userId:userId},(err,Doc)=>{
    if(err){
      res.json({
        status: '1',
        msg:err.msg
      })
    }else if(Doc){
      //设置id
      if(Doc.orderList.length==0){
        orderList.id='0'
      }else{
        var length=Doc.orderList.length-1;
        orderList.id=(parseInt(Doc.orderList[length].id)+1).toString()
      }
      //遍历地址,填入收货地址
      Doc.addressList.forEach((item)=>{
        if(item.addressId==data.addressId){
          orderList.addressInfo=item
        }
      });
      //订单编号创建日期生成
      orderList.createDate=new Date().Format('yyyy-MM-dd hh:mm:ss');

      //订单编号的生成
      orderList.orderId=`866${new Date().Format('yyyyMMddhhmmss')}${(Math.floor(Math.random()*10))}${userId}`;

      Doc.orderList.push(orderList);

      Doc.save((err,orders)=>{
        if(err){
          res.json({
            status: '1',
            msg:'final'
          })
        }else if(orders){
          res.json({
            status: '0',
            msg:'订单成功',
            result:orderList
          })
        }else{
          res.json({
            status: '1',
            msg:'保存成功'
          })
        }
      })
    }else{
      res.json({
        status: '1',
        msg:'用户不存在'
      })
    }
  });

});

//获取订单信息
router.post('/getOrder',(req,res,next)=>{
  var userId=req.cookies.userId,
      orderId=req.body.orderId;
      orderList=[]
  User.findOne({userId:userId},(err,Doc)=>{
    if(err){
      res.json({
        status: '1',
        msg:err.msg
      })
    }else if(Doc){
      if(Doc.orderList.length>0){
        var haves=false

        Doc.orderList.forEach((item)=> {
          if (item.orderId == orderId) {
            haves=true;
            orderList.push(item)
          }
        });
        if(haves){
          res.json({
            status: '0',
            msg:'success',
            result:orderList
          })
        }else{
          res.json({
            status: '1',
            msg:'订单不存在',
          })
        }

      }else{
        res.json({
          status: '1',
          msg:'暂无订单'
        })
      }
    }else{
      res.json({
        status: '1',
        msg:'用户不存在'
      })
    }
  })
});

module.exports=router;
