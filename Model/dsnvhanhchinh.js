var connection = require('../BD/config.js');
var usermaster={
    "HoTen": body.hoten,
    "Email": body.email,
    "Sdt": body.sdt,
    "Password":body.password,
    "RoleID":"1",
    "Categories": body.capqly,
    "NgaySinh": body.date,
    "NoiSinh": body.noisinh,
    "userQL":body.usernamequanly,
    "TKNH":body.taikhoan,
    "ChinhanhTKNH": body.chinhanh,
    "DiaChi":body.diachi,
    // "DateCreate": new Date(),
    "UserCreate" : req.session.UserID
}



var NhanVien = {
    getAllNhanVien:(callback)=> {
		return db.query("Select * from usermaster",usermaster,(callback));
    },
    
    addNhanVien:function(sinhvien,callback){
        DateCreate = new Date(); 
		return db.query("Insert into usermaster SET usermaster, DateUpdate? ",[usermaster, DateCreate],callback);
	},

    deleteNhanVien:function(id,callback){
		return db.query(" update from usermaster set DeleteFlage=? where Id=?",[id],callback);
	},
	updateSV:function(id,sinhvien,callback){
		return db.query("update sinhvien set DateUpdate? where Id=?",[sinhvien.name,sinhvien.class,sinhvien.dob,id],callback);
	}


};

module.exports=NhanVien;