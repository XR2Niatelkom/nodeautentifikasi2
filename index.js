const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const kendaraanroute = require("./kendaraan")

const adminroute = require("./admin")
const usersroute = require("./users")
const transaksiroute = require("./transaksi")
// const { error } = require("console")
// const { debugPort } = require("process")
// const { strictEqual } = require("assert")

const app = express()
app.use(express.json())
app.use(express.static(__dirname));
app.use(express.urlencoded({extended: true}))
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(kendaraanroute)
app.use(adminroute)
app.use(usersroute)
app.use(transaksiroute)

// app.get("/sewa", (req,res) => {
//     let sql = "select * from sewa"
//     db.query(sql,(error,result) => {
//         let response = null
//         if (error){
//             response = {
//                 message: error.message
//             }
//         } else {
//             response = {
//                 count: result.length,
//                 sewa: result
//             }
//         }
//         res.json(response)
//     })
// })

// app.get("/sewa/:id_penyewaan", (req,res) => {
//     let data = {
//         id_penyewaan:req.params.id_penyewaan
//     }
//     let sql = "select * from sewa where ?"
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
//                 sewa: result
//             }
//         }
//         res.json(response)
//     })
// })

// app.post("/sewa", (req,res) => {
//     let data = {
//         nama: req.body.nama,
//         alamat: req.body.alamat
//     }
//     let sql = "insert into sewa set ?"
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

// app.put("/sewa", (req,res) => {
//     let data = [
//         {
//         nama: req.body.nama,
//         alamat: req.body.alamat,
//     },
//     {
//         id_penyewaan: req.body.id_penyewaan
//     }
//     ]
//     let sql = "update sewa set ? where ?"
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

// app.delete("/sewa/:id_penyewaan", (req,res) => {
//     let data = {
//         id_penyewaan: req.params.id_penyewaan
//     }

//     let sql = "delete from sewa where ?"
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

app.listen(8000,() => {
    console.log("yeay")
})