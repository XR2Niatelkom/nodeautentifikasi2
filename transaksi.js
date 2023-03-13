const express = require("express") 
const router = express.Router() 
const db = require("./db") 
const moment = require("moment") 
const { response } = require("express")
 
//---------------------------------------------- Transaksi ------------------------------------------------------ 
 
router.post("/sewa", (req, res) => { 
    let data = { 
        id_user: req.body.id_user,
        id_admin: req.body.id_admin,
        waktu: moment().format('YYYY-MM-DD HH:mm:ss'),
        tgl_pengembalian: req.body.tgl_pengembalian,
        total_bayar:req.body.total_bayar
    } 
 
    let kendaraan = JSON.parse(req.body.kendaraan) 
 
    let sql = "insert into sewa set ?" 
 
    //run query 
    db.query(sql, data, (error, result) => { 
        let response = null 
 
        if (error) { 
            res.json({ message: error.message }) 
        } else { 
 
            let masukkanid = result.insertId 
 
            // let data = [] 
            // for (let index = 0; index < penyewaaan.length; index++) { 
            //     data.push([ 
            //         lastID, penyewaaan[index].id_penyewaan
            //     ]) 
            // } 
            let dataKendaraan= []
            for (const item of kendaraan){
                dataKendaraan.push([masukkanid, item.id_kendaraan])
            }

            let sql = "insert into detail_penyewaan values ?" 
 
            db.query(sql, [dataKendaraan], (error, result) => { 
                if (error) { 
                    res.json({ message: error.message }) 
                } else { 
                    res.json({ message: "Data has been inserted" }) 
                } 
            }) 
        } 
    }) 
}) 
 
// router.get("/sewa", (req, res) => { 
//     //create sql query 
//     // let sql = "select sewa.id_penyewaan,sewa.waktu,sewa.id_user,sewa.id_admin,sewa.tgl_pengembalian,sewa.total_bayar, admin.id_admin,admin.nama_admin,admin.status_admin,admin.keterangan, users.id_user,users.username from sewa join admin on sewa.id_admin = admin.id_admin join users on sewa.id_user = users.id_user" 
 
//     //run query 

//     let sql = " select sewa.id_penyewaan, sewa.waktu, sewa.id_user, sewa.id_admin, sewa.tgl_pengembalian, sewa.total_bayar, admin.id_admin, admin.nama_admin, admin.status_admin, admin.keterangan, users.id_user, users.username, users.password from sewa join users on sewa.id_user = users.id_user join admin on sewa.id_admin = admin.id_admin"

//     db.query(sql, (error, result) => { 
//         if (error) { 
//             res.json({ message: error.message }) 
//         } else { 
//             res.json({ 
//                 count: result.length, 
//                 sewa: result 
//             }) 
//         } 
//     }) 
// }) 

// router.get("/sewa/:id_penyewaan", (req,res) => { 
//     let param = { id_penyewaan: req.params.id_penyewaan } 
 
//     // create sql query 
//     let sql = "select sewa.id user, sewa.id_admin, sewa.waktu, sewa.tgl_pengembalian, sewa.total_bayar " +  
//     "from detail_penyewaan dps join kendaraan k "+ 
//     "on s.id_penyewaan= dps.id_penyewaan " + 
//     "where ?" 
 
//     db.query(sql, param, (error, result) => { 
//         if (error) { 
//             res.json({ message: error.message})    
//         }else{ 
//             res.json({ 
//                 count: result.length, 
//                 sewa: result 
//             }) 
//         } 
//     }) 
// }) 

router.get("/sewa", (req,res) => {
    
    db.query(`select s.id_penyewaan, s.waktu, s.id_user, s.id_admin, s.tgl_pengembalian, s.total_bayar, a.id_admin, a.nama_admin, a.status_admin, a.keterangan, u.id_user, u.username, u.password from sewa s join users u on s.id_user = u.id_user join admin a on s.id_admin = a.id_admin `, (error, result) => {
        if (error){
              res.json({message: error.message})
        } else {
            res.json({
                count: result.length,
                sewa: result
            })
        }
    })
})

router.get("/sewa/:id_penyewaan", (req,res) => {
    let data = {
        id_penyewaan:req.params.id_penyewaan
    }
    
    let sql = "select sewa.id user, sewa.id_admin, sewa.waktu, sewa.tgl_pengembalian, sewa.total_bayar " + 
    "from detail_penyewaan dps join kendaraan k "+ 
    "on s.id_penyewaan= dps.id_penyewaan " + 
    "where ?" 
    db.query(sql,data, (error, result) => {
        let response = null 
        if (error){
            response = {
                message: error.message
            }
        } 
        else {
            response = {
                count: result.length,
                sewa: result
            }
        }
        res.json(response)
    })
})


//end point untuk menghapus data pelanggaran_siswa 
router.delete("/sewa/:id_penyewaan", (req, res) => { 
    let param = { id_penyewaan: req.params.id_penyewaan } 
 
    //create sql query delete detail_pelanggaran 
    let sql = "delete from detail_penyewaan where ?" 
 
    db.query(sql, param, (error, result) => { 
        if (error) { 
            res.json({ message: error.message }) 
        } else { 
            let param = { id_penyewaan: req.params.id_penyewaan } 
 
            //create sql query delete sewa
            let sql = "delete from sewa where ?" 
 
            db.query(sql, param, (error, result) => { 
                if (error) { 
                    res.json({ message: error.message }) 
                } else { 
                    res.json({ message: "Data has been deleted" }) 
                } 
            }) 
        } 
    }) 
}) 
 
module.exports = router