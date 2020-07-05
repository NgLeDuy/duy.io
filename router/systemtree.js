const express = require('express')
const router = express.Router()
const mysql = require('mysql')
const connection = require('../BD/config.js')

//chuyen trang
router.get('/', (req, res)=>{
    var sql="SELECT * FROM usermaster Group by tree ORDER BY tree"; 
    connection.query(sql, (err, results)=>{
        for(var i = 1 ; i< results.lenght; i++){   
        }
        connection.query('SELECT * FROM usermaster '  , (err, row)=>{
            if(err) throw err;
                res.render('systemtree',{
                    results: results,
                    row: row, title: 'Cây hệ thống'});
             })
    })
})

// router.get('/', (req, res)=>{
//         var sql="SELECT * FROM usermaster Group by tree ORDER BY tree"; 
//         connection.query(sql, (err, results)=>{
//             var result_array = [];

//   for (var i = 0; i < results.length; i++) {
//       result_array[i] = results[i].tree;
//     }
            
//             connection.query('SELECT * FROM usermaster', (err, row)=>{
//                 if(err) throw err;
//                 console.log(result_array);
//                 console.log('row:', row);
//                     res.render('systemtree',{
//                         results1: result_array,
//                         row: row, title: 'Cây hệ thống'});
//                  })
//         })
//     })





module.exports = router;