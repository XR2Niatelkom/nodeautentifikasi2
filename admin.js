const express = require("express")
const router = require("./kendaraan")
const db = require("./db")
const Crypt = require("cryptr")
const crypt = new Crypt("123456")
const md5 = require("md5")
// const { use } = require("./kendaraan")

validateToken = () => {
    return (req, res, next) => {
        if (!req.get("Token")) {
            res.json({
                message: "Access Forbidden"
            })
        } else {
            let token = req.get("Token")
            let decryptToken = crypt.decrypt(token)
            let sql = "select * from admin where ?"
            let param = { id_admin: decryptToken }

            db.query(sql, param, (error, result) => {
                if (error) throw error
                if (result.length > 0) {
                    next()
                } else {
                    res.json({
                        message: "Invalid Token"
                    })
                }
            })
        }
    }
}

router.get("/admin", (req, res) => {
    let sql = "select * from admin"
    db.query(sql, (error, result) => {
        let response = null
        if (error) {
            response = {
                message: error.message
            }
        } else {
            response = {
                count: result.length,
                admin: result
            }
        }
        res.json(response)
    })
})

router.get("/admin/:id_admin", (req, res) => {
    let data = {
        id_admin: req.params.id_admin
    }
    let sql = "select * from admin where ?"
    db.query(sql, data, (error, result) => {
        let response = null
        if (error) {
            response = {
                message: error.message
            }
        }
        else {
            response = {
                count: result.length,
                admin: result
            }
        }
        res.json(response)
    })
})

router.post("/admin", (req, res) => {
    let data = {
        nama_admin: req.body.nama_admin,
        status_admin: req.body.status_admin,
        keterangan: req.body.keterangan,
        username: req.body.username,
        password: md5(req.body.password)
    }
    let sql = "insert into admin set ?"
    db.query(sql, data, (error, result) => {
        let response = null
        if (error) {
            response = {
                message: error.message
            }
        }
        else {
            response = {
                message: result.affectedRows + " data inserted"
            }
        }
        res.json(response)
    })
})

router.post("/admin/auth", (req, res) => {
    let param = [
        req.body.username,
        md5(req.body.password)
    ]

    let sql = "select * from admin where username = ? and password = ?"
    db.query(sql, param, (error, result) => {
        if (error) throw error
        if (result.length > 0) {
            res.json({
                message: "logged",
                token: crypt.encrypt(result[0].id_admin),
                data: result
            })
        } else {
            res.json({
                message: "invalid username/password"
            })
        }
    })
})

router.put("/admin", (req, res) => {
    let data = [
        {
            nama_admin: req.body.nama_admin,
            status_admin: req.body.status_admin,
            keterangan: req.body.keterangan,
            username: req.body.password,
            password: md5(req.body.password)
        },
        {
            id_admin: req.body.id_admin
        }
    ]
    let sql = "update admin set ? where ?"
    db.query(sql, data, (error, result) => {
        let response = null
        if (error) {
            response = {
                message: error.message
            }
        }
        else {
            response = {
                message: result.affectedRows + " data updated"
            }
        }
        res.json(response)
    })
})

router.delete("/admin/:id_admin", (req, res) => {
    let data = {
        id_admin: req.params.id_admin
    }

    let sql = "delete from admin where ?"
    db.query(sql, data, (error, result) => {
        let response = null
        if (error) {
            response = {
                message: error.message
            }
        }
        else {
            response = {
                message: result.affectedRows + " data deleted"
            }
        }
        res.json(response)
    })
})

module.exports = router