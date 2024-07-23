const express = require('express')

const admin_Route = express()



const config = require('../config/config')
const session = require('express-session')
admin_Route.use(session({
    secret:config,
    saveUninitialized:true,
    resave:false
}))

const bodyparser = require('body-parser')
admin_Route.use(bodyparser.json())
admin_Route.use(bodyparser.urlencoded({extended:true}))

admin_Route.set('view engine','ejs')
admin_Route.set('views','views/admin')

const adminAuth=   require('../middleware/adminauth')


const adminController = require('../controller/adminC')

admin_Route.get('/',adminAuth.isLogout,adminController.loadLogin)

admin_Route.get('/home',adminAuth.isLogin,adminController.loadDashboard)

admin_Route.post('/',adminController.veryfiyLogin)

admin_Route.get('/logout',adminAuth.isLogin,adminController.logout)

admin_Route.get('/dashboard',adminAuth.isLogin,adminController.adminDashbaord)

admin_Route.get('/new-user',adminAuth.isLogin,adminController.newUserLoad)

admin_Route.post('/new-user',adminAuth.isLogin,adminController.addNewUser)

admin_Route.get('/edit-user',adminAuth.isLogin,adminController.editUserLoad)

admin_Route.post('/edit-user',adminController.updateUser)

admin_Route.get('/delete-user',adminController.deleteUser)


admin_Route.get('/search',adminAuth.isLogin,adminController.searchUser)

admin_Route.get('*',(req,res)=>{
    res.redirect('/admin')
})
module.exports = admin_Route