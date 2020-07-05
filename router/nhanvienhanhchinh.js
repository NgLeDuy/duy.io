const express = require('express')
const router = express.Router()
const mysql = require('mysql')
const connection = require('../BD/config.js')

// var body = req.body;
// var usermaster={
//     "HoTen": body.hoten,
//     "Email": body.email,
//     "Sdt": body.sdt,
//     "Password":body.password,
//     "RoleID":"1",
//     "Categories": body.capqly,
//     "NgaySinh": body.date,
//     "NoiSinh": body.noisinh,
//     "userQL":body.usernamequanly,
//     "TKNH":body.taikhoan,
//     "ChinhanhTKNH": body.chinhanh,
//     "DiaChi":body.diachi,
//     // "DateCreate": new Date(),
//     "UserCreate" : req.session.UserID
// }




router.get(('/'),(req, res)=>{
    //res.render('dsthanhvien',{title: 'Danh sách thành viên'})
    var sql="SELECT * FROM UserMaster"; 
    connection.query(sql, (err, results)=>{
        if(err) throw err;
        res.render('dsthanhvien',{results: results, title: 'Danh sách thành viên'})
    })
})

//delete 
router.post('/delete', (req, res)=>{
    var id = req.body.id;
    console.log('id:',id);
    connection.query('DELETE FROM usermaster WHERE UserID=?', id,function(err, result) {
       if (err) throw err;
       console.log('record deleted!');
       res.redirect('/nhanvienhanchinh');
    });
  });
//edit
router.post('/update', (req, res, next)=>{
    var body = req.body;
    var id = req.body.id;
    console.log("id: ", id)
    var usermaster={
        "HoTen": body.hoten,
        "userNV": body.usernameungvien,
        "Email": body.email,
        "Sdt": body.sdt,
        "Password":body.password,
        "Categories": body.capqly,
        "NgaySinh": body.date,
        "NoiSinh": body.noisinh,
        "userQL":body.usernamequanly,
        "TKNH":body.taikhoan,
        "ChinhanhTKNH": body.chinhanh,
        "DiaChi":body.diachi,
        "DateUpdate": new Date(),
        }

    connection.query('UPDATE usermaster SET ? WHERE UserID= ?',[usermaster, id], (err, result)=>{
        if (err) throw err;
        console.log('record edidl!');
        res.redirect('/nhanvienhanchinh');
    });
});

  
module.exports = router;