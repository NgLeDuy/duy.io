const express = require('express')
const router = express.Router()
const mysql = require('mysql')
const connection = require('../BD/config.js')
//router
// router.get('/', (req, res) => {
//     res.render('index', {title:'Trang chủ' })
// })

// DECLARING CUSTOM MIDDLEWARE





// DECLARING CUSTOM MIDDLEWARE
const ifNotLoggedin = (req, res, next) => {
    if(!req.session.isLoggedIn){
        return res.render('index');
    }
    next();
}

const ifLoggedin = (req,res,next) => {
    if(req.session.isLoggedIn){
        return res.redirect('/home');
    }
    next();
}
// END OF CUSTOM MIDDLEWARE

// ROOT PAGE
router.get('/',(req,res,next) => {
	console.log(req.session.loggedin);
    if (req.session.loggedin) {
		console.log(':',req.session );
		// var sql = 'SELECT UserID, RoleID FROM usermaster WHERE UserID=?';
		// connection
        var id = req.session.UserID;		
            res.render('index',
                {
                    session :req.session
                })			
	}else{
		res.render('index',{title: 'Trang chủ'})
	}
    
});

// END OF ROOT PAGE


//dang nhap
router.get('/dangnhap', (req, res) =>{
    res.render('login', {layout: false })
});


router.post('/dangnhap', ifLoggedin, (req, res, next)=>{

    var username = req.body.username;
	var password = req.body.password;
	
    if (username && password) {
		connection.query('SELECT * FROM usermaster WHERE Email = ?  and Password = ? or Sdt=? AND Password = ?', [username,password,username, password], function(error, results, fields) {
			if (results.length > 0) {
				req.session.loggedin = true;
				req.session.username = results[0].HoTen;
				req.session.UserID = results[0].UserID;
				// res.render('index', {title:'Trang chủ' });
				if(results[0].RoleID === 1){
					req.session.isAdmin = true; 
					res.redirect('/admin');
				}else{
				res.send('Tên đăng nhập thanh cong' + req.session.UserID);
				}
			} else {
				//  res.send('Incorrect Username and/or Password!');
				req.flash('error', 'Tên đăng nhập hoặc mật khẩu không đúng')
				res.redirect('/dangnhap')
				//res.send('Tên đăng nhập hoặc mật khẩu không đúng');
			}			
			 res.end();
		});
	} else {
		// res.send('Please enter Username and Password!');
		// req.flash('info', 'invalid username or password');
		req.flash('error', 'Điền vào đầy đủ thông tin đăng nhập')
		res.redirect('/dangnhap')
		// res.send('Điền vào đầy đủ thông tin đăng nhập');
		// res.end();
	}
});
//end dang nhap
router.get('/trangchu', function(req, res) {
	console.log("1" + req.session.loggedin);
	if (req.session.loggedin) {
		console.log(':'+ req.session );
		res.send('Welcome back, ' + req.session.username + '!');
	} else {
		res.send('Please login to view this page!');
	}
	res.end();
});
//dang nhap
router.get(('/dangky'),(req, res)=>{
	res.render('register',{title: 'Đăng ký'})
});

router.post(('/dangky'), (req, res)=>{
	
		var body = req.body;
		var userungvien = body.usernameungvien;
		var tree = null;
		connection.query('SELECT * FROM db_htx_tap.usermaster WHERE Email=? or Sdt= ?',[body.usernamequanly, body.usernamequanly],function(err, rows ,fields){
		if(body.usernamequanly === body.email || body.usernamequanly === body.sdt && body.capqly==='A1' ){
			tree = body.email;
			console.log('A1:', tree);
		}else 
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
			
	console.log('treecuoi cung:', body.capqly);
		var usermaster={
			"HoTen": body.hoten,
			"Email": body.email,
			"Sdt": body.sdt,
			"Password":body.password,
			"RoleID":"1",
			"Categories":body.capqly,
			"NgaySinh": body.date,
			"NoiSinh": body.noisinh,
			"userQL":body.usernamequanly,
			"TKNH":body.taikhoan,
			"ChinhanhTKNH": body.chinhanh,
			"DiaChi":body.diachi,
			"DateCreate": new Date(),
			"UserCreate" : req.session.UserID,
			"tree": tree
		}
		connection.query('INSERT INTO usermaster SET ?',usermaster , function(err, result,fields) {
			if (err) {
				res.send({
					err
				})
			} else {
				req.flash('success', 'Bạn đã đắng ký thành công')
		 		res.redirect('/dangky')
				res.end();
			}
		});
	});
	
});



//end dang nhap






//danhmucthanh vien
// router.get(('/danhsachthanhvien'),(req, res)=>{
// 	res.render('dsthanhvien',{title: 'Danh sách thành viên'})
// })



// LOGOUT
router.get('/dangxuat',(req,res)=>{
	//session destroy
	req.session.loggedin = false;
	req.session.isAdmin = false;
	console.log('Destroying session'+ req.session.loggedin);
     res.redirect('/');
});
// END OF LOGOUT


module.exports = router;