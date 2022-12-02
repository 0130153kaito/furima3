var express = require('express');
var router = express.Router();
var dbget = require('../db/get.js');
var dball = require('../db/all.js');
var dbdo = require('../db/exec.js');
require('date-utils');
const multer = require('multer');

let now = new Date();
let time = now.toFormat('YYYYMMDDHH24MISS');
// ファイルアップロードの設定
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/')
  },
  //ファイル名を変更する
  filename: function (req, file, cb) {
    cb(null, time)
  }
});
const upload = multer({ storage: storage });

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/sell', async function(req, res, next) {
  if (req.session.login == undefined){
    res.redirect('/users/login'); 
  }
  let login = req.session.login;
  let opt = {
    title: '商品登録画面',
    login: login,
  }
  res.render('sell', opt);
});

router.post('/sell',upload.single('image'), async function(req, res, next) {
  let sql = "select * from products";
  let rows = await dball.getAllRows(sql);
  let login = req.session.login;
  let uid = login.id;
  let name = req.body.name;
  let price = req.body.price;
  let description = req.body.description;
  let Category_1 = req.body.Category_1;
  let Category_2 = req.body.Category_2;
  let Category_3 = req.body.Category_3;
  let Product_code = 1000+rows.length;
  if(req.file!=undefined){
    let img = req.file.filename;
    let sql = "insert into products (name, price, description, Category_1, Category_2, Category_3, Product_code, img, user_id) values ('"+name+"', "+price+", '"+description+"', '"+Category_1+"', '"+Category_2+"', '"+Category_3+"', '"+Product_code+"', '"+img+"', "+uid+")";
    await dbdo.exec(sql);
  }
  else{
    let sql = "insert into products (name, price, description, Category_1, Category_2, Category_3, Product_code, user_id) values ('"+name+"', "+price+", '"+description+"', '"+Category_1+"', '"+Category_2+"', '"+Category_3+"', '"+Product_code+"', "+uid+")";
    await dbdo.exec(sql);
  }
  let opt = {
    title: '商品登録画面',
    login: login,
  }
  res.render('sell', opt);

});

router.get('/buy', async function(req, res, next) {
  if (req.session.login == undefined){
    res.redirect('/users/login'); 
  }
  let login = req.session.login;
  let opt = {
    title: '商品購入画面',
    login: login,
  }
  res.render('buy', opt);
});

router.get('/home', async function(req, res, next) {
  if (req.session.login == undefined){
    res.redirect('/users/login'); 
  }
  let login = req.session.login;
  let sql = "select * from products";
  let rows = await dball.getAllRows(sql);
  let opt = {
    title: 'Home画面',
    login: login,
    products: rows,
  }
  res.render('home', opt);
});



module.exports = router;
