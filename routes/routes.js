const express = require('express');
const router = express.Router();
const User = require('../models/users');
const multer = require('multer');
const fs = require('fs');

//image upload
var storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads');
    },
    filename: function(req, file, cb){
        cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
});
var upload = multer({storage:storage}).single('image');

// insert an user into db route
router.route('/add')
    .get((req, res)=>{
        res.render('add_users', {title: "Add Users"});
    })
    .post(upload, (req, res)=>{
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            image: req.file.filename,
        });
        console.log(req.file);
        console.log(req.file.filename);
        user.save().then(()=>{
            req.session.message = {
                type: 'success',
                message: 'User added successfuly!',
            };
            res.redirect("/");
        }).catch((err)=>{
            res.json({message: err.message, type: "danger"});
            console.log(err);
        });
    })
    

// get all users route
router.route('/')
    .get(async(req, res)=>{
        try{
            const users = await User.find();
            res.render("index",{
                title: 'Home Page',
                users: users,
            });
        }catch(err){
            res.json({message: err.message});
        }
    });

// Edit an user
router.get('/edit/:id', async(req, res)=>{
    let id = req.params.id;
    const user = await User.findById(id);
    if(!user){
        return res.redirect('/');
    }
    res.render("edit_users", {
        title: "Edit User",
        user: user,
    });
});
// update user route
router.post('/update/:id',upload,  async(req, res)=>{
    let id =req.params.id;
    let new_image = '';
    if(req.file){
        new_image = req.file.filename;
        try{
            fs.unlinkSync('./uploads/' + req.body.old_image);
        }catch(err){
            console.log(err);
        }
    }else{
        new_image = req.body.old_image;
    }
    try{
        await User.findByIdAndUpdate(id, {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            image: new_image
        });
        req.session.message = {
            type: "success",
            message: "User update successfully!",
        };
        res.redirect('/');
    }catch(err){
        res.json({message: err.message, type: "danger"});
    }
});

// delete user route
router.get('/delete/:id', async(req, res)=>{
    let id = req.params.id;
    const result = await User.findByIdAndRemove(id);
    if(result.image != ''){
        try{
            fs.unlinkSync('./uploads/' + result.image);
        }catch(err){
            console.log(err);
        }
    }
    if(!result){
        res.json({message: err.message});
    }else{
        req.session.message = {
            type: 'info',
            message: 'User deleted successfuly!',
        };
        res.redirect('/');
    }
});

module.exports = router;