const express = require('express')
const router = express.Router()
const mysql = require('mysql')
const connection = require('../BD/config.js')

router.get('/', (req,res,next) => { 
    if (req.session.loggedin) {
        if(req.session.isAdmin){
		console.log(':',req.session );
        var id = req.session.UserID;	
            res.render('index',
                {
                    session :req.session, 
                })	
        }else{
            res.render('error/access');
        }		
	} else {
        //res.send('Please login to view this page!');
        req.flash('error', 'Bạn chưa đăng nhập');
        res.redirect('/');
	}
	//res.end(); 
});
//end


//Danh sach thanh vien
router.get(('/danhsachthanhvien'),(req, res)=>{
    console.log('danhsachnhanvien:',req.session );
    if (req.session.loggedin) {
        if(req.session.isAdmin){
            var sql="SELECT * FROM usermaster WHERE PeningFlage = 1"; 
            connection.query(sql, (err, results)=>{
                if(err) throw err;
                res.render('dsthanhvien',{results: results,session :req.session, title: 'Danh sách thành viên'})
            })
        }else{
        res.render('error/access');}		
    } else {
        req.flash('error', 'Bạn chưa đăng nhập');
        res.redirect('/');
        }
})


//delete 
router.post('/nhanvienhanchinh/delete', (req, res)=>{
    if (req.session.loggedin) {
        if(req.session.isAdmin){
            var id = req.body.id;
            connection.query('DELETE FROM usermaster WHERE UserID=?', id,function(err, result) {
                if (err) throw err;
                console.log('Da xoa thanh cong deleted!'+id);
                res.redirect('admin/nhanvienhanchinh');
             });
        }else{
            res.render('error/access');}		
    } else {
        req.flash('error', 'Bạn chưa đăng nhập');
        res.redirect('/');
    }
});
//edit
router.post('/nhanvienhanchinh/update', (req, res, next)=>{
    if (req.session.loggedin) {
        if(req.session.isAdmin){
            var body = req.body;
            var id = body.id;
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
                res.redirect('/');
            });
        }else{
            res.render('error/access');}		
    } else {
        req.flash('error', 'Bạn chưa đăng nhập');
        res.redirect('/');
    }
});
//End danhsachnhan vien

//dangkythanhvien
router.get(('/dangky'),(req, res)=>{
    if (req.session.loggedin) {
        if(req.session.isAdmin){
            res.render('register',{title: 'Đăng ký', session :req.session})
            }else{
        res.render('error/access');}		
    } else {
    req.flash('error', 'Bạn chưa đăng nhập');
    res.redirect('/');
    }
});

router.post(('/dangky'), (req, res)=>{	
    var body = req.body;
    var userungvien = body.usernameungvien;
    var tree = null;
    connection.query('SELECT * FROM db_htx_tap.usermaster WHERE Email=? or Sdt= ?',[body.usernamequanly, body.usernamequanly],function(err, rows ,fields){
        if(body.usernamequanly === body.email || body.usernamequanly === body.sdt && body.capqly==='A1' ){
            tree = body.email;
            console.log('A1:', tree);
        }else {
            if(body.usernamequanly !== body.usernameungvien ){
            
                if(body.capqly ==='A1'){
                    tree = rows[0].Email;
                    console.log('cap A2:', tree);
                }else if(body.capqly ==='A2'){
                    tree = rows[0].tree;
                    console.log('A2:', tree);
                }else if(body.capqly ==='A3'){
                    tree = rows[0].tree;
                    console.log('A3:', tree);
                }
            }
        }	
        var usermaster={
            "HoTen": body.hoten,
            "Email": body.email,
            "Sdt": body.sdt,
            "Password":body.password,
            "RoleID":"3",
            "Categories":body.capqly,
            "NgaySinh": body.date,
            "NoiSinh": body.noisinh,
            "userQL":body.usernamequanly,
            "TKNH":body.taikhoan,
            "ChinhanhTKNH": body.chinhanh,
            "DiaChi":body.diachi,
            "DateCreate": new Date(),
            "UserCreate" : req.session.UserID,
            "tree": tree,
            "PeningFlage": 1
        }
        connection.query('INSERT INTO usermaster SET ?',usermaster , function(err, result,fields) {
            if (err) {
                res.send({err})
            } else {
                req.flash('success', 'Bạn đã đắng ký thành công')
                console.log("dang ky thanh cong")
                res.redirect('admin/dangky')
                res.end();
            }
        });
    });

});

//cayhethong

router.get('/cayhethong', (req, res)=>{
    // var sql="SELECT * FROM usermaster Group by tree ORDER BY tree"; 
        connection.query('SELECT * FROM usermaster' ,(err, row)=>{
            if(err) throw err; 
            res.render('systemtree',{
                // results: row,
                row: row, title: 'Cây hệ thống'
            });
        });
})

//lịch công tác
router.get('/lich_cong_tac',(req, res)=>{ 

    if (req.session.loggedin) {
        if(req.session.isAdmin){
            var lich = req.query.lich;
            console.log("lich"+lich);
            connection.query('SELECT UserID, HoTen FROM usermaster',(err, row)=>{
                connection.query('SELECT u1.HoTen , u2.HoTen as HoTen1, u3.HoTen as HoTen2, u4.HoTen as HoTen3, u5.HoTen as HoTen4, u6.HoTen as HoTen5, u7.HoTen as HoTen6     FROM lichlamviec l '
                            +'left join usermaster u1 ON l.thu2= u1.UserID'
                            +' left join usermaster u2 on l.thu3= u2.UserID'
                            +' left join usermaster u3 on l.thu4= u3.UserID'
                            +' left join usermaster u4 on l.thu5= u4.UserID'
                            +' left join usermaster u5 on l.thu6= u5.UserID'
                            +' left join usermaster u6 on l.thu7= u6.UserID'
                            +' left join usermaster u7 on l.cn= u7.UserID WHERE tuan=?' , lich,function(err, result,fields) {
                
                    res.render('admin/lichcongtac',{title: 'Lịch Công Tác', row: row, result:result,  session :req.session})
                }) 
            })
        }else{
        res.render('error/access');}		
    } else {
        req.flash('error', 'Bạn chưa đăng nhập');
        res.redirect('/');
    }
})


router.post('/lich_cong_tac', (req,res)=>{

    console.log("lichcongtac")
    var body=req.body;
    thu2= body.thu2,
    thu3 =body.thu3,
    thu4 = body.thu4,
    thu5 = body.thu5,
    thu6 = body.thu6,
    thu7 = body.thu7,
    cn =body.cn
        
    tuan= body.lich
   for(let i = 0; i<=3; i++){
  
    console.log(cn[i])
        connection.query('INSERT INTO lichlamviec (`tuan` , `thu2`, `thu3`, `thu4`, `thu5`, `thu6`, `thu7`, `cn`) VALUE (`?`, `?`, `?`, `?`, `?` ,`?` , `?`, `?`)'
                            ,(tuan, thu2[i], thu3[i], thu4[i], thu5[i], thu6[i] ,thu7[i] ,cn[i]), function(err, result,fields) {
            if (err) {
                req.flash('success', 'Vui lòng nhập đủ 1 tuần làm việc')
                res.redirect('/lich_cong_tac')
            }
        });
    }
    req.flash('success', 'Bạn đã đắng ký thành công')
                console.log("dang ky thanh cong")
                res.redirect('/lich_cong_tac')    
});

//Hồ sơ đã đc duyệt
    router.get('/ho_so_duoc_phe_duyet', (req, res)=>{
        
        var sql="SELECT * FROM usermaster"; 
        var sql1 = "SELECT * FROM sanphammua";
        connection.query(sql, (err, results)=>{
            connection.query(sql1, (err, rows)=>{
           
                res.render('hosodapheduyet',{ results:results, rows:row,  title: "Hồ sơ đã phê duyệt"})
            })
        })
    })

    

    

module.exports = router;