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
router.get('/', async function(req, res, next) {
    if (req.session.login == undefined){
      res.redirect('/users/login'); 
    }
    let sql = "select * from messages"
    let rows = await dball.getAllRows(sql);
    let opt = {
      title: '掲示板',
      login: req.session.login,
      messages: rows, 
    }
    res.render('board', opt);
});

router.post('/', upload.single('file_input'), async function(req, res, next) {
    if (req.session.login == undefined){
        res.redirect('/users/login');
    }
    console.log(req.file);
    now = new Date();
    time = now.toFormat('YYYYMMDDHH24MISS');
    let name = req.body.name;
    let message = req.body.message;
    let uid= req.session.login.id;
    if(req.file!=undefined){
      let img = req.file.filename;
      let sql = "insert into messages (message, user_id, name, img) values ('"+message+"', "+uid+", '"+name+"', '"+img+"')";
      await dbdo.exec(sql);
    }
    else{
      let sql = "insert into messages (message, user_id, name) values ('"+message+"', "+uid+", '"+name+"')";
      await dbdo.exec(sql);
    }
    let sql2 = "select * from messages"
    let rows = await dball.getAllRows(sql2);
    let opt = {
        title: '掲示板',
        login: req.session.login,
        messages: rows,
    } 
    res.render('board', opt);
});


module.exports = router;