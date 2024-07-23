const User = require('../model/userM')
const bcrypt = require('bcrypt')

const loadLogin = async (req, res) => {
  try {
    res.render('login')
  } catch (error) {
    throw error
  }
}



const veryfiyLogin = async (req, res) => {
  try {
    const email = req.body.email
    const password = req.body.password

    const userData = await User.findOne({ email: email })
    if (userData) {
      const passwordMatch = await bcrypt.compare(password, userData.password)
      if (passwordMatch) {
        if (userData.is_admin === 0) {
          res.render('login', { message: 'Email and password is incorrect' })
        } else {
          req.session.user_id = userData._id
          
          res.redirect('/admin/home')
         
        }
      } else {
        res.render('login', { message: 'Email and password is incorrect' })
      }
    } else {
      res.render('login', { message: 'Email and password is incorrect' })
    }
  } catch (error) {
    throw error
  }
}

const loadDashboard = async (req, res) => {
  try {
    const userData = await User.findById({ _id: req.session.user_id })
    res.render('home', { admin: userData })
  } catch (error) {
    throw error
  }
}

const logout = async (req, res) => {
  try {
    req.session.destroy()
    res.redirect('/admin')
  } catch (error) {
    throw error
  }
}

const adminDashbaord = async (req, res) => {
  try {
    const userData = await User.find({ is_admin: 0 })
    res.render('dashboard', { users: userData })
    // console.log(userData)
  } catch (error) {
    throw error
  }
}

// Adding new user

const securePassword = async password => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    return hashedPassword
  } catch (error) {
    throw error
  }
}


const newUserLoad = async (req, res) => {
  try {
    res.render('new-user')
  } catch (error) {
    throw error
  }
}

const addNewUser = async (req, res) => {
  try {

    const name = req.body.name
    const email = req.body.email
    const mobile = req.body.mob
    const password = req.body.password
    
    const sPassword = await securePassword(password)


    const user = new User({
      name: name,
      email: email,
      mobile: mobile,
      password: sPassword,
      is_admin: 0
    })

    const userData = await user.save()

    if (userData) {
      res.redirect('/admin/dashboard')
    } else {
      res.render('new-user', { message: 'Something Went Wrong' })
    }
  } catch (error) {
    throw error
  }
}

// Edit user by admin

const editUserLoad = async (req, res) => {
  try {
    const id = req.query.id
    const userData = await User.findById({ _id: id })
    if (userData) {
      res.render('edit-user', { user: userData })
    } else {
      res.redirect('/admin/dashboard')
    }
  } catch (error) {
    throw error
  }
}

const updateUser = async (req, res) => {
  try {
    const userData = await User.findByIdAndUpdate(
      { _id: req.body.id },
      {
        $set: {
          name: req.body.name,
          email: req.body.email,
          mobile: req.body.mob
        }
      }
    )
    res.redirect('/admin/dashboard')
  } catch (error) {
    throw error
  }
}

// deleting User

const deleteUser = async (req, res) => {
  try {
    const id = req.query.id
    if (id) {
        
        await User.deleteOne({ _id: id })
        res.redirect('/admin/dashboard')
    }
     else{
        res.send("somthing worong")
     }
  } catch (error) {
    throw error
  }
}
const searchUser = async (req,res) => {
    try {
        let users=[];
        if(req.query.search) {
            users=await User.find({name: {$regex: req.query.search,$options: 'i'}});
        } else {
            users=await User.find();
        }
        res.render('dashboard',{users: users});
    } catch(error) {
        console.log(error.message);
        res.render('error');
    }
};
 

 

module.exports = {
  loadLogin,
  veryfiyLogin,
  loadDashboard,
  logout,
  adminDashbaord,
  newUserLoad,
  addNewUser,
  editUserLoad,
  updateUser,
  deleteUser,
  searchUser
}
