var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var productSchema=new Schema({
  'productId':String,
  'productName':String,
  'salePrice':Number,
  'produceImage':String,
  'productNum':Number,
  'check':String
});

module.exports=mongoose.model('Good',productSchema);
