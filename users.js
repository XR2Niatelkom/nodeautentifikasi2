const express = require("express")
const router = express.Router()
const db = require("./db")
const Crypt = require ("cryptr")
const md5 = require("md5")
const crypt = new Crypt("123456")

validateToken = () => {
    return (req, res, next) => {
        if(!req.get("Token")) {
            res.json({
                message: "Access Forbidden"
            })
        } else {
            let token = req.get("Token")
            let decryptToken = crypt.decrypt(token)
            let sql = "select * from users where ?"
            let param = { id_user: decryptToken}

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

router.get("/users", (req,res) => {
    let sql = "select * from users"
    db.query(sql,(error,result) => {
        let response = null
        if (error){
            response = {
                message: error.message
            }
        } else {
            response = {
                count: result.length,
                users: result
            }
        }
        res.json(response)
    })
})

router.get("/users/:id_user", (req,res) => {
    let data = {
        id_user:req.params.id_user
    }
    let sql = "select * from users where ?"
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
                users: result
            }
        }
        res.json(response)
    })
})


router.post("/users", (req,res) => {
    let data = {
       username: req.body.username,
       password: md5(req.body.password)
    }
    let sql = "insert into users set ?"
    db.query(sql,data,(error,result) => {
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

router.post("/users/auth", (req, res) => {
    let param = [
        req.body.username,
        md5(req.body.password)
    ]

    let sql = "select * from users where username = ? and password = ?"
    db.query(sql, param, (error, result) => {
        if (error) throw error
        if (result.length > 0) {
            res.json({
                message: "logged",
                token: crypt.encrypt(result[0].id_user),
                data: result
            })
        } else {
            res.json({
                message: "invalid username/password"
            })
        }
    })
})

router.put("/users", (req,res) => {

    let data = [
        {
        username: req.body.username,
        password: md5(req.body.password)
        },
    {
        id_user:req.body.id_user
    }
    ]
    let sql = "update users set ? where ?"
    db.query(sql,data,(error,result) => {
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

router.delete("/users/:id_user", (req,res) => {
    let data = {
        id_user: req.params.id_user
    }

    let sql = "delete from users where ?"
    db.query(sql,data,(error,result) =>{
        let response = null 
        if(error) {
            response = {
                message: error.message
            }
        }
        else {
            response = {
                message: result.affectedRows + "data deleted"
            }
        }
        res.json(response)
    })
})

module.exports = router