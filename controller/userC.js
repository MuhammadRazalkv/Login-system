const express = require('express')
const User = require('../model/userM')
const bcrypt = require('bcrypt')
const e = require('express')

//securing password

const securePassword = async password => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    return hashedPassword
  } catch (error) {
    throw error
  }
}

// registering user

const loadRegister = async (req, res) => {
  try {
    res.render('register')
  } catch (error) {
    throw error
  }
}

const insertUser = async (req, res) => {
  try {
    const sPassword = await securePassword(req.body.password)

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      mobile: req.body.mob,
      password: sPassword,
      is_admin:0
    })
    const userData = await user.save()
     
    if (userData) {
      res.redirect('/login')
    }
 
  } catch (error) {
     throw error
   
  }
}

// login methds

const loginLoad = async (req, res) => {
  try {
    res.render('login')
  } catch (error) {
    throw error
  }
}


// const veryfiyLogin = async (req, res) => {
//   try {
//     const email = req.body.email;
//     const password = req.body.password;

//     const userData = await User.findOne({ email: email });

//     if (userData) {
//       const passwordMatch = await bcrypt.compare(password, userData.password);
//       if (passwordMatch) {
//         if (userData.is_admin === 1) {
//           // Prevent admin from logging in
//           res.render('login', { message: 'Admins are not allowed to log in.' });
//         } else {
//           req.session.user_id = userData._id;
//           res.redirect('/home');
//         }
//       } else {
//         res.render('login', { message: 'Email and password incorrect' });
//       }
//     } else {
//       res.render('login', { message: 'Email and password incorrect' });
//     }
//   } catch (error) {
//     throw error;
//     //res.render('errorU',{error:error})
//   }
// };

// Home page

const veryfiyLogin = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const userData = await User.findOne({ email: email });

    if (userData) {
      const passwordMatch = await bcrypt.compare(password, userData.password);
      if (passwordMatch) {
        if (userData.is_admin === 1) {
          // Prevent admin from logging in
          res.render('login', { message: 'Admins are not allowed to log in.' });
        } else {
          req.session.user_id = userData._id;
          // Redirect to home page after successful login
          res.redirect('/home');
        }
      } else {
        // Render login page with error message
        res.render('login', { message: 'Email and password incorrect' });
      }
    } else {
      // Render login page with error message
      res.render('login', { message: 'Email and password incorrect' });
    }
  } catch (error) {
    // Handle error
    console.error(error);
    res.render('errorU', { error: error });
  }
};


const loadHome =  async(req,res)=>{
  try {
  const userData =    await  User.findById({_id:req.session.user_id})
    res.render('home',{user :userData})
  } catch (error) {
  throw error
   //res.render('errorU',{error:error})
  }
}

// User logout

const userLogout = async(req,res)=>{

  try {
    req.session.destroy();
    res.render('login',{logouted:'Logout Success'})
  
    
  } catch (error) {
    throw error
//  res.render('errorU',{error:error})
  }
}

// Profile Updation

const editLoad = async(req,res)=>{
  try {
    
    const id=  req.query.id

    const userData = await User.findById({_id:id})
     
    if (userData) {
      
      res.render('edit',{user:userData})

    }else{
      res.redirect('/home')
    }

  } catch (error) {
  //  throw error
  res.render('errorU',{error:error})
    
  }
}

const errorPage = async(req,res)=>{
  try {
    res.render('errorU',{error:null})
  } catch (error) {
    throw error
  }
}

const updateProfile = async (req, res) => {
  try {
    const { user_id, name, email, mobile } = req.body;

    
    const userData = await User.findByIdAndUpdate(user_id, { name, email, mobile }, { new: true }); 

    if (!userData) {
      res.render('errorU',{error:'User Not Found'})
    }

  
    res.redirect('/home')
  } catch (error) {
   
    console.error("Error updating profile:", error);
   
    res.render('errorU',{error:error})
  }
};


module.exports = {
  loadRegister,
  insertUser,
  loginLoad,
  veryfiyLogin,
  loadHome,
  userLogout,
  editLoad,
  updateProfile,
  errorPage
}
