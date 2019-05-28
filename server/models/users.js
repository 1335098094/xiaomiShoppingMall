var mongoose =require('mongoose');
var userSchema = new mongoose.Schema({
  "userId":String,
  "userName":String,
  "userPwd":String,
  "orderList":[
    {
      'id': String,
      "orderId": String,
      "orderTotal": String,
      "addressInfo": Array,
      "goodsList": Array,
      "orderStatus": String,
      "createDate": String
    }
  ],
  "cartList":[
    {
      "productId":String,
      "productName":String,
      "salePrice":String,
      "productImage":String,
      "checked":String,
      "productNum":String
    }
  ],
  "addressList":[
    {
      "addressId": String,
      "userName": String,
      "streetName": String,
      "postCode": Number,
      "tel": Number,
      "isDefault": Boolean
    }
  ]
});

module.exports=mongoose.model('User',userSchema);
