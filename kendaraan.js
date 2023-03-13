// app.get("/kendaraan", (req,res) => {
//     let sql = "select * from kendaraan"
//     db.query(sql,(error,result) => {
//         let response = null
//         if (error){
//             response = {
//                 message: error.message
//             }
//         } else {
//             response = {
//                 count: result.length,
//                 kendaraan: result
//             }
//         }
//         res.json(response)
//     })
// })

// app.get("/kendaraan/:id_kendaraan", (req,res) => {
//     let data = {
//         id_kendaraan:req.params.id_kendaraan
//     }
//     let sql = "select * from kendaraan where ?"
//     db.query(sql,data, (error, result) => {
//         let response = null 
//         if (error){
//             response = {
//                 message: error.message
//             }
//         } 
//         else {
//             response = {
//                 count: result.length,
//                 kendaraan: result
//             }
//         }
//         res.json(response)
//     })
// })


// app.post("/kendaraan", (req,res) => {
//     let data = {
//         nopol: req.body.nopol,
//         warna: req.body.warna,
//         kondisi_kendaraan: req.body.kondisi_kendaraan
//     }
//     let sql = "insert into kendaraan set ?"
//     db.query(sql,data,(error,result) => {
//         let response = null 
//         if (error) {
//             response = {
//                 message: error.message
//             }
//         } 
//         else {
//             response = {
//                 message: result.affectedRows + " data inserted"
//             }
//         }
//         res.json(response)
//     })
// })

// app.put("/kendaraan", (req,res) => {
//     let data = [
//         {
//           nopol: req.body.nopol,
//           warna: req.body.warna,
//           kondisi_kendaraan: req.body.kondisi_kendaraan
//     },
//     {
//         id_kendaraan: req.body.id_kendaraan
//     }
//     ]
//     let sql = "update kendaraan set ? where ?"
//     db.query(sql,data,(error,result) => {
//         let response = null
//         if (error) {
//             response = {
//                 message: error.message
//             }
//         }
//         else {
//             response = {
//                 message: result.affectedRows + " data updated"
//             }
//         }
//         res.json(response)
//     })
// })

// app.delete("/kendaraan/:id_kendaraan", (req,res) => {
//     let data = {
//         id_kendaraan: req.params.id_kendaraan
//     }

//     let sql = "delete from kendaraan where ?"
//     db.query(sql,data,(error,result) =>{
//         let response = null 
//         if(error) {
//             response = {
//                 message: error.message
//             }
//         }
//         else {
//             response = {
//                 message: result.affectedRows + " data deleted"
//             }
//         }
//         res.json(response)
//     })
// })

const express = require("express") 
const router = express.Router() 
const db = require("./db") 
 
const multer = require("multer") 
const path = require("path") 
const fs = require("fs")  
 
const storage = multer.diskStorage({ 
    destination: (req, file, cb) => { 
        cb(null, './image') 
    }, 
    filename: (req, file, cb) => { 
        cb(null, "image-"+ Date.now() + path.extname(file.originalname)) 
    } 
}) 
 
let upload = multer({storage: storage}) 
 
//---------------------------------------------- Pelanggaran ------------------------------------------------------ 
 
//end-point akses data pelanggaran 
router.get("/kendaraan", (req, res) => { 
    //create sql query 
    let sql = "select * from kendaraan" 
 
    //run query 
    db.query(sql, (error, result) => { 
        let response = null 
        if (error) { 
            response = { 
                message: error.message //pesan error 
            } 
        } else { 
            response = { 
                count: result.length, //jumlah data 
                pelanggaran: result //isi data 
            } 
        } 
        res.json(response) //send response 
    }) 
}) 
 
//end point akses data pelanggaran berdasarkan id_pelanggaran tertentu 
router.get("/kendaraan/:id_kendaraan", (req, res) => { 
    let data = { 
        id_kendaraan: req.params.id_kendaraan 
    } 
    //create sql query 
    let sql = "select * from kendaraan where ?" 
 
    //run query 
    db.query(sql, data, (error, result) => { 
        let response = null 
        if (error) { 
            response = { 
                message: error.message //pesan error 
            } 
        } else { 
            response = { 
                count: result.length, //jumlah data 
                pelanggaran: result //isi data 
            } 
        } 
        res.json(response) //send response 
    }) 
}) 
 
//end point menyimpan data pelanggaran 
router.post("/kendaraan", upload.single("image"), (req, res) => { 
 
    //prepare data 
    let data = { 
        nopol: req.body.nopol, 
        warna: req.body.warna,
        kondisi_kendaraan: req.body.kondisi_kendaraan, 
        image: req.file.filename 
    } 
 
    if(!req.file){ 
        res.json({ 
            message: "Tidak ada file yang dikirim" 
        }) 
    } else { 
        let sql = "insert into kendaraan set ?" 
        db.query(sql, data, (error, result) => { 
            if(error) throw error 
            res.json({ 
                message: result.affectedRows + " data berhasil disimpan" 
            }) 
        }) 
    } 
}) 
 
//end point mengubah data pelanggaran 
router.put("/kendaraan", upload.single("image"), (req, res) => { 
 
    let data = null, sql= null 
    let param = { id_kendaraan: req.body.id_kendaraan } 
 
    if (!req.file) { 
        data = { 
            nopol: req.body.nopol, 
            warna: req.body.warna,
            kondisi_kendaraan: req.body.kondisi_kendaraan
        } 
    } else { 
        data = { 
            nopol: req.body.nopol, 
            warna: req.body.warna,
            kondisi_kendaraan: req.body.kondisi_kendaraan,
            image: req.file.filename 
        } 
    } 
 
    sql = "select * from kendaraan where ?" 
 
    db.query(sql, param, (err, result) => { 
        if (err) throw err 
        let fileName = result[0].image 
 
        let dir = path.join(__dirname, "image", fileName) 
        fs.unlink(dir, (error) => {}) 
    }) 
 
    sql = "update kendaraan set ? where ?" 
 
    db.query(sql, [data,param], (error, result) => { 
        if (error) { 
            res.json({ 
                message: error.message 
            }) 
        } else { 
            res.json({ 
                message: result.affectedRows + " data berhasil diubah" 
            }) 
        } 
    }) 
 
}) 
 
//end point menghapus data pelanggaran berdasarkan id_pelanggaran 
router.delete("/kendaraan/:id_kendaraan", (req, res) => { 
    //prepare data 
    let param = {id_kendaraan: req.params.id_kendaraan} 
 
    //create query sql delete 
    let sql = "select * from kendaraan where ?" 
 
    db.query(sql, param, (error, result) => { 
        if (error) throw error

        let fileName = result[0].image 
        let dir = path.join(__dirname, "image", fileName) 
        fs.unlink(dir, (error) => {}) 
    }) 
 
    sql = "delete from kendaraan where ?" 
    db.query(sql, param, (error, result) => { 
        if (error) { 
            res.json({ 
                message: error.message 
            }) 
        } else { 
            res.json({ 
                message: result.affectedRows + " data berhasil dihapus" 
            }) 
        } 
    }) 
}) 
 
module.exports = router